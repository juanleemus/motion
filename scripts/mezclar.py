# Mezcla pistas (wav) sumándolas tal cual y deja el total en LUFS (pico real <= -1,5 dBTP).
# Uso: python3 scripts/mezclar.py salida.wav segundos lufs pista1.wav [pista2.wav ...]
import subprocess, sys, wave
import numpy as np, pyloudnorm as pyln
from scipy.ndimage import maximum_filter1d
from scipy.signal import resample_poly
SR = 48000
salida, dur, lufs, pistas = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4:]
N = int(round(dur * SR))
def leer(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    y = np.frombuffer(raw, '<f4').astype(np.float64).reshape(-1, 2)[:N]
    return np.pad(y, ((0, N - len(y)), (0, 0)))
y = sum(leer(p) for p in pistas)
med = pyln.Meter(SR); techo = 10 ** (-1.8 / 20)
def pico(v): return max(np.max(np.abs(resample_poly(v[:, c], 4, 1))) for c in range(2))
def limitar(v):
    env = maximum_filter1d(np.max(np.abs(v), 1), size=int(0.005 * SR))
    g = np.minimum(1.0, techo / np.maximum(env, 1e-9)); a = np.exp(-1 / (0.06 * SR)); s = np.empty_like(g); k = 1.0
    for i in range(len(g) - 1, -1, -1): k = min(g[i], a * k + (1 - a) * g[i]); s[i] = k
    k = 1.0
    for i in range(len(g)): k = min(s[i], a * k + (1 - a) * s[i]); s[i] = k
    return v * s[:, None]
for _ in range(5):
    y *= 10 ** ((lufs - med.integrated_loudness(y)) / 20)
    if pico(y) > techo: y = limitar(y * 0.999)
print(salida, f'{med.integrated_loudness(y):.2f} LUFS · pico real {20*np.log10(pico(y)):.2f} dBTP · {N/SR:.3f} s')
pcm = (np.clip(y, -1, 1) * 32767).astype('<i2')
with wave.open(salida, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
