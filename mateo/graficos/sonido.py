#!/usr/bin/env python3
"""Efectos de sonido sutiles para la capa gráfica, a partir de public/<slug>/timeline.json.

Uso: python3 sonido.py <slug> [video.mp4]
  → public/<slug>/efectos.wav (solo efectos) y public/<slug>/mezcla.wav (voz + efectos)
  → si se da el video, out/<nombre>-sfx.mp4 con la mezcla (el video se copia, no se re-renderiza)

Sonidos de textura (ruido filtrado, como foley de interfaz), nada de tonos de sintetizador:
  entra una escena     → soplido suave que sube
  se desvanece          → soplido corto que baja, más bajo
  entra un elemento     → clic seco
  se enciende la clave  → tic agudo, muy bajo
  cae una cifra         → golpe grave con clic
Nivel: el bus de efectos queda ~18 LU por debajo de la voz, para que acompañe sin competir.
"""
import json
import os
import subprocess
import sys

import numpy as np
import pyloudnorm as pyln
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
DEBAJO_LU = 18.0  # cuánto más bajo que la voz va el bus de efectos (en LUFS)
PICO_DB = -21.0   # dBFS: ningún efecto pasa de aquí (la voz pica en −1)
SEP = 0.12        # s: dos eventos más juntos que esto se funden en uno
rng = np.random.default_rng(7)


def bp(x, a, b, o=2):
    return sosfilt(butter(o, [a, b], "band", fs=SR, output="sos"), x)


def lp(x, fc, o=2):
    return sosfilt(butter(o, fc, "low", fs=SR, output="sos"), x)


def env(n, a, d):
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d)


def clic():
    n = int(0.03 * SR)
    ruido = bp(rng.standard_normal(n), 1800 + rng.uniform(-200, 200), 6500) * env(n, 0.0004, 0.0035)
    x = np.arange(n) / SR
    cuerpo = np.sin(2 * np.pi * (1100 + rng.uniform(-80, 80)) * x) * env(n, 0.0005, 0.006) * 0.35
    return (ruido + cuerpo) * 0.9


def tic():
    n = int(0.02 * SR)
    return bp(rng.standard_normal(n), 4500, 11000) * env(n, 0.0003, 0.0022) * 0.5


def golpe():
    n = int(0.16 * SR)
    x = np.arange(n) / SR
    f = 150 * np.exp(-x * 9) + 70
    g = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.05)
    out = lp(g, 400) * 1.2
    out[: int(0.03 * SR)] += clic()[: int(0.03 * SR)] * 0.7
    return out


def soplido(dur, sube=True):
    n = int(dur * SR)
    r = rng.standard_normal(n)
    r = np.cumsum(r) * 0.02 + r * 0.6  # ruido más oscuro, menos sibilante
    x = np.linspace(0, 1, n)
    # barrido del filtro: se aproxima con bloques de banda que se cruzan
    out = np.zeros(n)
    bandas = [(300, 900), (600, 1800), (1200, 3500), (2400, 6000)]
    for k, (a, b) in enumerate(bandas):
        c = (k + 0.5) / len(bandas)
        c = c if sube else 1 - c
        peso = np.exp(-((x - c) ** 2) / 0.04)
        out += bp(r, a, b) * peso
    forma = np.sin(np.pi * x) ** 1.6 if sube else np.sin(np.pi * np.minimum(1, x * 1.3)) ** 1.4
    return out * forma * 0.55


def frames(x, out, clave=None):
    """Recorre la escena y junta los cuadros de cada clave ("f", "kf")."""
    if isinstance(x, dict):
        for k, v in x.items():
            if k in ("f", "kf", "ft", "fp", "fa", "fe", "ff") and isinstance(v, (int, float)):
                out.append((k, v))
            else:
                frames(v, out)
    elif isinstance(x, list):
        for v in x:
            frames(v, out)
    return out


def main() -> None:
    slug = sys.argv[1]
    base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", slug)
    tl = json.load(open(os.path.join(base, "timeline.json")))
    fps, total = tl["fps"], tl["frames"] / tl["fps"]
    ev = []  # (segundo, tipo)
    for e in tl["escenas"]:
        a, b = e["desde"] / fps, e["hasta"] / fps
        ev.append((a, "entra"))
        ev.append((b - 7 / fps, "sale"))
        for k, f in frames({k: v for k, v in e.items() if k not in ("desde", "hasta")}, []):
            t = f / fps
            if not a - 0.05 <= t < b - 0.2:
                continue
            ev.append((t, "clave" if k == "kf" else ("cifra" if e["tipo"] == "cifra" and k == "f" else "elemento")))
    # orden y fusión: el evento más fuerte gana dentro de SEP
    rango = {"cifra": 4, "entra": 3, "elemento": 2, "sale": 1, "clave": 0}
    ev.sort()
    limpio = []
    for t, k in ev:
        if limpio and t - limpio[-1][0] < SEP:
            if rango[k] > rango[limpio[-1][1]]:
                limpio[-1] = (limpio[-1][0], k)
            continue
        limpio.append((t, k))
    n = int((total + 1) * SR)
    bus = np.zeros((n, 2))
    gen = {"entra": lambda: soplido(0.42, True) * 0.8, "sale": lambda: soplido(0.28, False) * 0.45,
           "elemento": lambda: clic() * 0.8, "clave": lambda: tic() * 0.6, "cifra": golpe}
    adel = {"entra": 0.18, "sale": 0.0, "elemento": 0.0, "clave": 0.0, "cifra": 0.0}  # el soplido culmina en la entrada
    for t, k in limpio:
        x = gen[k]()
        s = int(max(0, t - adel[k]) * SR)
        x = x[: n - s]
        pan = rng.uniform(-0.25, 0.25)
        bus[s:s + len(x), 0] += x * (1 - pan)
        bus[s:s + len(x), 1] += x * (1 + pan)
    # nivel relativo a la voz
    sr_v, voz = wavfile.read(os.path.join(base, "voz.wav"))
    voz = voz.astype(np.float64) / (32768.0 if voz.dtype == np.int16 else 1.0)
    if voz.ndim == 1:
        voz = np.stack([voz, voz], 1)
    m = pyln.Meter(SR)
    lv = m.integrated_loudness(voz)
    le = m.integrated_loudness(bus[: len(voz)])
    bus *= 10 ** (((lv - DEBAJO_LU) - le) / 20)
    # tope de pico: los clics y golpes son transitorios; sin esto asoman por encima de la voz
    tope = 10 ** (PICO_DB / 20)
    bus = tope * np.tanh(bus / tope)
    wavfile.write(os.path.join(base, "efectos.wav"), SR, (bus[: len(voz)] * 32767).clip(-32768, 32767).astype(np.int16))
    mezcla = voz + bus[: len(voz)]
    pico = np.abs(mezcla).max()
    if pico > 0.97:
        mezcla *= 0.97 / pico
    wavfile.write(os.path.join(base, "mezcla.wav"), SR, (mezcla * 32767).astype(np.int16))
    cuenta = {k: sum(1 for _, x in limpio if x == k) for k in rango}
    print(f"voz {lv:.1f} LUFS · efectos {lv - DEBAJO_LU:.1f} LUFS · eventos {cuenta}")
    if len(sys.argv) > 2:
        v = sys.argv[2]
        dst = os.path.join(os.path.dirname(v), os.path.basename(v).replace(".mp4", "-sfx.mp4"))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", v, "-i", os.path.join(base, "mezcla.wav"), "-map", "0:v", "-map", "1:a",
                        "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", "-movflags", "+faststart", dst], check=True)
        print("→", dst)


if __name__ == "__main__":
    main()
