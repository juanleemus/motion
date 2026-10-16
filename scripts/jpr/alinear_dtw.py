# Alineación acústica sin modelo de reconocimiento:
# cada frase del guion se lee con una voz sintética (espeak-ng, español) palabra por palabra,
# y se compara su sonido (MFCC) con el tramo real por DTW para ubicar el inicio y fin de cada palabra.
# Uso: python3 alinear_dtw.py voz16k.wav palabras-silabas.json salida.json
import json, subprocess, sys, tempfile, os, re
import numpy as np, librosa

wav, base, salida = sys.argv[1:4]
SR, HOP = 16000, 160
y, _ = librosa.load(wav, sr=SR)
pal = json.load(open(base, encoding='utf-8'))
LECT = {'Facebook': 'feisbuk', 'Instagram': 'instagram', 'Meta': 'meta', 'TikTok': 'tiktok', 'ByteDance': 'baitdans',
        'buyer': 'bayer', 'media': 'midia', 'Mándale': 'mándale'}
tmp = tempfile.mkdtemp()
cache = {}
def synth(w):
    k = re.sub(r'[^\wáéíóúñü]', '', w)
    k = LECT.get(k, k).lower()
    if k in cache: return cache[k]
    f = os.path.join(tmp, f'{len(cache)}.wav')
    subprocess.run(['espeak-ng', '-v', 'es-419', '-s', '190', '-w', f, k], check=True)
    s, _ = librosa.load(f, sr=SR)
    s, _ = librosa.effects.trim(s, top_db=30)
    cache[k] = s; return s
def feats(x):
    m = librosa.feature.mfcc(y=x, sr=SR, n_mfcc=20, hop_length=HOP, n_fft=400)[1:]
    m = (m - m.mean(1, keepdims=True)) / (m.std(1, keepdims=True) + 1e-6)
    return m

# grupos: palabras contiguas cuyo tramo de voz es continuo (sin pausa entre ellas)
grupos, g = [], [0]
for i in range(1, len(pal)):
    if pal[i]['t0'] - pal[i - 1]['t1'] > 0.05: grupos.append(g); g = [i]
    else: g.append(i)
grupos.append(g)
res = [dict(p) for p in pal]
for g in grupos:
    a, b = pal[g[0]]['t0'], pal[g[-1]]['t1']
    seg = y[int(a * SR):int(b * SR)]
    piezas = [synth(pal[i]['w']) for i in g]
    bordes = np.cumsum([0] + [len(p) for p in piezas]) / HOP
    sint = np.concatenate(piezas)
    X, Y = feats(sint), feats(seg)
    D, wp = librosa.sequence.dtw(X, Y, metric='cosine', step_sizes_sigma=np.array([[1, 1], [0, 1], [1, 0], [1, 2], [2, 1]]),
                                 weights_add=np.array([0, 0.2, 0.2, 0, 0]))
    wp = wp[::-1]
    def mapa(fx):  # fotograma sintético -> fotograma real
        idx = np.searchsorted(wp[:, 0], fx)
        idx = min(idx, len(wp) - 1)
        return wp[idx, 1]
    for k, i in enumerate(g):
        t0 = a + mapa(bordes[k]) * HOP / SR
        t1 = a + mapa(bordes[k + 1]) * HOP / SR if k < len(g) - 1 else b
        res[i]['t0'], res[i]['t1'] = round(t0, 2), round(max(t1, t0 + 0.06), 2)
# encadenar: cada palabra termina donde empieza la siguiente si están en el mismo grupo
for g in grupos:
    for k in range(len(g) - 1):
        res[g[k]]['t1'] = res[g[k + 1]]['t0']
json.dump(res, open(salida, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
dif = [abs(r['t0'] - p['t0']) for r, p in zip(res, pal)]
print(f'{len(grupos)} grupos; diferencia media con el alineador por sílabas {np.mean(dif):.2f}s, máx {max(dif):.2f}s')
