# Hoja limpia para el cliente (sin zonas marcadas): un fotograma por escena con su nombre y su fondo.
# Uso: python3 scripts/hoja_limpia.py carpeta salida.png etiquetas.json [columnas]
#   etiquetas.json: {"123": ["Sección", "fondo"], ...} (clave = fotograma)
import sys, glob, os, json
from PIL import Image, ImageDraw, ImageFont
carpeta, salida, etq = sys.argv[1], sys.argv[2], json.load(open(sys.argv[3], encoding='utf-8'))
cols = int(sys.argv[4]) if len(sys.argv) > 4 else 6
fs = sorted(glob.glob(os.path.join(carpeta, 'f*.png')))
tw, th, pie = 360, 640, 92
filas = (len(fs) + cols - 1) // cols
hoja = Image.new('RGB', (cols * (tw + 16) + 16, filas * (th + pie + 16) + 16), (15, 20, 32))
def fuente(t, b=True):
    for f in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if b else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']:
        try: return ImageFont.truetype(f, t)
        except Exception: pass
    return ImageFont.load_default()
d = ImageDraw.Draw(hoja)
for i, f in enumerate(fs):
    fr = int(os.path.basename(f)[1:5])
    x = 16 + (i % cols) * (tw + 16); y = 16 + (i // cols) * (th + pie + 16)
    hoja.paste(Image.open(f).convert('RGB').resize((tw, th), Image.LANCZOS), (x, y))
    nombre, fondo = etq.get(str(fr), ['', ''])
    d.text((x, y + th + 8), f'{fr//30//60}:{fr//30%60:02d}.{fr%30:02d}  ·  {nombre}', fill=(42, 157, 255), font=fuente(19))
    d.text((x, y + th + 36), f'fondo: {fondo}', fill=(220, 225, 235), font=fuente(15, False))
hoja.save(salida); print(salida, len(fs))
