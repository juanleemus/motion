# Edita la voz en off cruda: acorta los silencios largos, quita tramos sobrantes (tomas repetidas,
# muletillas), une con fundidos cortos, limpia y deja en -14 LUFS (pico -1,5 dBTP).
# Uso: python3 scripts/editar_voz.py cruda.wav salida.wav lista-de-cortes.txt [quitar.txt]
#   quitar.txt (opcional): una línea por tramo a quitar de la voz cruda, "inicio fin motivo" en segundos.
#   FRASES=transcripcion.json (whisper.cpp de la voz cruda): las pausas tras punto, "?" o "!" quedan en
#   PAUSA_FRASE; todas las demás (comas, respiros, pausas leves) en PAUSA_COMA.
import subprocess, sys, re, wave
import numpy as np
import pyloudnorm as pyln
from scipy.ndimage import maximum_filter1d
from scipy.signal import resample_poly

cruda, salida, lista = sys.argv[1:4]
quitar = []
if len(sys.argv) > 4:
    for l in open(sys.argv[4], encoding='utf-8'):
        if l.strip() and not l.startswith('#'):
            a, b, *m = l.split(); quitar.append((float(a), float(b), ' '.join(m)))

SR = 48000
import os, json
PAUSA_FRASE = float(os.environ.get('PAUSA_FRASE', 0.13))  # silencio que queda entre frases
PAUSA_COMA = float(os.environ.get('PAUSA_COMA', 0.08))    # silencio que queda dentro de una frase
ANTES, DESPUES = 0.06, 0.05  # aire antes y después de cada tramo de voz (los arranques suaves necesitan más)
FUNDIDO = 0.018   # 18 ms

def leer(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, '<f4').astype(np.float64)

x = leer(cruda); dur = len(x) / SR
# 1) Tramos con voz (silencedetect)
log = subprocess.run(['ffmpeg', '-i', cruda, '-af', 'silencedetect=noise=-42dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
ini = [float(v) for v in re.findall(r'silence_start: ([\d.]+)', log)]
fin = [float(v) for v in re.findall(r'silence_end: ([\d.]+)', log)]
sil = list(zip(ini, fin + [dur] * (len(ini) - len(fin))))
voz, t = [], 0.0
for a, b in sil:
    if a > t: voz.append((t, a))
    t = b
if t < dur: voz.append((t, dur))
# 2) Quita los tramos marcados
def resta(tramos, a, b):
    out = []
    for s, e in tramos:
        if e <= a or s >= b: out.append((s, e))
        else:
            if s < a: out.append((s, a))
            if e > b: out.append((b, e))
    return [(s, e) for s, e in out if e - s > 0.04]
for a, b, _ in quitar: voz = resta(voz, a, b)
# 3) Fin de frase: el silencio más cercano después de cada palabra con . ? !
finales = []
if os.environ.get('FRASES'):
    for seg in json.load(open(os.environ['FRASES'], encoding='utf-8'))['transcription']:
        w = seg['text'].strip()
        if w and w[-1] in '.?!': finales.append(seg['offsets']['to'] / 1000)
def es_fin(a, b):
    return any(a - 0.6 <= t <= b + 0.3 for t in finales)
# 4) Une: cada tramo con su aire; la pausa queda en PAUSA_FRASE o PAUSA_COMA (nunca se alarga)
nf = int(FUNDIDO * SR)
salida_buf = np.zeros(0); mapa = []
fus = [[max(0, s - ANTES), min(dur, e + DESPUES)] for s, e in voz]
for i, (s, e) in enumerate(fus):
    if i:
        p_s, p_e = voz[i - 1][1], voz[i][0]  # silencio original entre los dos tramos
        objetivo = PAUSA_FRASE if es_fin(p_s, p_e) else PAUSA_COMA
        cortado = any(p_s <= a < p_e + 0.01 for a, _, _ in quitar)
        hueco = min(objetivo, p_e - p_s) if not cortado else objetivo
        relleno = hueco - ANTES - DESPUES
        if relleno < 0:  # pausa original más corta que el aire: se solapan, se recorta el aire
            s = max(s, fus[i - 1][1] + relleno) if False else s
        salida_buf = np.concatenate([salida_buf, np.zeros(max(0, int(relleno * SR)))])
        if relleno < 0:
            # quita del final lo que sobra para que la pausa no supere la original
            salida_buf = salida_buf[: len(salida_buf) + int(relleno * SR)]
    seg = x[int(s * SR):int(e * SR)].copy()
    rampa = np.linspace(0, 1, nf)
    seg[:nf] *= rampa; seg[-nf:] *= rampa[::-1]
    mapa.append((s, e, len(salida_buf) / SR))
    salida_buf = np.concatenate([salida_buf, seg])
# 5) Limpieza: graves que retumban, ruido de fondo, compresión suave
tmp = salida + '.tmp.wav'
pcm = (np.clip(salida_buf, -1, 1) * 32767).astype('<i2')
with wave.open(tmp, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
filtro = 'highpass=f=80,afftdn=nf=-50:nr=8,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=1'
y = leer_f = None
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', tmp, '-af', filtro, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
y = np.frombuffer(raw, '<f4').astype(np.float64)
import os; os.remove(tmp)
# 6) -14 LUFS con pico real (4x) por debajo de -1,5 dBTP
med = pyln.Meter(SR)
techo = 10 ** (-1.9 / 20)
def pico_real(v): return np.max(np.abs(resample_poly(v, 4, 1)))
def limitar(v, t=None):
    env = maximum_filter1d(np.abs(v), size=int(0.005 * SR))
    g = np.minimum(1.0, (t or techo) / np.maximum(env, 1e-9))
    a = np.exp(-1 / (0.06 * SR)); s = np.empty_like(g); k = 1.0
    for i in range(len(g) - 1, -1, -1): k = min(g[i], a * k + (1 - a) * g[i]); s[i] = k
    k = 1.0
    for i in range(len(g)): k = min(s[i], a * k + (1 - a) * s[i]); s[i] = k
    return v * s
for _ in range(5):
    y *= 10 ** ((-14 - med.integrated_loudness(y)) / 20)
    if pico_real(y) > techo: y = limitar(y * 0.999)
for _ in range(8):  # el último paso siempre es el limitador: el pico nunca pasa de -1,5 dBTP
    y *= 10 ** ((-14 - med.integrated_loudness(y)) / 20)
    if pico_real(y) > techo: y = limitar(y, techo * 0.94)  # margen: el pico real queda entre muestras
print(f'voz editada: {med.integrated_loudness(y):.2f} LUFS · pico real {20*np.log10(pico_real(y)):.2f} dBTP · {len(y)/SR:.3f} s (cruda {dur:.3f} s)')
pcm = (np.clip(y, -1, 1) * 32767).astype('<i2')
with wave.open(salida, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
# 7) Lista de cortes
def hms(s): return f'{int(s//60)}:{s%60:06.3f}'
with open(lista, 'w', encoding='utf-8') as f:
    f.write(f'Voz cruda: {dur:.3f} s  ->  voz editada: {len(y)/SR:.3f} s\n')
    f.write(f'Pausas: {PAUSA_FRASE:.2f} s entre frases, {PAUSA_COMA:.2f} s dentro de la frase · fundidos de {FUNDIDO*1000:.0f} ms\n\n')
    f.write('TRAMOS QUE QUEDARON (voz cruda -> voz editada)\n')
    for s, e, d in mapa:
        f.write(f'  cruda {hms(s)} - {hms(e)}  ->  editada {hms(d)} - {hms(d + e - s)}\n')
    f.write('\nLO QUE SE CORTÓ\n')
    prev = 0.0
    for s, e, _ in mapa:
        if s - prev > 0.005:
            motivo = next((m for a, b, m in quitar if a < s and b > prev), None)
            f.write(f'  cruda {hms(prev)} - {hms(s)}  ({s-prev:.2f} s)  {motivo or "pausa acortada"}\n')
        prev = e
    if dur - prev > 0.005: f.write(f'  cruda {hms(prev)} - {hms(dur)}  ({dur-prev:.2f} s)  silencio final\n')
print(lista)
