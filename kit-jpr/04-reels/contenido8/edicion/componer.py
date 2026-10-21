# Montaje final: fondo x + Juan Pablo (pantalla completa · dividida con luz · recortado con luz) + gráficos sin fondo encima.
# Uso: python3 componer2.py <escenas.json> <bruto.mp4> <alfa.mp4> <carpeta-capas> <fondo-x.jpg> <salida.mp4>
import json, subprocess, sys, math, numpy as np, cv2
esc, bruto, alfa, capas, fondo_x, salida = sys.argv[1:7]
W, H, FPS, TOTAL = 1080, 1920, 60, 2851
AZUL = np.array([255, 95, 47], np.float32)   # azul eléctrico #2F5FFF (BGR)
LIMA = np.array([66, 245, 200], np.float32)  # verde lima #C8F542 (BGR)
FUNDIDO = 12  # fotogramas de fundido entre tomas de Juan Pablo

d = json.load(open(esc))
def seg(t):
    if isinstance(t, str): m, s, f = map(int, t.split(':')); return m*60+s+f/FPS
    return t
tomas, cuenta = [], {}
for e in d['escenas']:
    a, b = round(seg(e['inicio'])*FPS), min(TOTAL, round(seg(e['fin'])*FPS))
    m = e.get('edicion') or ('motion' if e['tramo'] == 'completa' else 'completo' if e['tramo'] == 'a-camara' else 'dividida')
    if e['tramo'] == 'completa': m = 'motion'
    k = cuenta.get(m, 0); cuenta[m] = k + 1
    tomas.append(dict(a=a, b=b, m=m, k=k))

suave = lambda x: 0.5 - 0.5*math.cos(math.pi*min(1, max(0, x)))  # acelera y frena suave
def zoom(t, p):
    # zoom in y zoom out alternados, lentos y con aceleración suave durante toda la toma
    rangos = {'completo': [(1.0, 1.16), (1.18, 1.02)], 'dividida': [(1.0, 1.09), (1.1, 1.01)], 'recorte': [(1.0, 1.045), (1.045, 1.0)]}[t['m']]
    z0, z1 = rangos[t['k'] % 2]
    return z0 + (z1 - z0) * suave(p)

# fondo x: cubre y hace zoom muy lento de 1 a 1,06 (como la pieza Fondo)
FX = cv2.imread(fondo_x); fh, fw = FX.shape[:2]; c = max(W/fw, H/fh)
FX = cv2.resize(FX, (math.ceil(fw*c), math.ceil(fh*c)), interpolation=cv2.INTER_AREA)
FX = FX[(FX.shape[0]-H)//2:(FX.shape[0]-H)//2+H, (FX.shape[1]-W)//2:(FX.shape[1]-W)//2+W]
def fondo(f):
    z = 1 + 0.06*f/(TOTAL-1)
    M = np.float32([[z, 0, W/2*(1-z)], [0, z, H/2*(1-z)]])
    return cv2.warpAffine(FX, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT).astype(np.float32)

def mover(img, z, ox, oy, ax=540, ay=860, borde=cv2.BORDER_REPLICATE):
    # lleva el punto (ax, ay) del bruto a (ox, oy) con zoom z
    M = np.float32([[z, 0, ox - z*ax], [0, z, oy - z*ay]])
    return cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=borde, borderValue=0)

YY = np.arange(H, dtype=np.float32)[:, None]; XX = np.arange(W, dtype=np.float32)[None, :]
def mezclar(base, color, a):
    a = a[..., None] if a.ndim == 2 else a
    return base * (1 - a) + color * a

def capa_jpr(t, f, base, R, A):
    if t['m'] == 'motion': return base
    p = (f - t['a']) / max(1, t['b'] - t['a'] - 1); z = zoom(t, p); m = t['m']
    if m == 'completo':
        return mover(R, z, 540, 900).astype(np.float32)
    if m == 'dividida':
        yb = 985 + 12*math.sin(2*math.pi*(p*0.8 + t['k']*0.3))      # borde que respira, no una línea fija
        V = mover(R, z, 540, 1330).astype(np.float32)
        a = np.clip((YY - (yb - 70)) / 190, 0, 1); a = a*a*(3 - 2*a)  # borde difuminado
        out = mezclar(base, V, np.broadcast_to(a, (H, W)))
        # luz: línea fina lima con halo azul y un destello que la recorre
        dy = YY - (yb + 10)
        nucleo = np.exp(-(dy/3.5)**2); halo = np.exp(-(dy/34)**2)
        xs = -250 + (W + 500) * suave(p)
        recorre = 0.35 + 0.65*np.exp(-((XX - xs)/260)**2)
        lados = np.clip(np.minimum(XX, W - XX) / 260, 0, 1)
        out = mezclar(out, AZUL, (halo*0.45*recorre*lados))
        out = mezclar(out, LIMA, (nucleo*0.95*recorre*lados))
        return out
    if m == 'recorte':
        V = mover(R, z, 540, 1370).astype(np.float32)
        a = mover(A, z, 540, 1370, borde=cv2.BORDER_CONSTANT)
        a = cv2.GaussianBlur(a, (0, 0), 1.3)                       # borde suave, no rígido
        # luz azul detrás: un círculo difuso y un halo que sigue la silueta
        peq = cv2.resize(a, (W//4, H//4)); halo = cv2.resize(cv2.GaussianBlur(peq, (0, 0), 14), (W, H))
        circ = np.exp(-(((XX-540)/520)**2 + ((YY-1250)/560)**2))
        out = mezclar(base, AZUL, circ*0.22)
        out = mezclar(out, AZUL, np.clip(halo*0.75, 0, 0.6))
        out = mezclar(out, LIMA, np.clip(halo - a, 0, 1)*0.18)
        return mezclar(out, V, a)
    return base

def lee(p, fmt, ch):
    return subprocess.Popen(['ffmpeg', '-v', 'error', '-i', p, '-f', 'rawvideo', '-pix_fmt', fmt, '-'], stdout=subprocess.PIPE), ch
(pb, _), (pa, _) = lee(bruto, 'bgr24', 3), lee(alfa, 'gray', 1)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', '60', '-i', '-',
                       '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', salida], stdin=subprocess.PIPE)
for f in range(TOTAL):
    R = np.frombuffer(pb.stdout.read(W*H*3), np.uint8).reshape(H, W, 3)
    A = np.frombuffer(pa.stdout.read(W*H), np.uint8).reshape(H, W).astype(np.float32) / 255
    A = np.clip((A - 0.1) / 0.8, 0, 1)
    i = next((j for j, t in enumerate(tomas) if t['a'] <= f < t['b']), None)
    base = fondo(f)
    if i is None:
        img = base
    else:
        t = tomas[i]; img = capa_jpr(t, f, base, R, A)
        # fundido desde la toma anterior de Juan Pablo (si la hubo justo antes)
        if i > 0 and f - t['a'] < FUNDIDO and t['m'] != 'motion' and tomas[i-1]['m'] != 'motion' and tomas[i-1]['b'] == t['a']:
            prev = dict(tomas[i-1]); prev['b'] = f + 1  # se queda en su última pose
            w = suave((f - t['a'] + 1) / (FUNDIDO + 1))
            img = img * w + capa_jpr(prev, f, base, R, A) * (1 - w)
    G = cv2.imread(f'{capas}/element-{f:04d}.png', cv2.IMREAD_UNCHANGED)
    if G is not None and G.ndim == 3 and G.shape[2] == 3: img = G.astype(np.float32)  # cuadro opaco (superficie oscura)
    elif G is not None and G[..., 3].any():
        ga = G[..., 3:].astype(np.float32) / 255
        img = img * (1 - ga) + G[..., :3].astype(np.float32) * ga
    enc.stdin.write(np.clip(img, 0, 255).astype(np.uint8).tobytes())
    if f % 500 == 0: print(f, flush=True)
enc.stdin.close(); enc.wait()
print('listo')
