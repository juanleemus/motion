# Hoja de revisión: monta las capas (motion + subtítulos) sobre el video base en fotogramas sueltos,
# marca en rojo las zonas seguras de Instagram y lo arma en una cuadrícula con el tiempo de cada uno.
# Uso: python3 scripts/hoja.py video.mov datos.json carpeta-fotos salida.jpg f1 f2 ...
import json, subprocess, sys, os
from PIL import Image, ImageDraw, ImageFont
video, datos, fotos, salida, *frames = sys.argv[1:]
d = json.load(open(datos)); fps = d['fps']
BAJA = 660  # simulación de lo que hace el editor en la pantalla dividida: baja a JPR para que su cara quede abajo
def base(f):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{int(f) / fps:.3f}', '-i', video, '-frames:v', '1',
                          '-vf', 'scale=1080:1920:flags=lanczos', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    im = Image.frombytes('RGB', (1080, 1920), out)
    if d['formatos'][int(f)] == 'B':
        c = Image.new('RGB', (1080, 1920), (20, 20, 20)); c.paste(im, (0, BAJA)); im = c
    return im.convert('RGBA')
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 54)
except OSError: font = ImageFont.load_default()
tiles = []
for f in frames:
    im = base(f)
    for capa in ('motion', 'subtitulos'):
        im.alpha_composite(Image.open(os.path.join(fotos, f'{capa}-{f}.png')).convert('RGBA'))
    zona = Image.new('RGBA', (1080, 1920), (0, 0, 0, 0)); z = ImageDraw.Draw(zona)
    for r in [(0, 0, 1080, 250), (0, 1540, 1080, 1920), (940, 250, 1080, 1540)]: z.rectangle(r, fill=(255, 0, 0, 70))
    z.rectangle((70, 300, 930, 1520), outline=(255, 0, 0, 200), width=4)
    im.alpha_composite(zona)
    dr = ImageDraw.Draw(im); t = int(f) / fps
    dr.rectangle((0, 0, 1080, 90), fill=(0, 0, 0, 200))
    dr.text((24, 16), f'{int(t // 60)}:{t % 60:05.2f}  f{f}  {d["formatos"][int(f)]}', fill='white', font=font)
    tiles.append(im.convert('RGB').resize((360, 640)))
cols = min(6, len(tiles)); rows = (len(tiles) + cols - 1) // cols
hoja = Image.new('RGB', (cols * 370 + 10, rows * 650 + 10), 'white')
for i, t in enumerate(tiles): hoja.paste(t, (10 + (i % cols) * 370, 10 + (i // cols) * 650))
hoja.save(salida, quality=88); print('hoja', salida, len(tiles))
