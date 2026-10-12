# Une fotogramas en una hoja con las zonas seguras marcadas en rojo.
import sys, glob, os
from PIL import Image, ImageDraw, ImageFont
carpeta, salida = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
fs = sorted(glob.glob(os.path.join(carpeta, 'f*.png')))
tw, th = 270, 480
filas = (len(fs) + cols - 1) // cols
hoja = Image.new('RGB', (cols * (tw + 10) + 10, filas * (th + 40) + 10), (240, 240, 240))
try: fuente = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18)
except Exception: fuente = ImageFont.load_default()
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGBA')
    capa = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(capa)
    rojo = (255, 0, 0, 90)
    d.rectangle([0, 0, 1080, 250], fill=rojo); d.rectangle([0, 1920 - 380, 1080, 1920], fill=rojo)
    d.rectangle([1080 - 140, 250, 1080, 1920 - 380], fill=rojo)
    d.rectangle([70, 300, 930, 1520], outline=(255, 220, 0, 200), width=4)
    im = Image.alpha_composite(im, capa).convert('RGB').resize((tw, th))
    x = 10 + (i % cols) * (tw + 10); y = 10 + (i // cols) * (th + 40)
    hoja.paste(im, (x, y))
    fr = int(os.path.basename(f)[1:5])
    ImageDraw.Draw(hoja).text((x, y + th + 8), f'{fr//30//60}:{fr//30%60:02d}.{fr%30:02d}  (f{fr})', fill=(20, 20, 20), font=fuente)
hoja.save(salida); print(salida, len(fs))
