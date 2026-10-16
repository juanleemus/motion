# Ajuste fino por núcleos silábicos: el español es silábico; cada vocal deja un pico de energía.
# Se detectan los picos en cada tramo de voz y se emparejan (DTW monotónico) con las sílabas del guion.
# La palabra empieza un poco antes del pico de su primera sílaba.
import numpy as np, re, librosa
from scipy.signal import butter, sosfiltfilt, find_peaks
SR = 16000
def silabas_de(pal):
    p = re.sub(r'[^a-záéíóúüñ]', '', pal.lower())
    p = {'facebook': 'feisbuk', 'bytedance': 'baitdans', 'buyer': 'bayer', 'tiktok': 'tiktok', 'media': 'media'}.get(p, p)
    n, prev = 0, None
    for ch in p:
        if ch in 'aeiouáéíóúü':
            if prev is None or (prev in 'aeoáéíóú' and ch in 'aeoáéó'): n += 1
            prev = ch
        else: prev = None
    return max(1, n)
def envolvente(y):
    yb = sosfiltfilt(butter(4, [300, 2200], 'band', fs=SR, output='sos'), y)
    hop = SR // 200  # 5 ms
    e = np.sqrt(np.convolve(yb ** 2, np.ones(hop * 8) / (hop * 8), 'same')[::hop])
    return 20 * np.log10(e + 1e-6), hop / SR
def picos(env, dt, a, b):
    i0, i1 = int(a / dt), int(b / dt)
    seg = env[i0:i1]
    if len(seg) < 5: return np.array([(a + b) / 2])
    pk, _ = find_peaks(seg, prominence=2.0, distance=int(0.075 / dt), height=seg.max() - 25)
    return (pk + i0) * dt
def ajustar(palabras, tramos, y):
    """palabras: [{'w','t0','t1'}] ya repartidas por tramo; tramos: grupos de índices con (a, b)."""
    env, dt = envolvente(y)
    for idx, a, b in tramos:
        s = [silabas_de(palabras[i]['w']) for i in idx]
        S = int(sum(s)); P = picos(env, dt, a, b)
        # posición esperada de cada sílaba (proporcional) para regularizar
        esp = a + (np.arange(S) + 0.5) / S * (b - a)
        # DTW monotónico sílaba->pico (cada sílaba a un pico, picos se pueden saltar o compartir)
        n, m = S, len(P)
        C = np.abs(esp[:, None] - P[None, :]) * 2.0
        F = np.full((n, m), np.inf); B = np.zeros((n, m), int)
        F[0] = C[0]
        for i in range(1, n):
            best = np.minimum.accumulate(F[i - 1])  # j' <= j
            arg = np.zeros(m, int); cur = 0
            for j in range(m):
                if F[i - 1, j] <= F[i - 1, cur]: cur = j
                arg[j] = cur
            # preferir picos distintos: compartir pico cuesta
            share = F[i - 1] + 0.35
            nueva = np.concatenate([[np.inf], best[:-1]])
            F[i] = C[i] + np.minimum(nueva, share)
            B[i] = np.where(nueva <= share, np.concatenate([[0], arg[:-1]]), np.arange(m))
        j = int(np.argmin(F[-1])); asign = [0] * n
        for i in range(n - 1, -1, -1):
            asign[i] = j; j = B[i, j] if i > 0 else j
        tsil = P[asign]
        k = 0
        for q, i in enumerate(idx):
            t_pico = tsil[k]
            t0 = a if q == 0 else max(t_pico - 0.09, palabras[idx[q - 1]]['t0'] + 0.08)
            palabras[i]['t0'] = round(float(t0), 2)
            k += s[q]
        for q, i in enumerate(idx):
            palabras[i]['t1'] = palabras[idx[q + 1]]['t0'] if q < len(idx) - 1 else round(b, 2)
    return palabras
