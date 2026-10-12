# Música lo-fi a 100 BPM + efectos sintetizados con código (sin bancos de sonido).
# Uso: python3 scripts/sonido.py trabajo/eventos.json salida.wav [segundos] [lufs]
import json, sys
import numpy as np
from scipy.signal import butter, sosfilt
import pyloudnorm as pyln

SR = 48000
eventos_path, salida = sys.argv[1], sys.argv[2]
DUR = float(sys.argv[3]) if len(sys.argv) > 3 else 74.0
LUFS = float(sys.argv[4]) if len(sys.argv) > 4 else -24.0
N = int(round(DUR * SR))
rng = np.random.default_rng(5)

def t(sec): return np.arange(int(sec * SR)) / SR
def lp(x, fc, o=2): return sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x)
def hp(x, fc, o=2): return sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x)
def env(n, a, d):  # ataque y caída exponencial
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d)
def mtof(m): return 440 * 2 ** ((m - 69) / 12)

def put(buf, x, start, gain=1.0, pan=0.0):
    s = int(start * SR)
    if s >= len(buf): return
    x = x[: len(buf) - s]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[s:s + len(x), 0] += x * gain * l * 1.414
    buf[s:s + len(x), 1] += x * gain * r * 1.414

# ---------------- MÚSICA ----------------
BPM = 100; beat = 60 / BPM; bar = 4 * beat
musica = np.zeros((N, 2))
acordes = [  # Dm9, G13, Cmaj9, Am7(add11)
    [50, 53, 57, 60, 64], [43, 53, 57, 59, 64], [48, 52, 55, 59, 62], [45, 52, 55, 60, 62]]
bajos = [38, 31, 36, 33]

def epiano(m, dur):
    x = t(dur); f = mtof(m)
    mod = np.sin(2 * np.pi * f * 2 * x) * 0.8 * np.exp(-x * 3)
    s = np.sin(2 * np.pi * f * x + mod) + 0.25 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-x * 2)
    return s * env(len(x), 0.012, 1.4) * (1 - np.exp(-(dur - x) * 30).clip(0, 1) * 0)

def kick():
    x = t(0.4); fr = 48 + 70 * np.exp(-x * 30)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(len(x), 0.002, 0.16)

def snare():
    x = t(0.25); n = rng.standard_normal(len(x))
    return (bp(n, 900, 5000) * env(len(x), 0.002, 0.07) + 0.3 * np.sin(2 * np.pi * 190 * x) * env(len(x), 0.001, 0.05))

def hat():
    x = t(0.06); return hp(rng.standard_normal(len(x)), 7000) * env(len(x), 0.001, 0.015)

n_bars = int(np.ceil(DUR / bar)) + 1
teclas = np.zeros((N, 2)); bateria = np.zeros((N, 2)); bajo = np.zeros((N, 2))
for b in range(n_bars):
    t0 = b * bar; c = acordes[b % 4]
    for i, m in enumerate(c):  # acorde rasgueado suave
        put(teclas, epiano(m, bar * 1.05), t0 + i * 0.018 + 0.01, 0.16, pan=(i - 2) * 0.18)
    # pequeña melodía cada 2 compases
    if b % 2 == 1:
        for k, (bt, m) in enumerate([(2.0, c[-1] + 12), (2.5, c[-2] + 12), (3.0, c[-3] + 12)]):
            put(teclas, epiano(m, 0.9), t0 + bt * beat + (0.06 if k % 2 else 0), 0.07, pan=0.3)
    x = t(bar * 0.95); f = mtof(bajos[b % 4])
    put(bajo, np.sin(2 * np.pi * f * x) * env(len(x), 0.01, 1.2), t0, 0.32)
    put(bajo, np.sin(2 * np.pi * f * x[: int(SR * beat)]) * env(int(SR * beat), 0.01, 0.4), t0 + 2.5 * beat, 0.22)
    if t0 < 0.5:
        pass
    for k in range(4):
        tb = t0 + k * beat
        if k in (0, 2): put(bateria, kick(), tb, 0.55)
        if k == 2 and b % 2 == 1: put(bateria, kick(), tb + beat * 0.75, 0.3)
        if k in (1, 3): put(bateria, snare(), tb + 0.01, 0.22)
        for h in range(2):
            sw = 0.0 if h == 0 else beat * 0.58  # swing
            put(bateria, hat(), tb + sw, 0.09 if h else 0.12, pan=0.25)

teclas = np.stack([lp(teclas[:, i], 2600) for i in range(2)], 1)
# compresión lateral sencilla: las teclas bajan un poco en cada bombo
duck = np.ones(N)
for b in range(n_bars):
    for k in (0, 2):
        s = int((b * bar + k * beat) * SR); n = int(0.25 * SR)
        if s < N: duck[s:s + n] = (1 - 0.35 * np.exp(-np.arange(min(n, N - s)) / SR / 0.08))
teclas *= duck[:, None]
crujido = np.zeros(N); idx = rng.integers(0, N, int(DUR * 25)); crujido[idx] = rng.uniform(-1, 1, len(idx))
crujido = hp(crujido, 1500) * 0.12 + lp(rng.standard_normal(N), 4000) * 0.004
musica = teclas + bateria * 0.9 + bajo + crujido[:, None]
musica = np.stack([lp(musica[:, i], 9000) for i in range(2)], 1)
fade = np.ones(N); a = int(0.6 * SR); fade[:a] = np.linspace(0.3, 1, a); z = int(1.2 * SR); fade[-z:] = np.linspace(1, 0, z)
musica *= fade[:, None]

# ---------------- EFECTOS ----------------
def s_pop():
    x = t(0.12); fr = 260 + 520 * np.exp(-x * 45)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(len(x), 0.002, 0.045)
def s_whoosh():
    x = t(0.38); n = rng.standard_normal(len(x))
    e = np.sin(np.pi * np.clip(x / 0.38, 0, 1)) ** 2
    return (bp(n, 500, 3500) * e) * 0.6
def s_tic():
    x = t(0.03); return np.sin(2 * np.pi * 2600 * x) * env(len(x), 0.0005, 0.006)
def s_trazo():
    x = t(0.5); n = bp(rng.standard_normal(len(x)), 1800, 6000)
    am = 0.6 + 0.4 * np.sin(2 * np.pi * 11 * x)
    return n * am * np.sin(np.pi * x / 0.5) * 0.35
def s_tecleo():
    x = t(0.05); n = bp(rng.standard_normal(len(x)), 1500, 7000)
    return n * env(len(x), 0.0005, 0.008) + 0.4 * np.sin(2 * np.pi * 160 * x) * env(len(x), 0.001, 0.01)
def s_campanita():
    x = t(1.1); f = 1568
    s = sum(a * np.sin(2 * np.pi * f * k * x) * np.exp(-x * d) for k, a, d in [(1, 1, 4), (2.76, 0.4, 7), (5.4, 0.2, 11)])
    return s * env(len(x), 0.002, 10) * 0.45
def s_conteo():
    out = np.zeros(int(0.8 * SR))
    for i in range(12):
        p = i / 11; ti = 0.73 * (1 - (1 - p) ** 2)
        x = t(0.025); c = np.sin(2 * np.pi * (1400 + 900 * p) * x) * env(len(x), 0.0005, 0.006)
        s = int(ti * SR); out[s:s + len(c)] += c[: len(out) - s]
    return out
def s_no():
    out = np.zeros(int(0.4 * SR))
    for k, (fr, st) in enumerate([(240, 0), (180, 0.13)]):
        x = t(0.16); w = np.sign(np.sin(2 * np.pi * fr * x)) * 0.3 + np.sin(2 * np.pi * fr * x) * 0.7
        c = lp(w, 1600) * env(len(x), 0.004, 0.06); s = int(st * SR); out[s:s + len(c)] += c
    return out * 0.6

GEN = {'pop': s_pop, 'whoosh': s_whoosh, 'tic': s_tic, 'trazo': s_trazo, 'tecleo': s_tecleo,
       'campanita': s_campanita, 'conteo': s_conteo, 'no': s_no}
NIVEL = {'pop': 0.8, 'whoosh': 0.5, 'tic': 0.35, 'trazo': 0.5, 'tecleo': 0.35, 'campanita': 0.35, 'conteo': 0.45, 'no': 0.6}
efectos = np.zeros((N, 2))
for e in json.load(open(eventos_path)):
    put(efectos, GEN[e['tipo']](), e['f'] / 30, NIVEL[e['tipo']] * e.get('vol', 1), pan=rng.uniform(-0.15, 0.15))

# Música por debajo de los efectos
mezcla = musica * 0.55 + efectos * 1.0
med = pyln.Meter(SR)
l = med.integrated_loudness(mezcla)
mezcla *= 10 ** ((LUFS - l) / 20)
pico = np.max(np.abs(mezcla))
if pico > 0.89: mezcla *= 0.89 / pico  # margen de pico (-1 dB)
print(f'sonoridad: {med.integrated_loudness(mezcla):.1f} LUFS · pico {20*np.log10(np.max(np.abs(mezcla))):.1f} dBFS')
import wave
pcm = (np.clip(mezcla, -1, 1) * 32767).astype('<i2')
with wave.open(salida, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(salida, f'{N/SR:.3f} s')
