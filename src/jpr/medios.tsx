// Ícono 3D, capturas de pantalla y sello JPR.
import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLOR, FUENTE, SOMBRA_CAPTURA} from './marca';
import {Glifo} from './iconos';
import {ICONOS_3D, SIMBOLO_JPR} from './kit';

// Ícono 3D: cae desde 120 px más arriba con rebote (damping 12, masa 0,6, rigidez 160) y luego flota ±6 px.
// Usa el archivo del kit; mientras no llega, muestra el glifo plano de marca en un cuadro lima.
export const Icono3D: React.FC<{desde: number; nombre: keyof typeof ICONOS_3D; x: number; y: number; tam?: number}> = ({desde, nombre, x, y, tam = 260}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	if (frame < desde) return null;
	const caida = spring({frame: frame - desde, fps, config: {damping: 12, mass: 0.6, stiffness: 160}});
	const flota = Math.sin((frame - desde) / 14) * 6 * interpolate(frame - desde, [10, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const dy = (1 - caida) * -120 + flota;
	const archivo = ICONOS_3D[nombre];
	return (
		<div
			style={{
				position: 'absolute',
				left: x - tam / 2,
				top: y - tam / 2 + dy,
				width: tam,
				height: tam,
				opacity: interpolate(frame - desde, [0, 3], [0, 1], {extrapolateRight: 'clamp'}),
			}}
		>
			{archivo ? (
				<Img src={staticFile(archivo)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
			) : (
				<div
					style={{
						width: '100%',
						height: '100%',
						borderRadius: tam * 0.26,
						background: COLOR.lima,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: `0 ${tam * 0.1}px ${tam * 0.2}px rgba(10,31,68,0.35)`,
					}}
				>
					<Glifo nombre={nombre === 'union' ? 'union' : nombre} color={COLOR.medianoche} tam={tam * 0.62} grosor={7} />
				</div>
			)}
		</div>
	);
};

// Captura o grabación de pantalla: siempre con acercamiento lento (1→1,08) o desplazamiento.
// sombra: cuando flota sobre fondo oscuro.
export const Captura: React.FC<{
	desde: number;
	hasta: number;
	x: number;
	y: number;
	ancho: number;
	alto: number;
	src?: string;
	movimiento?: 'acercamiento' | 'desplazamiento';
	sombra?: boolean;
	children?: React.ReactNode;
}> = ({desde, hasta, x, y, ancho, alto, src, movimiento = 'acercamiento', sombra = true, children}) => {
	const frame = useCurrentFrame();
	if (frame < desde) return null;
	const p = interpolate(frame, [desde, hasta], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const mover = movimiento === 'acercamiento' ? `scale(${1 + 0.08 * p})` : `translateY(${-p * alto * 0.25}px)`;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: ancho, height: alto, borderRadius: 24, overflow: 'hidden', boxShadow: sombra ? SOMBRA_CAPTURA : 'none'}}>
			<div style={{width: '100%', height: movimiento === 'desplazamiento' ? '125%' : '100%', transform: mover, transformOrigin: '50% 40%'}}>
				{src ? <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : children}
			</div>
		</div>
	);
};

// Sello: símbolo JPR en un cuadro lima redondeado, pequeño. Solo en el primer plano B y en el cierre.
export const Sello: React.FC<{desde: number; x: number; y: number; tam?: number}> = ({desde, x, y, tam = 104}) => {
	const frame = useCurrentFrame();
	if (frame < desde) return null;
	const e = interpolate(frame - desde, [0, 5, 8], [0.6, 1.1, 1], {extrapolateRight: 'clamp'});
	return (
		<div
			style={{
				position: 'absolute',
				left: x - tam / 2,
				top: y - tam / 2,
				width: tam,
				height: tam,
				borderRadius: tam * 0.24,
				background: COLOR.lima,
				transform: `scale(${e})`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				boxShadow: '0 8px 24px rgba(10,31,68,0.4)',
			}}
		>
			{SIMBOLO_JPR ? (
				<Img src={staticFile(SIMBOLO_JPR)} style={{width: '72%', height: '72%', objectFit: 'contain'}} />
			) : (
				<span style={{fontFamily: FUENTE, fontWeight: 900, fontSize: tam * 0.34, color: COLOR.medianoche, letterSpacing: -1}}>JPR</span>
			)}
		</div>
	);
};
