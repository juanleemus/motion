// Planos (A, S, B), fondos de marca y encuadre del presentador.
import React, {createContext, useContext} from 'react';
import {AbsoluteFill, OffthreadVideo, random, staticFile, useCurrentFrame} from 'remotion';
import {COLOR, FUENTE_CUERPO, LIENZO, UNION_S} from './marca';
import {CLIP_PRESENTADOR} from './kit';

// transparente: el área de Juan Pablo queda vacía (para el .mov con canal alfa).
// criticos: solo se dibuja lo importante (textos, gráficos); sirve para revisar las zonas seguras.
export const Modo = createContext({transparente: false, criticos: false});
export const useModo = () => useContext(Modo);

import type {TipoFondo, TipoPlano} from './escenas.ts';
export type {TipoFondo, TipoPlano};

export const FondoOscuro: React.FC<{alto?: number}> = ({alto = LIENZO.alto}) => {
	const frame = useCurrentFrame();
	if (useModo().criticos) return null;
	const particulas = Array.from({length: 46}, (_, i) => {
		const x = random(`px${i}`) * LIENZO.ancho;
		const vel = 0.25 + random(`pv${i}`) * 0.5;
		const y = (((random(`py${i}`) * alto - frame * vel) % alto) + alto) % alto;
		const r = 1.5 + random(`pr${i}`) * 2.5;
		const o = 0.25 + random(`po${i}`) * 0.45;
		return <circle key={i} cx={x} cy={y} r={r} fill={COLOR.electrico} opacity={o} />;
	});
	const diagonales = Array.from({length: 7}, (_, i) => {
		const x = -600 + i * 330 + ((frame * 0.6) % 330);
		return <line key={i} x1={x} y1={alto} x2={x + alto * 0.7} y2={0} stroke={COLOR.electrico} strokeWidth={i % 3 === 0 ? 2 : 1} opacity={0.16} />;
	});
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(ellipse 75% 45% at 100% 0%, ${COLOR.electrico} 0%, rgba(47,95,255,0.55) 35%, rgba(47,95,255,0) 75%), radial-gradient(ellipse 60% 35% at 0% 100%, rgba(47,95,255,0.75) 0%, rgba(47,95,255,0) 80%), ${COLOR.medianoche}`,
			}}
		>
			<svg width={LIENZO.ancho} height={alto} style={{position: 'absolute', inset: 0}}>
				{diagonales}
				{particulas}
			</svg>
		</AbsoluteFill>
	);
};

export const FondoClaro: React.FC = () => {
	if (useModo().criticos) return null;
	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(ellipse 85% 75% at 50% 45%, ${COLOR.blanco} 55%, rgba(47,95,255,0.13) 100%), ${COLOR.blanco}`,
			}}
		/>
	);
};

// Encuadre del clip de Juan Pablo. Plano A: pantalla completa; S: mitad de abajo, más abierto.
// zoom: acercamiento de golpe del 12 % (sin animación) en las frases de impacto.
export const Presentador: React.FC<{encuadre: 'A' | 'S'; zoom?: boolean}> = ({encuadre, zoom}) => {
	const {transparente, criticos} = useModo();
	if (transparente || criticos) return null;
	const escala = zoom ? 1.12 : 1;
	const estilo: React.CSSProperties = {width: '100%', height: '100%', transform: `scale(${escala})`, transformOrigin: '50% 30%'};
	if (CLIP_PRESENTADOR) {
		return (
			<AbsoluteFill style={{overflow: 'hidden'}}>
				<OffthreadVideo src={staticFile(CLIP_PRESENTADOR)} muted style={{...estilo, objectFit: 'cover', objectPosition: encuadre === 'S' ? '50% 20%' : '50% 35%'}} />
			</AbsoluteFill>
		);
	}
	// Provisional: el editor del cliente pone aquí el video de Juan Pablo.
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: COLOR.medianoche}}>
			<AbsoluteFill style={{...estilo, background: 'linear-gradient(180deg, #1a3366 0%, #0d2552 55%, #081733 100%)'}}>
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: encuadre === 'S' ? '42%' : '30%',
						transform: 'translate(-50%,-50%)',
						fontFamily: FUENTE_CUERPO,
						fontWeight: 600,
						fontSize: 30,
						letterSpacing: 4,
						color: 'rgba(255,255,255,0.28)',
						whiteSpace: 'nowrap',
					}}
				>
					VIDEO DE JUAN PABLO {encuadre === 'S' ? '· ABIERTO' : ''}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// Plano: A = Juan Pablo completo; S = apoyo arriba (hasta y 920) y Juan Pablo abajo; B = apoyo completo.
// El apoyo (children) se dibuja en coordenadas del lienzo; en S queda recortado a la mitad de arriba.
export const Plano: React.FC<{tipo: TipoPlano; fondo?: TipoFondo; zoom?: boolean; children?: React.ReactNode}> = ({
	tipo,
	fondo = 'oscuro',
	zoom,
	children,
}) => {
	const Fondo = fondo === 'claro' ? FondoClaro : FondoOscuro;
	if (tipo === 'A') return <Presentador encuadre="A" zoom={zoom} />;
	if (tipo === 'B')
		return (
			<AbsoluteFill>
				<Fondo />
				{children}
			</AbsoluteFill>
		);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 0, top: UNION_S, width: LIENZO.ancho, height: LIENZO.alto - UNION_S}}>
				<Presentador encuadre="S" />
			</div>
			<div style={{position: 'absolute', left: 0, top: 0, width: LIENZO.ancho, height: UNION_S, overflow: 'hidden'}}>
				<Fondo />
				{children}
			</div>
		</AbsoluteFill>
	);
};
