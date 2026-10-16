# Prueba del alineador: voz "real" = otra voz sintética con tiempos conocidos.
import subprocess, tempfile, os, json, re, numpy as np, librosa
SR, HOP = 16000, 160
frase = "porque Meta acaba de empezar a bloquear cuentas sin previo aviso pagar pauta en Meta para crecer tu cuenta o tu tienda en TikTok era la estrategia de todos".split()
tmp = tempfile.mkdtemp()
def s(w, v, sp):
    f = os.path.join(tmp, 'x.wav'); subprocess.run(['espeak-ng', '-v', v, '-s', str(sp), '-p', '30' if '+' in v else '50', '-w', f, w], check=True)
    x, _ = librosa.load(f, sr=SR); return librosa.effects.trim(x, top_db=30)[0]
rng = np.random.default_rng(1)
real, verdad = [], []
t = 0
for w in frase:
    x = s(w, 'es+m3', int(rng.uniform(140, 200)))
    x = librosa.effects.pitch_shift(x, sr=SR, n_steps=-3)
    verdad.append(t / SR); real.append(x); t += len(x)
real = np.concatenate(real) + rng.standard_normal(t) * 0.003
def feats(x):
    m = librosa.feature.mfcc(y=x, sr=SR, n_mfcc=20, hop_length=HOP, n_fft=400)[1:]
    return (m - m.mean(1, keepdims=True)) / (m.std(1, keepdims=True) + 1e-6)
piezas = [s(w, 'es-419', 190) for w in frase]
bordes = np.cumsum([0] + [len(p) for p in piezas]) / HOP
D, wp = librosa.sequence.dtw(feats(np.concatenate(piezas)), feats(real), metric='cosine',
    step_sizes_sigma=np.array([[1,1],[0,1],[1,0],[1,2],[2,1]]), weights_add=np.array([0,0.2,0.2,0,0]))
wp = wp[::-1]
est = [wp[min(np.searchsorted(wp[:,0], b), len(wp)-1), 1] * HOP / SR for b in bordes[:-1]]
# alineación por sílabas (proporcional) como comparación
def sil(p):
    n, prev = 0, None
    for ch in p.lower():
        if ch in 'aeiouáéíóú':
            if prev is None or (prev in 'aeoáéó' and ch in 'aeoáéó'): n += 1
            prev = ch
        else: prev = None
    return max(1, n)
c = np.cumsum([0] + [sil(w) for w in frase]); dur = t / SR
prop = [dur * c[i] / c[-1] for i in range(len(frase))]
e1 = np.abs(np.array(est) - verdad); e2 = np.abs(np.array(prop) - verdad)
print(f'DTW: error medio {e1.mean()*1000:.0f} ms, máx {e1.max()*1000:.0f} ms | sílabas: medio {e2.mean()*1000:.0f} ms, máx {e2.max()*1000:.0f} ms')
