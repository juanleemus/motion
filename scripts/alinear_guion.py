# Alinea el guion con el audio guía sin modelo de reconocimiento.
# 1) Detecta los tramos con voz (entre pausas). Cada pausa cae entre dos palabras.
# 2) Reparte las palabras del guion entre los tramos por programación dinámica:
#    el largo de cada tramo debe cuadrar con sus sílabas y las pausas prefieren la puntuación.
# 3) Dentro de cada tramo, ubica las palabras según sus sílabas (el español es silábico).
# Uso: python3 scripts/alinear_guion.py voz16k.wav guion.txt palabras.json
import json, re, subprocess, sys
import numpy as np

wav, guion, salida = sys.argv[1:4]

out = subprocess.run(['ffmpeg', '-i', wav, '-af', 'silencedetect=noise=-35dB:d=0.16', '-f', 'null', '-'],
                     capture_output=True, text=True).stderr
ss = [float(v) for v in re.findall(r'silence_start: ([0-9.]+)', out)]
se = [float(v) for v in re.findall(r'silence_end: ([0-9.]+)', out)]
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav],
                           capture_output=True, text=True).stdout)
tramos, cur = [], 0.0
for a, b in zip(ss, se + [dur] * (len(ss) - len(se))):
    if a - cur > 0.04: tramos.append((cur, a))
    cur = b
if dur - cur > 0.1: tramos.append((cur, dur))
# quitar respiraciones/ruidos muy cortos
tramos = [t for t in tramos if t[1] - t[0] >= 0.12]

NUM = {'10': 'diez', '5': 'cinco', '6': 'seis'}
LECTURA = {'ceo': 'ciou', 'waymo': 'weimo', 'ackman': 'acman', 'apps': 'aps'}
def silabas(pal):
    p = NUM.get(pal.lower().strip('.,:;?!¿…'), pal.lower())
    p = re.sub(r'[^a-záéíóúüñ]', '', p)
    p = LECTURA.get(p, p)
    v, fuertes = 'aeiouáéíóúü', 'aeoáéíóú'
    n, prev = 0, None
    for ch in p:
        if ch in v:
            if prev is None or (prev in fuertes and ch in fuertes): n += 1
            prev = ch
        else: prev = None
    return max(1, n)

# ---- cuadros con "s" (ruido agudo fuerte) ----
import wave
from scipy.signal import butter, sosfiltfilt
with wave.open(wav) as wf:
    srr = wf.getframerate()
    xx = np.frombuffer(wf.readframes(wf.getnframes()), dtype='<i2').astype(float) / 32768
hop = srr // 100
def banda(lo, hi):
    y = sosfiltfilt(butter(4, [lo, hi], 'band', fs=srr, output='sos'), xx)
    return 10 * np.log10(np.convolve(y ** 2, np.ones(hop * 2) / (hop * 2), 'same')[::hop] + 1e-10)
agudo, grave = banda(4000, 7800), banda(150, 2500)
tot_db = np.maximum(agudo, grave)
es_s = (agudo - grave > 0) & (tot_db > np.percentile(tot_db, 30))
cum_s = np.concatenate([[0], np.cumsum(es_s)]) * 0.01  # segundos de "s" acumulados
def seg_s(a, b): return cum_s[min(len(cum_s) - 1, int(b * 100))] - cum_s[int(a * 100)]
def cuenta_s(pal):
    p = pal.lower()
    p = {'10': 'dies', '5': 'sinco', '6': 'seis', 'ceo': 'siou', 'nancy': 'nansi', 'robotaxis': 'robotaksis'}.get(re.sub(r'[^a-z0-9áéíóúñ]', '', p), p)
    p = re.sub(r'c(?=[eiéí])', 's', p); p = re.sub(r'ch', 's', p)
    return sum(p.count(c) for c in 'szxfj')

palabras = open(guion, encoding='utf-8').read().split()
sil = np.array([silabas(w) for w in palabras], dtype=float)
W, K = len(palabras), len(tramos)
cum = np.concatenate([[0], np.cumsum(sil)])
voz = sum(b - a for a, b in tramos)
ritmo = cum[-1] / voz  # sílabas por segundo
cum_es = np.concatenate([[0], np.cumsum([cuenta_s(w) for w in palabras])])
por_s = seg_s(0, 999) / cum_es[-1]
print(f'{cum_es[-1]} letras s en el guion, {seg_s(0,999):.1f} s de sonido s en el audio')
punt = [bool(re.search(r'[.,:;?!…]$', w)) for w in palabras]
fuerte = [bool(re.search(r'[.?!…:]$', w)) for w in palabras]
print(f'{W} palabras, {int(cum[-1])} sílabas, {K} tramos de voz, ritmo {ritmo:.2f} síl/s')

# micropausas (más cortas o más suaves): pueden ser límite de frase, pero no están obligadas
out2 = subprocess.run(['ffmpeg', '-i', wav, '-af', 'silencedetect=noise=-30dB:d=0.07', '-f', 'null', '-'],
                      capture_output=True, text=True).stderr
s2 = [float(v) for v in re.findall(r'silence_start: ([0-9.]+)', out2)]
e2 = [float(v) for v in re.findall(r'silence_end: ([0-9.]+)', out2)]
unidades = []  # (inicio, fin, tipo de pausa al final: 'dura' | 'suave' | 'fin')
for k, (a0, b0) in enumerate(tramos):
    cortes = [(x, y) for x, y in zip(s2, e2) if a0 + 0.1 < x and y < b0 - 0.1]
    ini = a0
    for x, y in cortes:
        unidades.append((ini, x, 'suave')); ini = y
    unidades.append((ini, b0, 'dura' if k < len(tramos) - 1 else 'fin'))
U = len(unidades)
print(f'{U} unidades ({sum(1 for u in unidades if u[2] == "suave")} micropausas)')

INF = 1e18
f = np.full((U + 1, W + 1), INF); bt = np.zeros((U + 1, W + 1, 2), dtype=int)
f[0, 0] = 0
for k in range(1, U + 1):
    tipo = unidades[k - 1][2]
    for k0 in range(k - 1, max(-1, k - 8), -1):  # el trozo abarca las unidades k0+1..k
        if k0 < k - 1 and unidades[k0][2] == 'dura': break  # una pausa dura no puede quedar adentro
        a0, b0 = unidades[k0][0], unidades[k - 1][1]
        voz_trozo = sum(u[1] - u[0] for u in unidades[k0:k])
        d = b0 - a0
        for w in range(1, W + 1):
            for w0 in range(max(0, w - 30), w):
                if f[k0, w0] >= INF: continue
                esperado = (cum[w] - cum[w0]) / ritmo
                c = 8.0 * np.log((0.5 * (d + voz_trozo) + 0.15) / (esperado + 0.15)) ** 2
                ms, es_ = seg_s(a0, b0), (cum_es[w] - cum_es[w0]) * por_s
                c += 2.5 * np.log((ms + 0.08) / (es_ + 0.08)) ** 2
                if tipo == 'dura' and not punt[w - 1]: c += 1.5
                if tipo == 'suave': c += 0.1 if punt[w - 1] else 0.9
                v = f[k0, w0] + c + 0.2
                if v < f[k, w]: f[k, w] = v; bt[k, w] = (k0, w0)
asig, k, w = [], U, W
while k > 0:
    k0, w0 = bt[k, w]; asig.append(((unidades[k0][0], unidades[k - 1][1]), w0, w)); k, w = k0, w0
asig.reverse()

res = [None] * W
for (a, b), w0, w1 in asig:
    tot = cum[w1] - cum[w0]
    for q in range(w0, w1):
        t0 = a + (b - a) * (cum[q] - cum[w0]) / tot
        t1 = a + (b - a) * (cum[q + 1] - cum[w0]) / tot
        res[q] = {'w': palabras[q], 't0': round(t0, 2), 't1': round(t1, 2)}
json.dump(res, open(salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
# informe: tramo → texto, con desvío de ritmo
for (a, b), w0, w1 in asig:
    tot = cum[w1] - cum[w0]
    print(f'{a:6.2f}-{b:6.2f}  {tot / (b - a):4.1f} síl/s  s {seg_s(a,b):.2f}/{(cum_es[w1]-cum_es[w0])*por_s:.2f}  ' + ' '.join(palabras[w0:w1]))
