# Mide la proporción de colores de marca en las áreas de apoyo (plano B completo y la mitad de arriba del plano S).
# Uso: python3 scripts/proporcion_color.py carpeta_png planos.json   (planos.json = [[desde, hasta, plano], ...])
import sys, glob, os, json
import numpy as np
from PIL import Image
PALETA = {'medianoche': (10, 31, 68), 'blanco': (255, 255, 255), 'lima': (200, 245, 66), 'electrico': (47, 95, 255)}
planos = json.load(open(sys.argv[2]))
cuenta = {k: 0 for k in PALETA}; total = 0
for f in sorted(glob.glob(os.path.join(sys.argv[1], 'f*.png'))):
    fr = int(os.path.basename(f)[1:5])
    p = next((x[2] for x in planos if x[0] <= fr < x[1]), 'A')
    if p == 'A': continue
    im = np.array(Image.open(f).convert('RGB'), dtype=float)
    if p == 'S': im = im[:920]
    px = im.reshape(-1, 3)[::7]
    d = np.stack([((px - np.array(c)) ** 2).sum(1) for c in PALETA.values()], 1)
    idx = d.argmin(1)
    for i, k in enumerate(PALETA): cuenta[k] += int((idx == i).sum())
    total += len(px)
for k in PALETA: print(f'{k:11s} {100 * cuenta[k] / total:5.1f} %')
