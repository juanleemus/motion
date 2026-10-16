# Efectos de sonido generados con código (sin bancos de sonidos ni música):
# whoosh, pop, tic, clic, tecleo, trazo y destello, cada uno en el momento de su animación.
# El volumen se ajusta para quedar ~14 dB por debajo de la voz del video base.
# Uso: python3 scripts/efectos.py datos.json voz.wav salida.wav
import json, sys
import numpy as np, soundfile as sf, pyloudnorm as pyln
from scipy.signal import butter, sosfilt

datos, voz, salida = sys.argv[1:4]
d = json.load(open(datos))
SR = 48000
N = int(round(d['duracion'] / d['fps'] * SR))  # duración exacta del video base
rng = np.random.default_rng(7)

def t(s): return np.arange(int(s * SR)) / SR
def bp(x, a, b): return sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)
def lp(x, f): return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
def env(n, a, dcy):
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / dcy)

def whoosh(tono=1.0, dur=0.42):
    x = t(dur); n = rng.standard_normal(len(x))
    # ruido filtrado que sube y baja de brillo: aire que pasa
    f = 500 + 3200 * np.sin(np.pi * x / dur) ** 2 * tono
    y = np.zeros_like(n); z = 0.0; a = np.exp(-2 * np.pi * f / SR)
    for i in range(len(n)): z = a[i] * z + (1 - a[i]) * n[i]; y[i] = z
    y = hp(y, 180) * np.sin(np.pi * x / dur) ** 1.5
    return y / (np.abs(y).max() + 1e-9) * 0.8

def pop(tono=1.0):
    x = t(0.09); f = 520 * tono * (1 + 0.6 * np.exp(-x * 60))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.002, 0.028)
    y += 0.25 * bp(rng.standard_normal(len(x)), 2000, 6000) * env(len(x), 0.0005, 0.004)
    return y * 0.9

def tic():
    x = t(0.03)
    return (np.sin(2 * np.pi * 2600 * x) * 0.6 + bp(rng.standard_normal(len(x)), 3000, 8000) * 0.5) * env(len(x), 0.0003, 0.006)

def clic():
    x = t(0.06)
    y = bp(rng.standard_normal(len(x)), 1500, 7000) * env(len(x), 0.0003, 0.005)
    y += 0.5 * np.sin(2 * np.pi * 900 * x) * env(len(x), 0.0005, 0.012)
    y2 = np.zeros_like(y); s = int(0.022 * SR); y2[s:] = y[:-s] * 0.55  # segundo golpe (soltar)
    return y + y2

def tecla():
    x = t(0.035)
    return bp(rng.standard_normal(len(x)), 1800 + rng.uniform(-300, 300), 6500) * env(len(x), 0.0004, 0.007) * rng.uniform(0.6, 1)

def trazo(dur):
    dur = max(0.18, dur); x = t(dur)
    y = bp(rng.standard_normal(len(x)), 2500, 7500)
    y *= np.minimum(1, x / 0.04) * np.minimum(1, (dur - x) / 0.08).clip(0) * (0.75 + 0.25 * np.sin(2 * np.pi * 9 * x))
    return y * 0.35

def destello():
    x = t(0.5); y = whoosh(1.3, 0.5) * 0.5
    for f in (1568, 2093, 3136):  # brillo suave
        y += 0.06 * np.sin(2 * np.pi * f * x) * env(len(x), 0.02, 0.18)
    return y

pista = np.zeros(N)
def pon(x, s, g=1.0):
    i = int(round(s * SR))
    if i >= N: return
    x = x[: N - i]; pista[i:i + len(x)] += x * g

for e in d['efectos']:
    tp, s = e['tipo'], e['t']; tono = e.get('tono', 1.0)
    if tp == 'whoosh': pon(whoosh(tono), s - 0.05, 0.8)
    elif tp == 'pop': pon(pop(tono), s, 0.75)
    elif tp == 'tic': pon(tic(), s, 0.5)
    elif tp == 'clic': pon(clic(), s, 0.7)
    elif tp == 'trazo': pon(trazo(e.get('dur', 0.3)), s, 1.0)
    elif tp == 'destello': pon(destello(), s - 0.1, 0.9)
    elif tp == 'tecleo':
        n = max(3, int(e.get('dur', 0.6) / 0.055))
        for k in range(n): pon(tecla(), s + k * e['dur'] / n + rng.uniform(-0.008, 0.008), 0.8)

# Volumen: efectos ~14 dB por debajo de la voz (medido con la misma escala LUFS)
v, vsr = sf.read(voz)
m = pyln.Meter(vsr); lv = m.integrated_loudness(v)
me = pyln.Meter(SR, block_size=0.2)
le = me.integrated_loudness(pista)
objetivo = lv - 14
pista *= 10 ** ((objetivo - le) / 20)
pico = np.abs(pista).max()
if pico > 0.89: pista *= 0.89 / pico
est = np.stack([pista, pista], 1)
sf.write(salida, est, SR, subtype='PCM_24')
print(f'voz {lv:.1f} LUFS | efectos {me.integrated_loudness(pista):.1f} LUFS (objetivo {objetivo:.1f}) | {N / SR:.3f} s, {len(d["efectos"])} efectos')
