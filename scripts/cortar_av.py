# Corta audio y video del crudo con LOS MISMOS cortes: la mejor toma de cada frase (tomas.json), sin la voz
# de quien dicta y sin silencios internos. Los cortes caen en fotogramas exactos (30 fps) para que
# el video del presentador quede sincronizado con la voz editada.
# Uso: python3 scripts/cortar_av.py crudo.mp4 tomas.json salida_dir
import json, subprocess, sys, wave, os
import numpy as np
import pyloudnorm as pyln
from scipy.ndimage import maximum_filter1d
from scipy.signal import resample_poly
crudo, tomas_p, out = sys.argv[1:4]
SR, FPS = 48000, 30
def leer(p, filtro=None, extra=()):
    cmd = ['ffmpeg', '-v', 'error', '-i', p, *extra]
    if filtro: cmd += ['-af', filtro]
    cmd += ['-vn', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, '<f4').astype(np.float64)
x = leer(crudo, 'adeclip')
H = int(0.02 * SR)
rms = 20 * np.log10(np.sqrt(np.convolve(x ** 2, np.ones(H) / H, mode='same')[::H]) + 1e-9)
def extender(de, a):
    i0, i1 = int(de / 0.02), int(a / 0.02); hueco = 0; j = i1
    while j < len(rms) - 1 and (j - i1) * 0.02 < 1.0:
        j += 1; hueco = hueco + 1 if rms[j] < -42 else 0
        if hueco * 0.02 > 0.1: j -= hueco; break
    hueco = 0; k = i0
    while k > 0 and (i0 - k) * 0.02 < 0.5:
        k -= 1; hueco = hueco + 1 if rms[k] < -42 else 0
        if hueco * 0.02 > 0.1: k += hueco; break
    return k * 0.02, j * 0.02
tomas = json.load(open(tomas_p, encoding='utf-8'))
cortes = []  # (a, b, texto) en tiempo del crudo
for t in tomas:
    de, a = extender(t['de'], t['a'])
    # parte la toma en sus silencios internos de más de 0,14 s
    i0, i1 = int(de / 0.02), int(a / 0.02); ini = i0; hueco = 0
    for i in range(i0, i1 + 1):
        if rms[i] < -42: hueco += 1
        else:
            if hueco * 0.02 > 0.14:
                cortes.append((ini * 0.02, (i - hueco) * 0.02, t['texto'])); ini = i
            hueco = 0
    cortes.append((ini * 0.02, a, t['texto']))
# aire: 0,05 s antes y 0,05 s después de cada tramo (la pausa entre tramos queda en ~0,1 s); en fotogramas exactos
seg = []
for a, b, txt in cortes:
    fa = int(np.floor((a - 0.05) * FPS)); fb = int(np.ceil((b + 0.05) * FPS))
    if seg and fa <= seg[-1][1]: seg[-1][1] = max(seg[-1][1], fb)
    else: seg.append([max(0, fa), fb, txt])
json.dump([[a / FPS, b / FPS, t] for a, b, t in seg], open(f'{out}/cortes.json', 'w'), ensure_ascii=False, indent=0)
# audio
nf = int(0.012 * SR); r = np.linspace(0, 1, nf); partes = []
for a, b, _ in seg:
    s = x[int(a / FPS * SR):int(b / FPS * SR)].copy(); s[:nf] *= r; s[-nf:] *= r[::-1]; partes.append(s)
y = np.concatenate(partes)
tmp = f'{out}/tmp.wav'
with wave.open(tmp, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(y, -1, 1) * 32767).astype('<i2').tobytes())
y = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', tmp, '-af', 'highpass=f=80,afftdn=nf=-50:nr=8,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=1', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout, '<f4').astype(np.float64)
os.remove(tmp)
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
with wave.open(f'{out}/voz-editada.wav', 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(y, -1, 1) * 32767).astype('<i2').tobytes())
total = sum(b - a for a, b, _ in seg)
print(f'{len(seg)} tramos · {total} fotogramas ({total / FPS:.3f} s) · {med.integrated_loudness(y):.2f} LUFS · pico {20*np.log10(pico(y)):.2f} dBTP')
# video: los mismos fotogramas
sel = '+'.join(f'between(n,{a},{b - 1})' for a, b, _ in seg)
open(f'{out}/select.txt', 'w').write(f"select='{sel}',setpts=N/{FPS}/TB")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', crudo, '-filter_script:v', f'{out}/select.txt', '-an', '-r', str(FPS), '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', f'{out}/presentador-cortado.mp4'], check=True)
print(f'{out}/presentador-cortado.mp4')
