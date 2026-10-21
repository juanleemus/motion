# Montaje integrado: motion (mudo) + Juan Pablo recortado (sin fondo) o en recuadro, alternando por escena.
import json, subprocess, sys, numpy as np, cv2
esc, motion, bruto, alfa, salida = sys.argv[1:6]
W, H, FPS, TOTAL = 1080, 1920, 60, 2851
MED = np.array([10, 31, 68], np.float32)  # azul medianoche (RGB)
d = json.load(open(esc))
def seg(t):
    if isinstance(t, str): m, s, f = map(int, t.split(':')); return m*60+s+f/FPS
    return t
# modo por escena: motion · recorte · recuadro · cuerpo
modos, k = [], 0
for e in d['escenas']:
    a, b = round(seg(e['inicio'])*FPS), min(TOTAL, round(seg(e['fin'])*FPS))
    if e['tramo'] == 'completa': m = 'motion'
    elif e['tramo'] == 'a-camara': m = 'cuerpo'
    else: m = 'recorte' if k % 2 == 0 else 'recuadro'; k += 1
    modos.append((a, b, m, k))
def modo_de(f):
    for a, b, m, k in modos:
        if a <= f < b: return a, b, m, k
    return f, f+1, 'motion', 0
ease = lambda x: 1 - (1 - min(1, max(0, x)))**3

# recuadro: tarjeta blanca radio 32, borde 10, sombra medianoche suave
CW, CH, BORDE, RAD = 500, 600, 10, 34
def redondeado(w, h, r):
    m = np.zeros((h, w), np.uint8); cv2.rectangle(m, (r, 0), (w-r, h), 255, -1); cv2.rectangle(m, (0, r), (w, h-r), 255, -1)
    for cx, cy in [(r, r), (w-r-1, r), (r, h-r-1), (w-r-1, h-r-1)]: cv2.circle(m, (cx, cy), r, 255, -1, cv2.LINE_AA)
    return m.astype(np.float32) / 255
MASC_EXT = redondeado(CW, CH, RAD); MASC_INT = redondeado(CW-2*BORDE, CH-2*BORDE, RAD-BORDE)
PAD = 80
SOMBRA = cv2.GaussianBlur(np.pad(MASC_EXT, PAD), (0, 0), 28) * 0.28

def pegar(lienzo, capa, alfa_, x, y):
    h, w = alfa_.shape; x0, y0 = max(0, x), max(0, y); x1, y1 = min(W, x+w), min(H, y+h)
    if x1 <= x0 or y1 <= y0: return
    a = alfa_[y0-y:y1-y, x0-x:x1-x, None]; c = capa[y0-y:y1-y, x0-x:x1-x] if capa.ndim == 3 else capa
    lienzo[y0:y1, x0:x1] = lienzo[y0:y1, x0:x1] * (1 - a) + c * a

def lee(p, ch):
    return subprocess.Popen(['ffmpeg', '-v', 'error', '-i', p, '-f', 'rawvideo', '-pix_fmt', 'rgb24' if ch == 3 else 'gray', '-'], stdout=subprocess.PIPE)
pm, pb, pa = lee(motion, 3), lee(bruto, 3), lee(alfa, 1)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '60', '-i', '-',
                       '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', salida], stdin=subprocess.PIPE)
topes = []
for f in range(TOTAL):
    M = np.frombuffer(pm.stdout.read(W*H*3), np.uint8).reshape(H, W, 3).astype(np.float32)
    R = np.frombuffer(pb.stdout.read(W*H*3), np.uint8).reshape(H, W, 3)
    A = np.frombuffer(pa.stdout.read(W*H), np.uint8).reshape(H, W).astype(np.float32) / 255
    a, b, m, k = modo_de(f); r = f - a; p = (f - a) / max(1, b - a); ent = ease(r / 9)
    A = np.clip((A - 0.1) / 0.8, 0, 1)
    if m in ('recorte', 'cuerpo'):
        s = (1.0 + 0.03*p) if m == 'cuerpo' else ([0.58, 0.6, 0.57][k % 3] + 0.015*p)
        cx = 505 + (0 if m == 'cuerpo' else [0, -40, 40][k % 3])
        w, h = int(W*s), int(H*s)
        Rs = cv2.resize(R, (w, h), interpolation=cv2.INTER_AREA).astype(np.float32)
        As = cv2.resize(A, (w, h), interpolation=cv2.INTER_AREA) * (ent if m == 'recorte' else 1)
        y = H - h + (int(50*(1-ent)) if m == 'recorte' else 0)
        x = cx - w//2
        filas = np.where(As[:, w//4:3*w//4].max(1) > 0.5)[0]
        if m == 'recorte' and len(filas): topes.append((f, y + filas[0]))
        # sombra suave detrás del recorte para asentarlo sobre el fondo
        sh = cv2.GaussianBlur(As, (0, 0), 18) * 0.18
        pegar(M, MED, sh, x, y + 14)
        pegar(M, Rs, As, x, y)
    elif m == 'recuadro':
        sc = 0.9 + 0.1*ent
        z = 1.0 + 0.05*p  # acercamiento lento dentro del recuadro
        iw, ih = CW-2*BORDE, CH-2*BORDE
        ch_ = int(1080/z * ih/iw); cw_ = int(1080/z)
        yy = int(np.clip(930 - ch_/2, 0, H-ch_)); xx = (1080 - cw_)//2
        dentro = cv2.resize(R[yy:yy+ch_, xx:xx+cw_], (iw, ih), interpolation=cv2.INTER_AREA).astype(np.float32)
        tarjeta = np.full((CH, CW, 3), 255, np.float32); tarjeta[BORDE:BORDE+ih, BORDE:BORDE+iw] = dentro * MASC_INT[..., None] + 255 * (1 - MASC_INT[..., None])
        tw, th = int(CW*sc), int(CH*sc)
        t_ = cv2.resize(tarjeta, (tw, th)); mt = cv2.resize(MASC_EXT, (tw, th)) * ent
        sw = cv2.resize(SOMBRA, (int((CW+2*PAD)*sc), int((CH+2*PAD)*sc))) * ent
        x, y = 505 - tw//2, 980 + (CH - th)//2
        pegar(M, MED, sw, x - int(PAD*sc), y - int(PAD*sc) + 20)
        pegar(M, t_, mt, x, y)
    enc.stdin.write(np.clip(M, 0, 255).astype(np.uint8).tobytes())
    if f % 600 == 0: print(f, flush=True)
enc.stdin.close(); enc.wait()
t = [y for _, y in topes]
print('tope más alto del recorte (y):', min(t) if t else None)
