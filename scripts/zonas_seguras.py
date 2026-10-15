# Revisa que lo importante (textos y gráficos, renderizados sin fondos ni video con PROPS criticos) quede
# dentro del rectángulo seguro x 70–930, y 300–1520. Uso: python3 scripts/zonas_seguras.py carpeta_png
import sys, glob, os
import numpy as np
from PIL import Image
X0, X1, Y0, Y1 = 70, 930, 300, 1520
malos = 0
for f in sorted(glob.glob(os.path.join(sys.argv[1], 'f*.png'))):
    a = np.array(Image.open(f).convert('RGBA'))[:, :, 3]
    ys, xs = np.nonzero(a > 40)
    if not len(xs): continue
    caja = (xs.min(), ys.min(), xs.max(), ys.max())
    fuera = caja[0] < X0 or caja[2] > X1 or caja[1] < Y0 or caja[3] > Y1
    malos += fuera
    if fuera: print('FUERA', os.path.basename(f), 'caja x %d–%d, y %d–%d' % (caja[0], caja[2], caja[1], caja[3]))
print('zonas seguras:', 'todo adentro' if not malos else f'{malos} fotogramas con algo afuera')
sys.exit(1 if malos else 0)
