# Quita TODOS los silencios de un video ya editado (audio y video con los mismos cortes, en fotogramas exactos).
# Deja solo un respiro mínimo entre palabras para que no suene pegado.
# Uso: python3 scripts/quitar_silencios_av.py entrada.mp4 voz.wav salida_dir [umbral_db] [respiro_s]
import json, subprocess, sys, wave
import numpy as np
ent, voz, out = sys.argv[1:4]
UMBRAL = float(sys.argv[4]) if len(sys.argv) > 4 else -38
RESPIRO = float(sys.argv[5]) if len(sys.argv) > 5 else 0.06
SR, FPS = 48000, 30
w = wave.open(voz); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float64) / 32768
H = int(0.01 * SR)
r = 20 * np.log10(np.sqrt(np.convolve(x ** 2, np.ones(H) / H, mode='same')[::H]) + 1e-9)
voz_on = r > UMBRAL
# tramos con voz (en pasos de 10 ms); huecos de menos de 60 ms no cuentan como silencio
tramos = []; ini = None
for i, v in enumerate(voz_on):
    if v and ini is None: ini = i
    if not v and ini is not None: tramos.append([ini, i]); ini = None
if ini is not None: tramos.append([ini, len(voz_on)])
uni = [tramos[0]]
for a, b in tramos[1:]:
    if (a - uni[-1][1]) * 0.01 < 0.06: uni[-1][1] = b
    else: uni.append([a, b])
# cada tramo con medio respiro antes y después, en fotogramas exactos
seg = []
for a, b in uni:
    fa = int(np.floor((a * 0.01 - RESPIRO / 2) * FPS)); fb = int(np.ceil((b * 0.01 + RESPIRO / 2) * FPS))
    fa = max(0, fa)
    if seg and fa <= seg[-1][1]: seg[-1][1] = max(seg[-1][1], fb)
    else: seg.append([fa, fb])
total = sum(b - a for a, b in seg)
print(f'{len(seg)} tramos · {total} fotogramas ({total / FPS:.2f} s) · antes {len(x) / SR:.2f} s')
json.dump(seg, open(f'{out}/tramos.json', 'w'))
# audio: mismos tramos, fundidos de 8 ms
nf = int(0.008 * SR); rp = np.linspace(0, 1, nf); partes = []
for a, b in seg:
    s = x[int(a / FPS * SR):int(b / FPS * SR)].copy(); s[:nf] *= rp; s[-nf:] *= rp[::-1]; partes.append(s)
y = np.concatenate(partes)
with wave.open(f'{out}/voz.wav', 'wb') as o:
    o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR); o.writeframes((np.clip(y, -1, 1) * 32767).astype('<i2').tobytes())
sel = '+'.join(f'between(n,{a},{b - 1})' for a, b in seg)
open(f'{out}/select.txt', 'w').write(f"select='{sel}',setpts=N/{FPS}/TB")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', ent, '-i', f'{out}/voz.wav', '-filter_script:v', f'{out}/select.txt', '-map', '0:v', '-map', '1:a', '-r', str(FPS), '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '320k', '-shortest', '-movflags', '+faststart', f'{out}/presentador-sin-silencios.mp4'], check=True)
print(f'{out}/presentador-sin-silencios.mp4')
