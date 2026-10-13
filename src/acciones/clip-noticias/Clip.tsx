// Clip dinámico de 2 s: el periódico llega girando y aterriza justo en "noticias".
// Los tiempos son los del reel completo; <Sequence from={-INICIO}> los corre al inicio del clip.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, Columna, Dinamico, Escena, FUENTE, Fondo, Texto, pulsoBeat} from '../../robots/ui';
import {INICIO, en} from './tiempos';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const PAPEL = {ancho: 500, alto: 620};

// Portada del periódico: cabezote, titular en barras y una gráfica que ya subió (sin cifras).
const Periodico: React.FC<{brillo: number}> = ({brillo}) => {
	const barra = (ancho: number | string, alto: number, color = '#c9cfda') => (
		<div style={{width: ancho, height: alto, borderRadius: alto / 2, background: color}} />
	);
	return (
		<div
			style={{
				width: PAPEL.ancho,
				height: PAPEL.alto,
				borderRadius: 20,
				background: '#f4f6fa',
				boxShadow: `0 30px 60px rgba(0,0,0,0.7), 0 0 ${40 + 40 * brillo}px ${C.brillo}`,
				padding: '34px 38px',
				boxSizing: 'border-box',
				display: 'flex',
				flexDirection: 'column',
				gap: 18,
				fontFamily: FUENTE,
			}}
		>
			<div style={{fontWeight: 900, fontSize: 74, color: C.tinta, textAlign: 'center', letterSpacing: '-0.02em', lineHeight: 1}}>
				noticias
			</div>
			<div style={{borderTop: `5px solid ${C.tinta}`, borderBottom: `2px solid ${C.tinta}`, height: 6}} />
			{barra('100%', 30, C.tinta)}
			{barra('72%', 30, C.tinta)}
			<div style={{display: 'flex', gap: 22, marginTop: 8, flex: 1}}>
				<div
					style={{
						flex: 1.25,
						borderRadius: 14,
						background: C.tinta,
						position: 'relative',
						overflow: 'hidden',
					}}
				>
					<svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
						<path d="M8 80 L28 72 L42 76 L58 60 L74 44 L92 14" fill="none" stroke={C.azul} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{strokeWidth: 9}} />
					</svg>
					<svg viewBox="0 0 100 100" style={{position: 'absolute', right: 10, top: 8, width: 70, height: 70}}>
						<path d="M30 30 h40 v40 M70 30 L28 72" fill="none" stroke={C.azul} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
				<div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 4}}>
					{['100%', '90%', '100%', '80%', '100%', '94%', '70%', '100%', '86%'].map((w, i) => (
						<React.Fragment key={i}>{barra(w, 13)}</React.Fragment>
					))}
				</div>
			</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
				{barra('100%', 13)}
				{barra('92%', 13)}
			</div>
		</div>
	);
};

const Contenido: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const noticias = en('noticias');
	const arranca = INICIO - 4; // ya girando en el primer fotograma

	// Giro: arranca diminuto, da vueltas y frena justo en "noticias".
	const p = interpolate(frame, [arranca, noticias], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const giro = interpolate(p, [0, 1], [-1080, -4]);
	const escalaGiro = interpolate(p, [0, 1], [0.06, 1.06]);
	// Al aterrizar: se asienta con rebote desde 1,12 hasta 1.
	const asienta = spring({frame: frame - noticias, fps, config: {damping: 9, mass: 0.6, stiffness: 160}});
	const escala = frame < noticias ? escalaGiro : interpolate(asienta, [0, 1], [1.06, 1]);
	const flota = frame > noticias ? Math.sin((frame - noticias) / 8) * 6 : 0;
	const brillo = frame >= noticias ? Math.exp(-(frame - noticias) / 8) + 0.3 * pulsoBeat(frame) : 0;
	const desenfoque = interpolate(p, [0, 0.75, 1], [6, 2, 0]);

	return (
		<Escena desde={INICIO} hasta={INICIO + 9999} salida={false} golpes={[noticias]}>
			<Columna gap={80} style={{marginTop: -10}}>
				<Texto en={en('sale')} tam={92}>
					{'sale en las\n*noticias*…'}
				</Texto>
				<div style={{position: 'relative', width: PAPEL.ancho, height: PAPEL.alto}}>
					{/* onda de luz al aterrizar */}
					{frame >= noticias ? (
						<div
							style={{
								position: 'absolute',
								left: PAPEL.ancho / 2 - 380,
								top: PAPEL.alto / 2 - 380,
								width: 760,
								height: 760,
								borderRadius: '50%',
								border: `8px solid ${C.azul}`,
								boxShadow: `0 0 40px ${C.brillo}`,
								transform: `scale(${interpolate(frame, [noticias, noticias + 14], [0.5, 1.15], clamp)})`,
								opacity: interpolate(frame, [noticias, noticias + 14], [0.9, 0], clamp),
							}}
						/>
					) : null}
					{/* líneas de velocidad mientras gira */}
					{frame < noticias
						? Array.from({length: 10}).map((_, i) => {
								const ang = (i / 10) * 360 + frame * 9;
								return (
									<div
										key={i}
										style={{
											position: 'absolute',
											left: PAPEL.ancho / 2 - 3,
											top: PAPEL.alto / 2 - 3,
											width: 6,
											height: 120 + 60 * p,
											borderRadius: 3,
											background: C.azul,
											opacity: 0.45 * p,
											transformOrigin: '3px 3px',
											transform: `rotate(${ang}deg) translateY(${200 + 150 * p}px)`,
										}}
									/>
								);
							})
						: null}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							transform: `translateY(${flota}px) rotate(${giro}deg) scale(${escala})`,
							filter: desenfoque > 0.2 ? `blur(${desenfoque}px)` : undefined,
							opacity: interpolate(frame, [arranca, arranca + 3], [0, 1], clamp),
						}}
					>
						<Periodico brillo={brillo} />
					</div>
				</div>
			</Columna>
		</Escena>
	);
};

export const ClipNoticias: React.FC = () => (
	<Dinamico.Provider value>
		<AbsoluteFill style={{fontFamily: FUENTE}}>
			<Fondo />
			<Sequence from={-INICIO}>
				<Contenido />
			</Sequence>
		</AbsoluteFill>
	</Dinamico.Provider>
);
