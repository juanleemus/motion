# Arma la voz editada a partir de una lista de tomas elegidas del crudo (cuando hay varias tomas por frase,
# alguien que dicta o charla entre tomas). Une las tomas casi sin pausa, quita la saturación (adeclip),
# limpia y deja en -14 LUFS con pico real <= -1,5 dBTP.
# Uso: python3 scripts/editar_por_tomas.py cruda.wav tomas.json salida.wav lista-de-cortes.txt
#   tomas.json: [{"de": s, "a": s, "texto": "...", "pausa": s}, ...] en orden; "pausa" = silencio después.
import json, subprocess, sys, wave
import numpy as np
import pyloudnorm as pyln
from scipy.ndimage import maximum_filter1d
from scipy.signal import resample_poly

cruda, tomas_p, salida, lista = sys.argv[1:5]
SR = 48000
ANTES, DESPUES, FUNDIDO = 0.05, 0.07, 0.015

def leer(p, filtro=None):
    cmd = ['ffmpeg', '-v', 'error', '-i', p]
    if filtro: cmd += ['-af', filtro]
    cmd += ['-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, '<f4').astype(np.float64)

x = leer(cruda, 'adeclip')  # reconstruye los picos recortados (la voz llegaba a 0 dBFS)
tomas = json.load(open(tomas_p, encoding='utf-8'))
nf = int(FUNDIDO * SR); rampa = np.linspace(0, 1, nf)
buf = []; mapa = []; t = 0.0
# Energía en ventanas de 20 ms: sirve para no cortar arranques ni finales suaves de cada toma.
H = int(0.02 * SR)
rms = 20 * np.log10(np.sqrt(np.convolve(x ** 2, np.ones(H) / H, mode='same')[::H]) + 1e-9)
def extender(de, a):
    i0, i1 = int(de / 0.02), int(a / 0.02)
    hueco = 0; j = i1
    while j < len(rms) - 1 and (j - i1) * 0.02 < 1.0:  # hacia adelante, hasta 1 s, sin cruzar huecos de >0,1 s
        j += 1
        hueco = hueco + 1 if rms[j] < -42 else 0
        if hueco * 0.02 > 0.1: j -= hueco; break
    hueco = 0; k = i0
    while k > 0 and (i0 - k) * 0.02 < 0.5:
        k -= 1
        hueco = hueco + 1 if rms[k] < -42 else 0
        if hueco * 0.02 > 0.1: k += hueco; break
    return k * 0.02, j * 0.02
for k in tomas:
    de, aa = extender(k['de'], k['a'])
    a = max(0, de - ANTES); b = min(len(x) / SR, aa + DESPUES)
    seg = x[int(a * SR):int(b * SR)].copy()
    seg[:nf] *= rampa; seg[-nf:] *= rampa[::-1]
    mapa.append((a, b, t, k['texto'])); buf.append(seg); t += len(seg) / SR
    p = k.get('pausa', 0.04)
    if p > 0: buf.append(np.zeros(int(p * SR))); t += p
y = np.concatenate(buf)
tmp = salida + '.tmp.wav'
with wave.open(tmp, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(y, -1, 1) * 32767).astype('<i2').tobytes())
y = leer(tmp, 'highpass=f=80,afftdn=nf=-50:nr=8,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=1')
import os; os.remove(tmp)
med = pyln.Meter(SR); techo = 10 ** (-1.9 / 20)
def pico(v): return np.max(np.abs(resample_poly(v, 4, 1)))
def limitar(v, tt):
    env = maximum_filter1d(np.abs(v), size=int(0.005 * SR)); g = np.minimum(1.0, tt / np.maximum(env, 1e-9))
    al = np.exp(-1 / (0.06 * SR)); s = np.empty_like(g); k = 1.0
    for i in range(len(g) - 1, -1, -1): k = min(g[i], al * k + (1 - al) * g[i]); s[i] = k
    k = 1.0
    for i in range(len(g)): k = min(s[i], al * k + (1 - al) * s[i]); s[i] = k
    return v * s
for _ in range(8):
    y *= 10 ** ((-14 - med.integrated_loudness(y)) / 20)
    if pico(y) > techo: y = limitar(y, techo * 0.94)
print(f'voz editada: {med.integrated_loudness(y):.2f} LUFS · pico real {20*np.log10(pico(y)):.2f} dBTP · {len(y)/SR:.3f} s (crudo {len(x)/SR:.1f} s)')
with wave.open(salida, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(y, -1, 1) * 32767).astype('<i2').tobytes())
def hms(s): return f'{int(s//60)}:{s%60:06.3f}'
with open(lista, 'w', encoding='utf-8') as f:
    f.write(f'Crudo: {len(x)/SR:.1f} s  ->  voz editada: {len(y)/SR:.3f} s\n')
    f.write('Se quitó: la voz de quien dicta, las tomas repetidas o incompletas, comentarios entre tomas y todos los silencios.\n')
    f.write('Se dejó: la mejor toma completa de cada frase, unidas con fundidos de 15 ms. Se corrigió la saturación (picos recortados).\n\n')
    f.write('TOMAS QUE QUEDARON (crudo -> voz editada)\n')
    for a, b, d, txt in mapa:
        f.write(f'  crudo {hms(a)} - {hms(b)}  ->  editada {hms(d)}   {txt}\n')
print(lista)
