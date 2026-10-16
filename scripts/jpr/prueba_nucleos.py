import sys, subprocess, tempfile, os, warnings, numpy as np, librosa
warnings.filterwarnings('ignore'); sys.path.insert(0, os.path.dirname(__file__))
from nucleos import ajustar, silabas_de
SR = 16000
frases = ["porque Meta acaba de empezar a bloquear cuentas sin previo aviso",
          "pagar pauta en Meta para crecer tu cuenta o tu tienda en TikTok era la estrategia de todos",
          "Meta le declaró la guerra a ByteDance en siete mercados clave incluido Estados Unidos"]
tmp = tempfile.mkdtemp(); rng = np.random.default_rng(3)
e_n, e_p = [], []
for fr in frases:
    ws = fr.split(); real = []; verdad = []; t = 0
    for w in ws:
        f = os.path.join(tmp, 'x.wav')
        subprocess.run(['espeak-ng', '-v', rng.choice(['es+m3', 'es-419+m2', 'es+f2']), '-s', str(int(rng.uniform(150, 230))), '-w', f, w], check=True)
        x, _ = librosa.load(f, sr=SR); x = librosa.effects.trim(x, top_db=30)[0]
        verdad.append(t / SR); real.append(x); t += len(x)
    y = np.concatenate(real) + rng.standard_normal(t) * 0.002
    b = t / SR; s = np.cumsum([0] + [silabas_de(w) for w in ws])
    pal = [{'w': w, 't0': b * s[i] / s[-1], 't1': 0} for i, w in enumerate(ws)]
    prop = [p['t0'] for p in pal]
    pal = ajustar(pal, [(list(range(len(ws))), 0.0, b)], y)
    e_n += list(np.abs(np.array([p['t0'] for p in pal]) - verdad)); e_p += list(np.abs(np.array(prop) - verdad))
print(f'núcleos: medio {np.mean(e_n)*1000:.0f} ms, máx {np.max(e_n)*1000:.0f} ms | sílabas: medio {np.mean(e_p)*1000:.0f} ms, máx {np.max(e_p)*1000:.0f} ms')
