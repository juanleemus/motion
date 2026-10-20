# Música JPR generada con código (nada de bancos de sonido): base oscura y tecnológica, a tempo,
# con subidas antes de cada "golpe" (cambio de bloque grande), batería apagada en las "pausas" y golpe final.
# Lee la sección "musica" del plan. Queda en −23 LUFS para ir debajo de la voz de Juan Pablo (−14).
# Uso: python3 scripts/musica.py <plan.json> <salida.wav>
import json, sys
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
import pyloudnorm as pyln

SR = 48000
LUFS = -23.0
rng = np.random.default_rng(11)
plan = json.load(open(sys.argv[1]))
salida = sys.argv[2]
m = plan.get('musica') or {}
dur = plan['total'] / plan['fps']
bpm = m.get('bpm', 100)
golpes = sorted(m.get('golpes', []))
pausas = m.get('pausas', [])
final = m.get('final')
N = int(dur * SR) + SR * 2
pista = {k: np.zeros(N) for k in ['bombo', 'palmas', 'platillos', 'bajo', 'colchon', 'arpegio', 'fx']}

def filtro(x, tipo, fc, o=2): return sosfilt(butter(o, fc, tipo, fs=SR, output='sos'), x)
def t(seg): return np.arange(int(seg * SR)) / SR
def poner(nombre, inicio, x, g=1.0):
    i = int(inicio * SR)
    if i >= N or i + len(x) <= 0: return
    if i < 0: x, i = x[-i:], 0
    x = x[: N - i]
    pista[nombre][i:i + len(x)] += x * g
def env(n, a, tau): return np.minimum(1, n / max(a, 1e-4)) * np.exp(-n / tau)
def en_pausa(s): return any(a <= s < b for a, b in pausas)

beat = 60 / bpm
compas = 4 * beat
t0 = golpes[0] if golpes else 0.0
fin_ritmo = final if final is not None else dur
# La menor, oscura: Am – F – C – G (raíces y acordes)
acordes = [(55.0, [220.0, 261.63, 329.63]), (43.65, [174.61, 220.0, 261.63]), (65.41, [196.0, 261.63, 329.63]), (49.0, [196.0, 246.94, 293.66])]

def bombo():
    n = t(0.42); f = 46 + 110 * np.exp(-n * 38)
    return np.tanh(2.2 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.001, 0.2)) + 0.25 * filtro(rng.standard_normal(len(n)), 'highpass', 3000) * env(n, 0.0002, 0.004)
def palma():
    n = t(0.35); x = np.zeros(len(n))
    for k, d in enumerate([0, 0.011, 0.022]):
        i = int(d * SR); r = filtro(rng.standard_normal(len(n) - i), 'bandpass', [900, 4200])
        x[i:] += r * env(n[: len(n) - i], 0.0005, 0.012 if k < 2 else 0.09)
    return x
def platillo(abierto=False):
    n = t(0.3 if abierto else 0.06)
    return filtro(rng.standard_normal(len(n)), 'highpass', 7000) * env(n, 0.0005, 0.09 if abierto else 0.018)
def sierra(f, n, voces=3):
    x = np.zeros(len(n))
    for v in range(voces):
        d = 1 + (v - (voces - 1) / 2) * 0.006
        fase = (f * d * n + rng.random()) % 1
        x += 2 * fase - 1
    return x / voces

# ---- colchón (acordes largos, siempre) ----
k = 0; s = 0.0
while s < dur:
    raiz, notas = acordes[k % 4]
    n = t(compas + 0.6)
    x = sum(sierra(f, n) for f in notas) / 3
    x = filtro(x, 'lowpass', 1100) * np.minimum(1, n / 0.35) * np.minimum(1, np.maximum(0, (compas + 0.6 - n) / 0.6))
    poner('colchon', s, x, 0.33)
    k += 1; s += compas

# ---- batería, bajo y arpegio desde el primer golpe ----
s = t0; paso = beat / 4; i = 0
while s < fin_ritmo - 1e-6:
    if not en_pausa(s):
        pos = i % 16; c = int((s - t0) // compas)
        raiz, notas = acordes[c % 4]
        if pos in (0, 8) or (pos == 14 and c % 2 == 1): poner('bombo', s, bombo(), 0.9)
        if pos in (4, 12): poner('palmas', s, palma(), 0.55)
        vel = [1, 0.35, 0.65, 0.35][pos % 4]
        poner('platillos', s, platillo(pos % 4 == 2 and pos in (6, 14)), 0.28 * vel)
        if pos % 2 == 0:  # bajo en corcheas, con caída por el bombo
            n = t(beat / 2 * 0.95)
            b = filtro(sierra(raiz, n, 2), 'lowpass', 260) * env(n, 0.004, 0.18)
            poner('bajo', s, b, 0.55 if pos % 4 == 0 else 0.4)
        if pos % 2 == 0 and c % 2 == 0 or pos in (3, 11):  # arpegio suave
            f = notas[(i // 2) % 3] * 2
            n = t(0.28)
            a = (np.sin(2 * np.pi * f * n) + 0.3 * np.sin(4 * np.pi * f * n)) * env(n, 0.002, 0.07)
            poner('arpegio', s, a, 0.12)
    s += paso; i += 1

# ---- bombeo (sidechain) del colchón y el bajo con el bombo ----
bomb = np.abs(pista['bombo'])
bomb = filtro(bomb, 'lowpass', 12)
duck = 1 - 0.55 * np.clip(bomb / (bomb.max() + 1e-9) * 3, 0, 1)
pista['colchon'] *= duck; pista['bajo'] *= duck; pista['arpegio'] *= duck

# ---- subidas e impactos ----
def subida(largo=1.6):
    n = t(largo); x = rng.standard_normal(len(n)); y = np.zeros(len(n)); bloque = 1200
    for j in range(0, len(n), bloque):
        p = j / len(n); fc = 400 + 7000 * p ** 2
        y[j:j + bloque] = filtro(x[max(0, j - 6000):j + bloque], 'bandpass', [fc * 0.7, min(fc * 1.5, 20000)])[-len(x[j:j + bloque]):]
    tono = np.sin(2 * np.pi * np.cumsum(180 + 520 * (n / largo) ** 2) / SR) * 0.25
    return (y + tono) * (n / largo) ** 2.2
def impacto():
    n = t(2.2)
    sub = np.sin(2 * np.pi * np.cumsum(38 + 50 * np.exp(-n * 9)) / SR) * env(n, 0.002, 0.7)
    choque = filtro(rng.standard_normal(len(n)), 'lowpass', 4500) * env(n, 0.001, 0.35) * 0.35
    return np.tanh(1.5 * (sub + choque))
for g in golpes:
    poner('fx', g - 1.6, subida(), 0.5)
    poner('fx', g, impacto(), 0.9)
if final is not None:
    poner('fx', final - 1.2, subida(1.2), 0.45)
    poner('fx', final, impacto(), 1.0)
    i = int(final * SR)  # después del golpe final solo queda la cola
    for kk in ['colchon', 'arpegio']:
        pista[kk][i:] *= np.exp(-np.arange(N - i) / SR / 0.5)

# ---- mezcla ----
niveles = {'bombo': 1.0, 'palmas': 0.8, 'platillos': 0.7, 'bajo': 0.9, 'colchon': 0.8, 'arpegio': 0.8, 'fx': 0.9}
mez = sum(pista[k] * g for k, g in niveles.items())[: int(dur * SR)]
mez = np.tanh(1.2 * mez)
fade = int(0.4 * SR); mez[-fade:] *= np.linspace(1, 0, fade)
izq = mez + 0.15 * np.roll(pista['platillos'][: len(mez)] + pista['arpegio'][: len(mez)], 240)
der = mez + 0.15 * np.roll(pista['platillos'][: len(mez)] + pista['arpegio'][: len(mez)], -240)
est = np.stack([izq, der], axis=1)
med = pyln.Meter(SR)
est *= 10 ** ((LUFS - med.integrated_loudness(est)) / 20)
pico = np.max(np.abs(est))
if pico > 10 ** (-3 / 20): est *= 10 ** (-3 / 20) / pico
wavfile.write(salida, SR, (est * 32767).astype(np.int16))
print(f'Música: {bpm} bpm · {len(golpes)} golpes · {med.integrated_loudness(est):.1f} LUFS · pico {20 * np.log10(np.max(np.abs(est))):.1f} dBFS')
