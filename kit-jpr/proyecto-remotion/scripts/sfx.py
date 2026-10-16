# Efectos de sonido JPR generados con código: whoosh, pop, tic, clic, tecleo, trazo.
# Secos y sutiles (nada de caricatura). Cada uno queda en −24 LUFS para ir debajo de la voz.
# Uso: python3 scripts/sfx.py public/sfx
import os, sys
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
import pyloudnorm as pyln

SR = 48000
LUFS = -24.0
PICO = 10 ** (-6 / 20)  # nunca por encima de −6 dBFS
rng = np.random.default_rng(7)
salida = sys.argv[1] if len(sys.argv) > 1 else 'public/sfx'
os.makedirs(salida, exist_ok=True)

def t(seg): return np.arange(int(seg * SR)) / SR
def ruido(seg): return rng.standard_normal(int(seg * SR))
def filtro(x, tipo, fc, o=2): return sosfilt(butter(o, fc, tipo, fs=SR, output='sos'), x)
def caida(x, ataque, tau):
    n = np.arange(len(x)) / SR
    return x * np.minimum(1, n / max(ataque, 1e-4)) * np.exp(-n / tau)
def cola(x, ms=6):  # evita clics al final
    n = int(SR * ms / 1000); x = x.copy(); x[-n:] *= np.linspace(1, 0, n); return x

def whoosh():
    d = 0.42; x = ruido(d); n = t(d)
    # barrido de un filtro pasa banda por bloques (de grave a agudo y vuelve)
    y = np.zeros_like(x); bloque = 960
    for i in range(0, len(x), bloque):
        p = i / len(x)
        fc = 350 + 2600 * np.sin(np.pi * p) ** 1.5
        y[i:i + bloque] = filtro(x[max(0, i - 4000):i + bloque], 'bandpass', [fc * 0.6, fc * 1.6])[-len(x[i:i + bloque]):]
    env = np.sin(np.pi * np.clip(n / d, 0, 1)) ** 2.2
    return cola(filtro(y * env, 'lowpass', 6000))

def pop():
    d = 0.14; n = t(d)
    f = 340 + 260 * np.exp(-n * 45)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    s = caida(s, 0.002, 0.035) + 0.15 * caida(filtro(ruido(d), 'highpass', 2500), 0.0005, 0.004)
    return cola(filtro(s, 'lowpass', 5000))

def tic():
    d = 0.035; n = t(d)
    s = np.sin(2 * np.pi * 3100 * n) * 0.7 + 0.5 * filtro(ruido(d), 'bandpass', [2500, 7000])
    return cola(caida(s, 0.0003, 0.005), 3)

def clic():
    d = 0.07; n = t(d)
    a = caida(np.sin(2 * np.pi * 1900 * n), 0.0003, 0.006)
    b = caida(np.sin(2 * np.pi * 850 * n), 0.001, 0.014) * 0.6
    c = caida(filtro(ruido(d), 'bandpass', [1500, 6000]), 0.0002, 0.003) * 0.4
    return cola(np.concatenate([np.zeros(int(0.0)), a + b + c]))

def tecleo():  # una tecla suave (se repite por cada letra que se escribe)
    d = 0.06; n = t(d)
    s = caida(filtro(ruido(d), 'bandpass', [1200, 5200]), 0.0003, 0.007)
    s += 0.35 * caida(np.sin(2 * np.pi * 420 * n), 0.001, 0.012)
    return cola(s, 3)

def trazo():  # línea que se dibuja: roce suave que sube
    d = 0.36; n = t(d); x = ruido(d)
    y = filtro(x, 'bandpass', [2200, 7500]) * 0.8 + filtro(x, 'bandpass', [600, 1800]) * 0.2
    env = np.clip(n / 0.06, 0, 1) * np.exp(-np.clip(n - 0.08, 0, None) / 0.11)
    return cola(y * env)

medidor = pyln.Meter(SR, block_size=0.1)
for nombre, fn in [('whoosh', whoosh), ('pop', pop), ('tic', tic), ('clic', clic), ('tecleo', tecleo), ('trazo', trazo)]:
    s = fn().astype(np.float64)
    medir = np.concatenate([s, np.zeros(max(0, int(0.2 * SR) - len(s)))])
    ganancia = 10 ** ((LUFS - medidor.integrated_loudness(medir)) / 20)
    s = s * ganancia
    if np.max(np.abs(s)) > PICO: s *= PICO / np.max(np.abs(s))
    estereo = np.stack([s, s], axis=1)
    wavfile.write(os.path.join(salida, f'{nombre}.wav'), SR, (estereo * 32767).astype(np.int16))
    print(f'{nombre:7s} {len(s) / SR * 1000:4.0f} ms  {medidor.integrated_loudness(np.concatenate([s, np.zeros(max(0, int(0.2 * SR) - len(s)))])):6.1f} LUFS  pico {20 * np.log10(np.max(np.abs(s))):5.1f} dBFS')
