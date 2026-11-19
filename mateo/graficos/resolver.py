#!/usr/bin/env python3
"""Plan gráfico con anclas → timeline.json en cuadros para la composición de Remotion.

Uso: python3 resolver.py <proyecto> <slug>
  lee  <proyecto>/plan.json (escenas con frases ancla) y <proyecto>/work/words-corte.json
  copia <proyecto>/renders/borrador/voz.wav y work/burbuja-cam-400.mp4 a public/<slug>/
  escribe public/<slug>/timeline.json

Reglas de tiempo:
- Una escena empieza en su primera palabra (−LEAD) y dura hasta que empieza la siguiente: la pantalla nunca queda vacía.
  Entre dos escenas el borde cae en el medio del silencio entre la última palabra de una y la primera de la otra.
- "corte": segundos exactos donde termina la escena (toma que se puede cortar): la siguiente arranca en ese mismo cuadro.
- Cada elemento con "en" entra en el cuadro en que se dice esa frase (−ANTICIPO); "kw_en" ilumina la palabra clave.
"""
import json
import os
import shutil
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "paquete", "kit-edicion-v2", "pipeline-largo"))
from escenas import Anclas  # noqa: E402

FPS = 30
LEAD = 0.25       # s: la escena aparece un poco antes de la primera palabra
ANTICIPO = 0.08
# ancla → clave de cuadro que lee cada pieza
CLAVES = {"en": "f", "kw_en": "kf", "titulo_en": "ft", "activo_en": "fa", "foco_en": "ff", "etiqueta_en": "fe", "previo_en": "fp"}   # s: un elemento entra apenas antes de su palabra (se lee justo cuando se oye)


def main() -> None:
    proj, slug = sys.argv[1], sys.argv[2]
    plan = json.load(open(os.path.join(proj, "plan.json")))
    A = Anclas(json.load(open(os.path.join(proj, "work", "words-corte.json")))["words"])
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", slug)
    os.makedirs(out, exist_ok=True)
    for src, dst in ((os.path.join(proj, "renders", "borrador", "voz.wav"), "voz.wav"),
                     (os.path.join(proj, "work", "burbuja-cam-400.mp4"), "camara.mp4")):
        if not os.path.exists(os.path.join(out, dst)) or os.path.getmtime(src) > os.path.getmtime(os.path.join(out, dst)):
            shutil.copy(src, os.path.join(out, dst))
    total = A.w[-1]["e"] + 0.8 if "duracion" not in plan else plan["duracion"]

    cursor, esc = 0, []
    for e in plan["escenas"]:
        i0 = A.find(e["desde"], cursor)
        a = A.w[i0]["s"]
        b = A.t(e["hasta"], i0, fin=True) if "hasta" in e else a + 2
        cursor = i0

        def t(ref, base=i0):
            return A.t(ref, base) if not isinstance(ref, (int, float)) else float(ref)

        def resolver(x):
            """Recorre la escena y reemplaza cada "en"/"kw_en" por el cuadro absoluto."""
            if isinstance(x, dict):
                y = {}
                for k, v in x.items():
                    if k in CLAVES:
                        y[CLAVES[k]] = round((t(v) - ANTICIPO) * FPS)
                    else:
                        y[k] = resolver(v)
                return y
            if isinstance(x, list):
                return [resolver(v) for v in x]
            return x
        d = resolver({k: v for k, v in e.items() if k not in ("desde", "hasta", "corte")})
        d["_a"], d["_b"], d["_corte"] = a, b, e.get("corte")
        esc.append(d)

    # bordes: contiguos, en el medio del silencio, salvo los cortes de toma
    for k, d in enumerate(esc):
        ini = 0.0 if k == 0 else esc[k - 1]["_fin"]
        if d["_corte"] is not None:
            fin = float(d["_corte"])
        elif k + 1 < len(esc):
            nxt = esc[k + 1]["_a"]
            fin = max(d["_b"] + 0.1, (d["_b"] + nxt) / 2) if nxt - d["_b"] < 2 * LEAD + 0.6 else nxt - LEAD
        else:
            fin = total
        if k > 0 and esc[k - 1]["_corte"] is None and ini > d["_a"] - LEAD:
            ini = esc[k - 1]["_fin"]
        d["_fin"] = fin
        d["desde"], d["hasta"] = round(ini * FPS), round(fin * FPS)
    for d in esc:
        for k in ("_a", "_b", "_corte", "_fin"):
            d.pop(k)
    extra = []
    for o in plan.get("superpuestos", []):
        i = A.find(o["en"], 0)
        extra.append(dict(o, en=None, f=round((A.w[i]["s"] - ANTICIPO) * FPS)))
    tl = {"fps": FPS, "frames": round(total * FPS), "escenas": esc, "superpuestos": extra}
    json.dump(tl, open(os.path.join(out, "timeline.json"), "w"), ensure_ascii=False, indent=1)
    print(f"{len(esc)} escenas · {tl['frames']} cuadros → {out}/timeline.json")
    for d in esc:
        print(f"  {d['desde'] / FPS:7.2f}–{d['hasta'] / FPS:7.2f}  {d['tipo']:8s} {d.get('id', '')}")


if __name__ == "__main__":
    main()
