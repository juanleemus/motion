#!/usr/bin/env python3
"""Modo burbuja: video largo cuando NO hay cámara a cuadro completo, solo el círculo de Mateo de un export compuesto
de Tella (pantalla + burbuja). La capa gráfica ocupa el cuadro a la izquierda de `x` y Mateo va en un círculo fijo a
la derecha, con el aro de la marca.

Uso:
  burbuja.py <proyecto> fondo      → corte-limpio.mp4 (grilla de la marca + voz a −14 LUFS) y voz.wav, en renders/(borrador/)
  burbuja.py <proyecto> componer   → final-graficos.mp4 (solo la capa gráfica) y final-burbuja.mp4 (con el círculo)
Entre los dos pasos van escenas.py y componer.py con BURBUJA=<x> en el entorno (lo exporta run de abajo):
  VIDEO_BORRADOR=1 BURBUJA=1480 python3 escenas.py <proyecto>

<proyecto>/burbuja.json:
  {"fuente": "raw/tella-compuesto.mp4", "centro": [3494, 1342], "radio": 255,   ← círculo en el video fuente (px)
   "x": 1480, "cx": 1680, "cy": 540, "d": 400}                                 ← zona libre y círculo en 1920×1080
"""
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from perfil import ENC, ESC, FPS, H, LUFS, LRA, TP, W, salidas  # noqa: E402

AZUL = (31, 139, 255)  # --mf-blue


def cfg(proj: str) -> dict:
    return json.load(open(os.path.join(proj, "burbuja.json")))


def sh(cmd: list[str]) -> None:
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(" ".join(cmd[:8]) + "\n" + r.stderr[-2500:])


def fondo(proj: str) -> None:
    c = cfg(proj)
    src = os.path.join(proj, c["fuente"])
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src],
                               capture_output=True, text=True).stdout)
    voz = salidas(proj, "voz.wav")
    sh(["ffmpeg", "-hide_banner", "-y", "-i", src, "-vn", "-af", f"loudnorm=I={LUFS}:TP={TP}:LRA={LRA}", "-ar", "48000", voz])
    paso = round(54 * ESC)
    vf = f"drawgrid=w={paso}:h={paso}:t=1:c=white@0.05,format=yuv420p"
    sh(["ffmpeg", "-hide_banner", "-y", "-f", "lavfi", "-i", f"color=c=0x0A0F1A:s={W}x{H}:r={FPS}:d={dur:.3f}", "-i", voz,
        "-vf", vf, *ENC, "-c:a", "aac", "-b:a", "192k", "-shortest", salidas(proj, "corte-limpio.mp4")])
    json.dump({"duration": round(dur, 3), "shots": [{"clip": 1, "src_in": 0, "src_out": round(dur, 3), "tl_in": 0}], "zooms": []},
              open(os.path.join(proj, "edl.json"), "w"))
    print(f"fondo {dur:.1f} s → {salidas(proj, 'corte-limpio.mp4')}")


def mascaras(proj: str, d: int) -> tuple[str, str]:
    """Máscara del círculo (alfa con borde suave) y aro de la marca con sombra, a d px de diámetro."""
    from PIL import Image, ImageDraw, ImageFilter
    work = os.path.join(proj, "work")
    S = 4  # supermuestreo para bordes limpios
    m = Image.new("L", (d * S, d * S), 0)
    ImageDraw.Draw(m).ellipse([0, 0, d * S - 1, d * S - 1], fill=255)
    m = m.resize((d, d), Image.LANCZOS)
    fm = os.path.join(work, f"burbuja-mascara-{d}.png")
    m.save(fm)
    pad = round(d * 0.12)
    D = d + 2 * pad
    aro = Image.new("RGBA", (D * S, D * S), (0, 0, 0, 0))
    g = ImageDraw.Draw(aro)
    w = max(2, round(d * 0.018)) * S
    g.ellipse([pad * S - w, pad * S - w, (pad + d) * S + w, (pad + d) * S + w], outline=AZUL + (255,), width=w)
    aro = aro.resize((D, D), Image.LANCZOS)
    brillo = aro.filter(ImageFilter.GaussianBlur(d * 0.03))
    sombra = Image.new("RGBA", (D, D), (0, 0, 0, 0))
    ImageDraw.Draw(sombra).ellipse([pad, pad + round(d * 0.03), pad + d, pad + d + round(d * 0.03)], fill=(0, 0, 0, 150))
    sombra = sombra.filter(ImageFilter.GaussianBlur(d * 0.05))
    hueco = Image.new("L", (D, D), 255)
    ImageDraw.Draw(hueco).ellipse([pad, pad, pad + d, pad + d], fill=0)
    sombra.putalpha(Image.composite(sombra.getchannel("A"), Image.new("L", (D, D), 0), hueco))
    out = Image.alpha_composite(Image.alpha_composite(sombra, brillo), aro)
    fa = os.path.join(work, f"burbuja-aro-{d}.png")
    out.save(fa)
    return fm, fa


def componer(proj: str) -> None:
    c = cfg(proj)
    graf = salidas(proj, "final.mp4")
    solo = salidas(proj, "final-graficos.mp4")
    if os.path.exists(solo):
        os.remove(solo)
    os.link(graf, solo) if os.stat(graf).st_dev == os.stat(os.path.dirname(solo)).st_dev else sh(["cp", graf, solo])
    d = round(c["d"] * ESC)
    fm, fa = mascaras(proj, d)
    (x0, y0), r = c["centro"], c["radio"]
    pad = round(d * 0.12)
    cx, cy = round(c["cx"] * ESC), round(c["cy"] * ESC)
    g = (f"[1:v]crop={2 * r}:{2 * r}:{x0 - r}:{y0 - r},scale={d}:{d}:flags=lanczos,fps={FPS},format=rgba[cam];"
         f"[2:v]format=gray,scale={d}:{d}[m];[cam][m]alphamerge[circ];"
         f"[0:v][3:v]overlay={cx - d // 2 - pad}:{cy - d // 2 - pad}[a];"
         f"[a][circ]overlay={cx - d // 2}:{cy - d // 2}:shortest=1,format=yuv420p[v]")
    sh(["ffmpeg", "-hide_banner", "-y", "-i", graf, "-i", os.path.join(proj, c["fuente"]), "-loop", "1", "-i", fm,
        "-loop", "1", "-i", fa, "-filter_complex", g, "-map", "[v]", "-map", "0:a", *ENC, "-c:a", "copy",
        "-movflags", "+faststart", salidas(proj, "final-burbuja.mp4")])
    print(f"→ {solo}\n→ {salidas(proj, 'final-burbuja.mp4')}")


if __name__ == "__main__":
    {"fondo": fondo, "componer": componer}[sys.argv[2]](sys.argv[1])
