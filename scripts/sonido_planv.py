"""Sonido de la intro de plan v, generado con código (sin bancos de sonido).

Los momentos salen de src/planv/tiempos.ts (fotogramas a 30 fps).
Uso: python3 scripts/sonido_planv.py public/planv/intro-sfx-crudo.wav
"""
import sys
import wave

import numpy as np

SR = 48000
FPS = 30
DUR = 210 / FPS
T = dict(nombres=(4, 30, 56), brillo=62, logo=84, arma=104, etiqueta=118, sale=166, brillo2=156)
rng = np.random.default_rng(11)
n = int(SR * DUR)
out = np.zeros((n, 2))


def seg(f):
	return f / FPS


def poner(sig, t, vol=1.0, pan=0.0):
	i = int(t * SR)
	j = min(n, i + len(sig))
	if i >= n:
		return
	izq, der = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
	out[i:j, 0] += sig[: j - i] * vol * izq
	out[i:j, 1] += sig[: j - i] * vol * der


def env(largo, ataque=0.005, caida=0.2):
	t = np.arange(int(largo * SR)) / SR
	return np.minimum(1, t / max(ataque, 1e-4)) * np.exp(-t / caida)


def pasabajos(x, corte):
	a = np.exp(-2 * np.pi * corte / SR)
	y = np.zeros_like(x)
	acc = 0.0
	for k in range(len(x)):
		acc = (1 - a) * x[k] + a * acc
		y[k] = acc
	return y


def bombo(f0=120, f1=42, largo=0.5):
	t = np.arange(int(largo * SR)) / SR
	f = f1 + (f0 - f1) * np.exp(-t / 0.04)
	fase = 2 * np.pi * np.cumsum(f) / SR
	return np.tanh(2.2 * np.sin(fase)) * env(largo, 0.002, 0.16)


def pop(f=900, largo=0.08):
	t = np.arange(int(largo * SR)) / SR
	return np.sin(2 * np.pi * f * t * (1 - t * 3)) * env(largo, 0.001, 0.025)


def tic(largo=0.03):
	r = rng.standard_normal(int(largo * SR))
	return np.diff(np.concatenate([[0], r])) * env(largo, 0.0005, 0.006)


def whoosh(largo, sube=True):
	r = rng.standard_normal(int(largo * SR))
	t = np.linspace(0, 1, len(r))
	forma = t**2 if sube else (1 - t) ** 2
	return pasabajos(r, 900) * forma * 1.8 + pasabajos(r, 4000) * forma * 0.4


# sin cama musical: solo efectos (la música se agrega aparte)
# cada nombre: golpecito suave
for k, f in enumerate(T['nombres']):
	poner(pop(650 + k * 120, 0.07), seg(f + 2), 0.35, pan=-0.3 + k * 0.3)
	poner(tic(0.03), seg(f), 0.4, pan=-0.3 + k * 0.3)
# el brillo sube y golpea cuando aparece el logo
poner(whoosh(seg(T['logo'] - T['brillo'])), seg(T['brillo']), 0.6)
poner(bombo(100, 38, 0.9), seg(T['logo']), 1.0)
for k in range(4):
	poner(tic(), seg(T['logo'] + 4 + k * 4), 0.7, pan=-0.5 + k * 0.33)
# se arma con el nombre
poner(whoosh(0.35, sube=False), seg(T['arma']), 0.4)
for k in range(5):
	poner(tic(0.03), seg(T['arma'] + 4 + k * 3), 0.6, pan=0.1 + k * 0.08)
poner(pop(1800, 0.05), seg(T['arma'] + 19), 0.3)
# salida: subida suave y cola
poner(whoosh(seg(T['sale'] + 10 - T['brillo2'])), seg(T['brillo2']), 0.5)
poner(bombo(80, 32, 1.2), seg(T['sale'] + 10), 0.5)
out = np.tanh(out * 1.1)
out /= np.max(np.abs(out)) / 0.89
salida = sys.argv[1] if len(sys.argv) > 1 else 'intro-sfx-crudo.wav'
with wave.open(salida, 'wb') as w:
	w.setnchannels(2)
	w.setsampwidth(2)
	w.setframerate(SR)
	w.writeframes((out * 32767).astype(np.int16).tobytes())
print('listo', salida, round(DUR, 2), 's')
