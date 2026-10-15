// Gráficos animados: barra, alerta, pastillas, recuadro, resaltador y diagrama de nodos.
// Todos reciben el fotograma de entrada (desde) calculado con en('frase', n).
import React from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {COLOR, FUENTE, TAM} from './marca';
import {Glifo} from './iconos';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Barra de progreso: píldora 460×18, se llena de forma continua entre dos palabras.
export const Barra: React.FC<{desde: number; hasta: number; x: number; y: number}> = ({desde, hasta, x, y}) => {
	const frame = useCurrentFrame();
	if (frame < desde) return null;
	const p = interpolate(frame, [desde, hasta], [0, 1], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				left: x - 230,
				top: y - 9,
				width: 460,
				height: 18,
				borderRadius: 9,
				background: COLOR.medianoche,
				border: `2px solid ${COLOR.electrico}`,
				boxSizing: 'border-box',
				overflow: 'hidden',
				opacity: interpolate(frame, [desde, desde + 3], [0, 1], clamp),
			}}
		>
			<div style={{width: `${p * 100}%`, height: '100%', borderRadius: 9, background: COLOR.lima}} />
		</div>
	);
};

// Ícono de alerta: triángulo lima, escala 0 → 1,25 → 1 en 9 fotogramas.
export const Alerta: React.FC<{desde: number; x: number; y: number; tam?: number}> = ({desde, x, y, tam = 64}) => {
	const frame = useCurrentFrame();
	if (frame < desde) return null;
	const e = interpolate(frame - desde, [0, 6, 9], [0, 1.25, 1], {...clamp, easing: Easing.out(Easing.quad)});
	return (
		<svg viewBox="0 0 100 100" width={tam} height={tam} style={{position: 'absolute', left: x - tam / 2, top: y - tam / 2, transform: `scale(${e})`}}>
			<path d="M50 8 L94 88 H6 Z" fill={COLOR.lima} stroke={COLOR.lima} strokeWidth={8} strokeLinejoin="round" />
			<path d="M50 36 V60" stroke={COLOR.medianoche} strokeWidth={10} strokeLinecap="round" />
			<circle cx={50} cy={75} r={6} fill={COLOR.medianoche} />
		</svg>
	);
};

// Tarjetas tipo pastilla: una por palabra, apiladas hacia abajo con 24 px de separación.
const ALTO_PASTILLA = 104;
export const Pastillas: React.FC<{items: {texto: string; desde: number}[]; x: number; y: number}> = ({items, x, y}) => {
	const frame = useCurrentFrame();
	return (
		<>
			{items.map((it, i) => {
				if (frame < it.desde) return null;
				const t = frame - it.desde;
				const e = interpolate(t, [0, 4, 7], [0.6, 1.12, 1], clamp);
				const blur = interpolate(t, [0, 4], [8, 0], clamp);
				const giro = (i % 2 === 0 ? -1 : 1) * (2.5 + (i % 3) * 0.7); // entre −4° y +4°, alternando
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y + i * (ALTO_PASTILLA + 24),
							transform: `translateX(-50%) rotate(${giro}deg) scale(${e})`,
							filter: `blur(${blur}px)`,
							opacity: interpolate(t, [0, 2], [0, 1], clamp),
							height: ALTO_PASTILLA,
							display: 'flex',
							alignItems: 'center',
							gap: 22,
							padding: '0 44px 0 22px',
							borderRadius: 999,
							background: COLOR.medianoche,
							border: `4px solid ${COLOR.electrico}`,
							boxShadow: '0 14px 34px rgba(0,0,0,0.35)',
							whiteSpace: 'nowrap',
						}}
					>
						<div style={{width: 64, height: 64, borderRadius: 32, background: COLOR.lima, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<Glifo nombre="check" color={COLOR.medianoche} tam={44} grosor={12} />
						</div>
						<span style={{fontFamily: FUENTE, fontWeight: 700, fontSize: TAM.pastilla, color: COLOR.blanco}}>{it.texto}</span>
					</div>
				);
			})}
		</>
	);
};

// Recuadro de señalamiento: borde lima de 4 px que se dibuja en 10 fotogramas.
export const Recuadro: React.FC<{desde: number; x: number; y: number; ancho: number; alto: number; radio?: number}> = ({
	desde,
	x,
	y,
	ancho,
	alto,
	radio = 22,
}) => {
	const frame = useCurrentFrame();
	if (frame < desde) return null;
	const p = interpolate(frame - desde, [0, 10], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	return (
		<svg width={ancho + 8} height={alto + 8} style={{position: 'absolute', left: x - 4, top: y - 4, overflow: 'visible'}}>
			<rect x={4} y={4} width={ancho} height={alto} rx={radio} fill="none" stroke={COLOR.lima} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
		</svg>
	);
};

// Resaltador: barra lima al 35 % que barre detrás de una frase en 12 fotogramas (va antes del texto).
export const Resaltador: React.FC<{desde: number; x: number; y: number; ancho: number; alto: number}> = ({desde, x, y, ancho, alto}) => {
	const frame = useCurrentFrame();
	if (frame < desde) return null;
	const p = interpolate(frame - desde, [0, 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	return <div style={{position: 'absolute', left: x, top: y, width: ancho * p, height: alto, background: COLOR.lima35, borderRadius: 10}} />;
};

// Diagrama de nodos: nodo central con borde lima y líneas eléctricas en cascada (3 fotogramas entre línea y línea)
// hacia los satélites (logos del kit, o su nombre literal del guion mientras llegan), con puntos que viajan.
export type ContenidoNodo = {glifo?: Glifo; texto?: string; logo?: string | null};
export type Satelite = ContenidoNodo & {x: number; y: number; desde?: number};

const Nodo: React.FC<{x: number; y: number; r: number; c: ContenidoNodo; borde: string; e: number; grosor: number}> = ({x, y, r, c, borde, e, grosor}) => (
	<div
		style={{
			position: 'absolute',
			left: x - r,
			top: y - r,
			width: r * 2,
			height: r * 2,
			borderRadius: r,
			background: COLOR.medianoche,
			border: `${grosor}px solid ${borde}`,
			boxSizing: 'border-box',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			transform: `scale(${e})`,
			boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
			overflow: 'hidden',
		}}
	>
		{c.logo ? (
			<Img src={staticFile(c.logo)} style={{width: '68%', height: '68%', objectFit: 'contain'}} />
		) : c.glifo ? (
			<Glifo nombre={c.glifo} color={borde === COLOR.lima ? COLOR.lima : COLOR.blanco} tam={r * 1.1} />
		) : c.texto ? (
			<span style={{fontFamily: FUENTE, fontWeight: 700, fontSize: Math.min(42, (r * 1.55) / (c.texto.length * 0.62)), color: COLOR.blanco, whiteSpace: 'nowrap'}}>
				{c.texto}
			</span>
		) : null}
	</div>
);

export const Nodos: React.FC<{
	desde: number;
	centro: ContenidoNodo & {x: number; y: number; r?: number};
	satelites: Satelite[];
	r?: number;
	idaYVuelta?: boolean;
}> = ({desde, centro, satelites, r = 78, idaYVuelta}) => {
	const frame = useCurrentFrame();
	if (frame < desde) return null;
	const rc = centro.r ?? 96;
	const ec = desde <= 0 ? 1 : interpolate(frame - desde, [0, 5, 8], [0.6, 1.1, 1], clamp);
	const inicio = (s: Satelite, i: number) => s.desde ?? desde + 3 * i;
	return (
		<>
			<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				{satelites.map((s, i) => {
					const t = frame - inicio(s, i);
					if (t < 0) return null;
					const p = interpolate(t, [0, 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
					const puntos = p < 1 ? [] : idaYVuelta ? [(t % 36) / 36, 1 - ((t + 18) % 36) / 36] : [(t % 30) / 30, ((t + 15) % 30) / 30];
					return (
						<g key={i}>
							<line x1={centro.x} y1={centro.y} x2={centro.x + (s.x - centro.x) * p} y2={centro.y + (s.y - centro.y) * p} stroke={COLOR.electrico} strokeWidth={5} strokeLinecap="round" />
							{puntos.map((q, k) => (
								<circle key={k} cx={centro.x + (s.x - centro.x) * q} cy={centro.y + (s.y - centro.y) * q} r={8} fill={COLOR.lima} />
							))}
						</g>
					);
				})}
			</svg>
			{satelites.map((s, i) => {
				const t = frame - inicio(s, i);
				if (t < 0) return null;
				const e = inicio(s, i) <= 0 ? 1 : interpolate(t, [4, 9, 12], [0.6, 1.1, 1], clamp);
				return t < 4 && inicio(s, i) > 0 ? null : <Nodo key={i} x={s.x} y={s.y} r={r} c={s} borde={COLOR.electrico} e={e} grosor={4} />;
			})}
			<Nodo x={centro.x} y={centro.y} r={rc} c={centro} borde={COLOR.lima} e={ec} grosor={6} />
		</>
	);
};
