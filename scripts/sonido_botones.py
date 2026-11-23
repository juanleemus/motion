"""Sonidos de las animaciones "suscribirse" y "me gusta" de plan v (fondo verde).

Los momentos salen de src/planv/Botones.tsx (fotogramas a 30 fps).
Uso: python3 scripts/sonido_botones.py public/planv/
"""
import sys
import wave

import numpy as np

SR = 48000
FPS = 30
rng = np.random.default_rng(5)


def seg(f):
	return f / FPS


def env(largo, ataque=0.005, caida=0.2):
	t = np.arange(int(largo * SR)) / SR
	return np.minimum(1, t / max(ataque, 1e-4)) * np.exp(-t / caida)


def pop(f=900, largo=0.08):
	t = np.arange(int(largo * SR)) / SR
	return np.sin(2 * np.pi * f * t * (1 - t * 3)) * env(largo, 0.001, 0.025)


def clic(largo=0.04):
	# clic de mouse: ruido muy corto con un golpecito agudo
	r = rng.standard_normal(int(largo * SR))
	t = np.arange(len(r)) / SR
	return (np.diff(np.concatenate([[0], r])) * 0.6 + np.sin(2 * np.pi * 3200 * t)) * env(largo, 0.0003, 0.005)


def campanita(f=1568, largo=1.2):
	t = np.arange(int(largo * SR)) / SR
	tono = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t / (0.5 / m)) for m, a in [(1, 1.0), (2.76, 0.4), (5.4, 0.2)])
	return tono * np.minimum(1, t / 0.002)


def whoosh(largo):
	r = rng.standard_normal(int(largo * SR))
	t = np.linspace(0, 1, len(r))
	suave = np.convolve(r, np.ones(40) / 40, mode='same')
	return suave * np.sin(np.pi * t) ** 2 * 2.5


def armar(dur_frames, eventos, salida):
	n = int(SR * dur_frames / FPS)
	out = np.zeros((n, 2))
	for sig, f, vol, pan in eventos:
		i = int(seg(f) * SR)
		j = min(n, i + len(sig))
		izq, der = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
		out[i:j, 0] += sig[: j - i] * vol * izq
		out[i:j, 1] += sig[: j - i] * vol * der
	out = np.tanh(out * 1.1)
	out /= np.max(np.abs(out)) / 0.89
	with wave.open(salida, 'wb') as w:
		w.setnchannels(2)
		w.setsampwidth(2)
		w.setframerate(SR)
		w.writeframes((out * 32767).astype(np.int16).tobytes())
	print('listo', salida)


carpeta = sys.argv[1] if len(sys.argv) > 1 else '.'
# suscribirse: entra (4), clic (46), campana (58), sale (104)
armar(120, [
	(whoosh(0.3), 1, 0.5, 0),
	(pop(700, 0.08), 6, 0.6, 0),
	(clic(), 46, 1.0, 0.2),
	(pop(1100, 0.06), 48, 0.5, 0.2),
	(campanita(1568), 58, 0.55, 0.5),
	(campanita(2093, 0.9), 62, 0.3, 0.5),
	(whoosh(0.3), 103, 0.45, 0),
], f'{carpeta}/sfx-suscribir-crudo.wav')
# me gusta: entra (4), clic (42), chispas, sale (76)
armar(90, [
	(whoosh(0.3), 1, 0.5, 0),
	(pop(700, 0.08), 6, 0.6, 0),
	(clic(), 42, 1.0, -0.2),
	(pop(900, 0.09), 43, 0.7, -0.2),
	*[(pop(1800 + k * 250, 0.04), 45 + k * 2, 0.25, -0.6 + k * 0.3) for k in range(5)],
	(whoosh(0.3), 75, 0.45, 0),
], f'{carpeta}/sfx-like-crudo.wav')
