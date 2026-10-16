# Hojas de fotogramas para revisar sin ver video.
#   hoja-escenas.png    → un fotograma por escena (ya armada), con zonas seguras en rojo, línea y = 960 y área de zoom.
#   hoja-movimiento.png → fotogramas a mitad de cada animación (chips entrando, recuadros, cifras contando).
# Uso: python3 scripts/hoja.py .trabajo/<nombre>/plan.json out/<nombre>/<nombre>-motion-mudo.mp4 revision/<nombre>
import json, os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

plan_path, video, salida = sys.argv[1:4]
plan = json.load(open(plan_path))
fps, total = plan['fps'], plan['total']
os.makedirs(salida, exist_ok=True)
AQUI = os.path.dirname(os.path.abspath(__file__))
FUENTE = os.path.join(AQUI, '..', '..', 'fuentes', 'Poppins-Medium.ttf')
f_rot = ImageFont.truetype(FUENTE, 22)
f_tit = ImageFont.truetype(FUENTE, 30)
TW, TH, CAB = 360, 640, 62
S = TW / 1080

def tc(f):
    s = f // fps
    return f'{s // 60:02d}:{s % 60:02d}:{f % fps:02d}'

def extraer(frames):
    frames = sorted(set(max(0, min(total - 1, f)) for f in frames))
    tmp = tempfile.mkdtemp()
    expr = '+'.join(f'eq(n\\,{f})' for f in frames)
    subprocess.run(['ffmpeg', '-v', 'error', '-i', video, '-vf', f"select='{expr}',scale={TW}:{TH}", '-vsync', '0', os.path.join(tmp, '%04d.png')], check=True)
    return {f: Image.open(os.path.join(tmp, f'{i + 1:04d}.png')).convert('RGB') for i, f in enumerate(frames)}

def zonas(im, tramo):
    capa = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(capa)
    rojo = (230, 30, 30, 70)
    d.rectangle([0, 0, TW, 250 * S], fill=rojo)
    d.rectangle([0, (1920 - 380) * S, TW, TH], fill=rojo)
    d.rectangle([(1080 - 140) * S, 250 * S, TW, (1920 - 380) * S], fill=rojo)
    for x in (110, 900):  # área de zoom 115 %
        for y in range(0, TH, 10): d.line([x * S, y, x * S, y + 5], fill=(230, 30, 30, 200), width=1)
    y960 = 960 * S
    d.line([0, y960, TW, y960], fill=(230, 30, 30, 255), width=3 if tramo == 'mitad' else 1)
    if tramo == 'mitad':
        d.text((6, y960 + 4), 'y = 960 · debajo solo fondo', font=f_rot, fill=(230, 30, 30, 255))
    return Image.alpha_composite(im.convert('RGBA'), capa).convert('RGB')

def hoja(items, nombre, titulo, cols):
    filas = (len(items) + cols - 1) // cols
    W, H = cols * (TW + 16) + 16, 70 + filas * (TH + CAB + 16)
    hoja = Image.new('RGB', (W, H), (236, 239, 244)); d = ImageDraw.Draw(hoja)
    d.text((16, 18), titulo, font=f_tit, fill=(10, 31, 68))
    for i, (im, l1, l2) in enumerate(items):
        x = 16 + (i % cols) * (TW + 16); y = 70 + (i // cols) * (TH + CAB + 16)
        d.text((x, y + 2), l1, font=f_rot, fill=(10, 31, 68))
        d.text((x, y + 30), l2, font=f_rot, fill=(138, 148, 166))
        hoja.paste(im, (x, y + CAB))
    hoja.save(os.path.join(salida, nombre))
    print(f'  {os.path.join(salida, nombre)}')

escenas = plan['escenas']
# 1) una por escena, cuando ya está completa (antes de salir)
pedidos = {e['i']: (e['desde'] + e['dur'] // 2 if e['tramo'] == 'a-camara' else e['hasta'] - 8) for e in escenas}
# 2) a mitad de cada animación (máximo 3 por escena)
mov = []
for e in escenas:
    if e['tramo'] == 'a-camara': continue
    ms = e['momentos']
    if len(ms) > 3: ms = [ms[0], ms[len(ms) // 2], ms[-1]]
    mov += [(e, e['desde'] + m + 3) for m in ms]
imgs = extraer(list(pedidos.values()) + [f for _, f in mov])
nom = {'a-camara': 'a cámara', 'mitad': 'mitad', 'completa': 'completa'}
hoja([(zonas(imgs[pedidos[e['i']]], e['tramo']), f"{e['i']} · {nom[e['tramo']]} · {e.get('pieza') or ('fondo limpio' if e['tramo'] == 'a-camara' else 'Texto')}", f"{tc(e['desde'])} a {tc(e['hasta'])}") for e in escenas],
     'hoja-escenas.png', f"{plan['nombre']} · una por escena · zonas seguras en rojo", 5)
hoja([(imgs[f], f"{e['i']} · {e.get('pieza') or 'Texto'}", f'{tc(f)} · en movimiento') for e, f in mov],
     'hoja-movimiento.png', f"{plan['nombre']} · a mitad de cada animación", 6)
