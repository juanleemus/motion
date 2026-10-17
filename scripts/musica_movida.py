# Música movida para el Día 11 (sin efectos), generada con código. 100 BPM para seguir el pulso
# visual del reel, pero con sensación de doble tiempo: bombo en cada tiempo, hi-hats en semicorcheas,
# bajo sincopado y arpegio. Sigue la historia: entrada, "drop" en "Día 11", bajón en los riesgos,
# subida y "drop" final en el llamado a comentar, cierre en el logo.
# Uso: python3 scripts/musica_movida.py salida.wav [segundos] [lufs]
import sys
import numpy as np
from scipy.signal import butter, sosfilt
import pyloudnorm as pyln

SR = 48000
salida = sys.argv[1]
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 87.0
LUFS = float(sys.argv[3]) if len(sys.argv) > 3 else -24.0
N = int(round(DUR * SR))
rng = np.random.default_rng(11)

BPM = 100; beat = 60 / BPM; bar = 4 * beat; s16 = beat / 4

def t(sec): return np.arange(int(sec * SR)) / SR
def lp(x, fc, o=2): return sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x)
def hp(x, fc, o=2): return sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], 'band', fs=SR, output='sos'), x)
def env(n, a, d):
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d)
def mtof(m): return 440 * 2 ** ((m - 69) / 12)
def saw(f, x, det=0.0):
    return 2 * ((f * (1 + det) * x) % 1) - 1

def put(buf, x, start, gain=1.0, pan=0.0):
    s = int(round(start * SR))
    if s >= len(buf) or s + len(x) <= 0: return
    if s < 0: x = x[-s:]; s = 0
    x = x[: len(buf) - s]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[s:s + len(x), 0] += x * gain * l * 1.414
    buf[s:s + len(x), 1] += x * gain * r * 1.414

# ---------- Secciones (en compases de 2,4 s) ----------
# 0-5 entrada · 6-15 drop A ("Día 11") · 16-23 drop B con melodía · 24-26 bajón (riesgos)
# 27-29 subida · 30-34 drop final (comenta) · 35-36 cierre
def seccion(b):
    if b < 6: return 'entrada'
    if b < 16: return 'A'
    if b < 24: return 'B'
    if b < 27: return 'bajon'
    if b < 30: return 'subida'
    if b < 35: return 'final'
    return 'cierre'

# Am – F – C – G (i–VI–III–VII): tensa pero con impulso.
acordes = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
bajos = [33, 29, 36, 31]

def kick():
    x = t(0.35); fr = 45 + 110 * np.exp(-x * 38)
    k = np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(len(x), 0.001, 0.13)
    clic = hp(rng.standard_normal(len(x)), 3000) * env(len(x), 0.0005, 0.004) * 0.3
    return np.tanh(1.6 * (k + clic))
def clap():
    x = t(0.3); n = bp(rng.standard_normal(len(x)), 1000, 6000)
    e = sum(env(len(x), 0.001, 0.008) * (np.arange(len(x)) >= int(d * SR)) for d in (0, 0.01, 0.02))
    return n * (e * 0.5 + env(len(x), 0.001, 0.09)) * 0.8
def hat(abierto=False):
    x = t(0.25 if abierto else 0.05)
    return hp(rng.standard_normal(len(x)), 8000) * env(len(x), 0.0005, 0.08 if abierto else 0.012)
def pluck(m, dur=0.22, brillo=4000):
    x = t(dur); f = mtof(m)
    s = saw(f, x) * 0.6 + saw(f, x, 0.006) * 0.4
    return lp(s, brillo) * env(len(x), 0.002, 0.09)
def bajo_nota(m, dur):
    x = t(dur); f = mtof(m)
    s = saw(f, x) * 0.5 + np.sin(2 * np.pi * f * x)
    return lp(s, 700) * env(len(x), 0.004, dur * 0.7)
def pad(notas, dur):
    x = t(dur); s = np.zeros(len(x))
    for m in notas:
        for d in (-0.007, 0, 0.007):
            s += saw(mtof(m + 12), x, d)
    a = np.minimum(1, x / 0.4) * np.minimum(1, (dur - x) / 0.3).clip(0, 1)
    return lp(s / (len(notas) * 3), 2200) * a
def lead(m, dur):
    x = t(dur); f = mtof(m)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * x) * np.minimum(1, x / 0.2)
    s = np.sin(2 * np.pi * np.cumsum(np.full(len(x), f) * vib) / SR) + 0.3 * saw(f, x)
    return lp(s, 3500) * env(len(x), 0.01, dur * 0.8)
def riser(dur):
    x = t(dur); n = rng.standard_normal(len(x)); out = np.zeros(len(x))
    tramos = 24
    for i in range(tramos):  # ruido que se va abriendo hacia arriba
        a, b = int(i * len(x) / tramos), int((i + 1) * len(x) / tramos)
        fc = 400 + (9000 - 400) * (i / tramos) ** 2
        out[a:b] = hp(n[a:b], fc)
    return out * (x / dur) ** 2 * 0.5
def impacto():
    x = t(1.6); fr = 38 + 60 * np.exp(-x * 12)
    boom = np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(len(x), 0.002, 0.5)
    plato = hp(rng.standard_normal(len(x)), 5000) * env(len(x), 0.002, 0.6) * 0.25
    return boom + plato

bateria = np.zeros((N, 2)); bajo = np.zeros((N, 2)); armonia = np.zeros((N, 2)); fx = np.zeros((N, 2))
n_bars = int(np.ceil(DUR / bar)) + 1
melodia = [(0, 76, 2), (2, 74, 1), (3, 72, 1), (4, 71, 2), (6, 72, 1), (7, 74, 1)]  # (corchea, nota, largo)
bombos = []

for b in range(n_bars):
    t0 = b * bar; sec = seccion(b); c = acordes[b % 4]; raiz = bajos[b % 4]
    lleno = sec in ('A', 'B', 'final')
    # Batería
    for k in range(4):
        tb = t0 + k * beat
        if sec in ('entrada', 'A', 'B', 'final') or (sec == 'subida') or (sec == 'cierre' and b == 35):
            if not (sec == 'entrada' and b < 2 and k % 2):
                put(bateria, kick(), tb, 0.75); bombos.append(tb)
        if lleno and k in (1, 3): put(bateria, clap(), tb, 0.38)
        for h in range(4):
            th = tb + h * s16
            if lleno or (sec == 'entrada' and b >= 2) or sec == 'subida':
                if h == 2: put(bateria, hat(True), th, 0.10 if lleno else 0.07, pan=0.2)
                elif lleno or h == 0: put(bateria, hat(), th, (0.11 if h == 0 else 0.07), pan=-0.15)
    # Redoble que acelera en la subida (al final de cada compás de subida, más denso en el último)
    if sec == 'subida':
        golpes = 4 if b < 29 else 16
        for i in range(golpes):
            put(bateria, clap(), t0 + 3 * beat + i * beat / golpes if b < 29 else t0 + i * bar / golpes, 0.12 + 0.25 * i / golpes)
    # Bajo sincopado en corcheas
    if sec not in ('bajon', 'cierre') or (sec == 'cierre' and b == 35):
        patron = [0, 1, 1, 0, 1, 1, 0, 1] if lleno else [1, 0, 0, 1, 0, 0, 1, 0]
        for i, v in enumerate(patron):
            if v or not lleno:
                if v: put(bajo, bajo_nota(raiz + (12 if i in (3, 6) and lleno else 0), beat / 2 * 0.9), t0 + i * beat / 2, 0.42)
    # Arpegio en semicorcheas (filtrado en el bajón, abriéndose en la subida)
    if sec != 'cierre' or b == 35:
        brillo = {'entrada': 2600, 'A': 4200, 'B': 4800, 'bajon': 1200, 'subida': 1800 + 900 * (b - 27), 'final': 5200, 'cierre': 3000}[sec]
        arp = [c[0], c[1], c[2], c[1] + 12, c[2], c[1], c[0] + 12, c[2]]
        for i in range(16):
            put(armonia, pluck(arp[i % 8] + 12, brillo=brillo), t0 + i * s16, 0.24 if sec == 'bajon' else 0.11, pan=0.35 if i % 2 else -0.35)
    # Colchón
    if sec in ('A', 'B', 'bajon', 'subida', 'final', 'cierre'):
        put(armonia, pad(c, bar), t0, 0.16 if sec != 'bajon' else 0.5)
    if sec == 'bajon':  # pulso suave para que no se caiga la energía
        for k in range(4): put(bajo, bajo_nota(raiz, beat * 0.9), t0 + k * beat, 0.3)
    # Melodía en B y en el drop final
    if sec in ('B', 'final') and b % 2 == 0:
        for (o, m, largo) in melodia:
            put(armonia, lead(m - (0 if b % 4 == 0 else 2), largo * beat / 2), t0 + o * beat / 2, 0.10, pan=0.1)
    # Subidas e impactos en los cambios de sección
    if b in (5, 29): put(fx, riser(bar), t0, 0.5)
    if b in (6, 30): put(fx, impacto(), t0, 0.55)
    if b == 24: put(fx, impacto(), t0, 0.35)

# Acorde final que se sostiene hasta el último segundo
fin = 36 * bar
put(armonia, pad(acordes[0], DUR - fin + 0.1), fin, 0.22)
put(bajo, bajo_nota(33, DUR - fin), fin, 0.4)
put(fx, impacto(), fin, 0.4)

# Compresión lateral: todo lo melódico respira con el bombo
duck = np.ones(N)
for tb in bombos:
    s = int(tb * SR); n = min(int(0.22 * SR), N - s)
    if 0 <= s < N: duck[s:s + n] = np.minimum(duck[s:s + n], 1 - 0.55 * np.exp(-np.arange(n) / SR / 0.07))
mezcla = bateria + (bajo + armonia) * duck[:, None] + fx
mezcla = np.stack([hp(mezcla[:, i], 28) for i in range(2)], 1)
f_out = np.ones(N); z = int(1.0 * SR); f_out[-z:] = np.linspace(1, 0, z) ** 1.5
mezcla *= f_out[:, None]

from scipy.ndimage import maximum_filter1d
def limitar(y, techo=0.89):
    e = maximum_filter1d(np.max(np.abs(y), 1), size=int(0.005 * SR))
    g = np.minimum(1.0, techo / np.maximum(e, 1e-9))
    a = np.exp(-1 / (0.08 * SR)); suave = np.empty_like(g); v = 1.0
    for i in range(len(g) - 1, -1, -1):
        v = min(g[i], a * v + (1 - a) * g[i]); suave[i] = v
    v = 1.0
    for i in range(len(g)):
        v = min(suave[i], a * v + (1 - a) * suave[i]); suave[i] = v
    return y * suave[:, None]
med = pyln.Meter(SR)
for _ in range(4):
    l = med.integrated_loudness(mezcla)
    mezcla *= 10 ** ((LUFS - l) / 20)
    if np.max(np.abs(mezcla)) > 0.89: mezcla = limitar(mezcla)
print(f'sonoridad: {med.integrated_loudness(mezcla):.1f} LUFS · pico {20*np.log10(np.max(np.abs(mezcla))):.1f} dBFS')
import wave
pcm = (np.clip(mezcla, -1, 1) * 32767).astype('<i2')
with wave.open(salida, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(salida, f'{N/SR:.3f} s')
