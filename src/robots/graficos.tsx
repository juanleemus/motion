// Piezas de la biblioteca frase → animación: círculos numerados, gráfica que se dispara,
// medidor de ánimo y figuras que convergen al mismo punto.
import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FUENTE, SOMBRA, aparece, pulsoBeat} from './ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- Fila de círculos (1-2-3-4 o ✓) que se encienden ----------
export const Circulos: React.FC<{
	en: number;
	cantidad?: number;
	paso?: number;
	tam?: number;
	enciende?: (number | undefined)[]; // fotograma en que se enciende cada círculo
	marca?: 'numero' | 'check';
}> = ({en, cantidad = 4, paso = 3, tam = 130, enciende = [], marca = 'numero'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div style={{display: 'flex', gap: tam * 0.32}}>
			{Array.from({length: cantidad}).map((_, i) => {
				const r = spring({frame: frame - (en + i * paso), fps, config: {damping: 11, mass: 0.5, stiffness: 150}});
				const e = enciende[i];
				const on = e !== undefined && frame >= e;
				const pop = on ? spring({frame: frame - e, fps, config: {damping: 8, mass: 0.5, stiffness: 180}}) : 0;
				const rayos = on ? interpolate(frame, [e, e + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 0;
				return (
					<div
						key={i}
						style={{
							position: 'relative',
							width: tam,
							height: tam,
							transform: `scale(${interpolate(r, [0, 1], [0.4, 1]) * (1 + 0.14 * Math.sin(Math.min(1, pop) * Math.PI))})`,
							opacity: aparece(frame, en + i * paso, 4),
						}}
					>
						{on ? (
							<svg viewBox="-30 -30 160 160" style={{position: 'absolute', inset: -tam * 0.3, width: tam * 1.6, height: tam * 1.6}}>
								{Array.from({length: 8}).map((_, k) => {
									const ang = (k / 8) * Math.PI * 2 - Math.PI / 2;
									const r0 = 60 + 6 * rayos;
									const r1 = r0 + 14 * rayos;
									return (
										<line
											key={k}
											x1={50 + Math.cos(ang) * r0}
											y1={50 + Math.sin(ang) * r0}
											x2={50 + Math.cos(ang) * r1}
											y2={50 + Math.sin(ang) * r1}
											stroke={C.azul}
											strokeWidth={5}
											strokeLinecap="round"
											opacity={rayos}
										/>
									);
								})}
							</svg>
						) : null}
						<div
							style={{
								position: 'absolute',
								inset: 0,
								borderRadius: '50%',
								background: on ? C.azul : 'rgba(29,38,56,0.9)',
								border: `5px solid ${on ? C.azul : 'rgba(255,255,255,0.8)'}`,
								boxShadow: on ? `0 0 40px ${C.brillo}` : '0 12px 26px rgba(0,0,0,0.55)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: FUENTE,
								fontWeight: 900,
								fontSize: tam * 0.48,
								color: on ? C.tinta : C.blanco,
							}}
						>
							{marca === 'numero' ? (
								i + 1
							) : (
								<svg viewBox="0 0 24 24" width={tam * 0.6} height={tam * 0.6}>
									<path
										d="M5 12.5 L10 17.5 L19 7"
										fill="none"
										stroke={on ? C.tinta : 'rgba(255,255,255,0.5)'}
										strokeWidth={3.4}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

// ---------- Línea de gráfica que se dispara hacia arriba (sin cifras) ----------
export const GraficaSube: React.FC<{en: number; disparaEn: number; ancho?: number; alto?: number}> = ({
	en,
	disparaEn,
	ancho = 760,
	alto = 320,
}) => {
	const frame = useCurrentFrame();
	// tramo plano que se dibuja despacio y tramo que se dispara
	const plano = interpolate(frame, [en, disparaEn], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	const sube = interpolate(frame, [disparaEn, disparaEn + 10], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	const brillo = sube >= 1 ? 22 + 12 * pulsoBeat(frame) : 14;
	const x = (v: number) => 20 + v * (ancho - 70);
	const y = (v: number) => alto - 30 - v * (alto - 60);
	const p1 = `M${x(0)} ${y(0.12)} L${x(0.15)} ${y(0.18)} L${x(0.28)} ${y(0.1)} L${x(0.42)} ${y(0.2)} L${x(0.55)} ${y(0.14)} L${x(0.66)} ${y(0.22)}`;
	const p2 = `M${x(0.66)} ${y(0.22)} L${x(0.8)} ${y(0.45)} L${x(1)} ${y(1)}`;
	const ang = (Math.atan2(y(0.45) - y(1), x(1) - x(0.8)) * 180) / Math.PI;
	return (
		<svg width={ancho} height={alto} style={{overflow: 'visible', opacity: aparece(frame, en, 4)}}>
			<path d={`M20 ${alto - 10} H${ancho - 20} M20 ${alto - 10} V10`} stroke="rgba(139,149,168,0.55)" strokeWidth={4} strokeLinecap="round" fill="none" />
			<path
				d={p1}
				pathLength={1}
				strokeDasharray="1 1"
				strokeDashoffset={1 - plano}
				stroke={C.blanco}
				strokeWidth={10}
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
				style={{filter: `drop-shadow(${SOMBRA})`}}
			/>
			<path
				d={p2}
				pathLength={1}
				strokeDasharray="1 1"
				strokeDashoffset={1 - sube}
				stroke={C.azul}
				strokeWidth={12}
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
				style={{filter: `drop-shadow(0 0 ${brillo}px ${C.brillo})`}}
			/>
			{sube >= 1 ? (
				<g transform={`translate(${x(1)} ${y(1)}) rotate(${-ang})`}>
					<path d="M-30 -22 L6 0 L-30 22" stroke={C.azul} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" fill="none" style={{filter: `drop-shadow(0 0 ${brillo}px ${C.brillo})`}} />
				</g>
			) : null}
		</svg>
	);
};

// ---------- Medidor de ánimo: la aguja va al tope, vuelve al centro y tiembla ----------
// claves: [fotograma, ángulo] (−90 izquierda, 0 centro, 90 tope).
export const Medidor: React.FC<{
	en: number;
	claves: [number, number][];
	tiembla?: [number, number]; // tramo en que la aguja tiembla (pelea)
	topeRojoEn?: number; // el tope se pone rojo ("ya vas tarde")
	topeRojoHasta?: number;
	enciendeEn?: number; // el centro se enciende en azul (oportunidad)
	ancho?: number;
}> = ({en, claves, tiembla, topeRojoEn, topeRojoHasta, enciendeEn, ancho = 640}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	let ang = claves[0][1];
	for (let i = 1; i < claves.length; i++) {
		const [fr, a] = claves[i];
		const s = spring({frame: frame - fr, fps, config: {damping: 9, mass: 0.6, stiffness: 120}});
		ang = ang + (a - ang) * s;
	}
	if (tiembla && frame >= tiembla[0] && frame < tiembla[1]) {
		const k = interpolate(frame, [tiembla[0], tiembla[0] + 4, tiembla[1] - 6, tiembla[1]], [0, 1, 1, 0], clamp);
		ang += Math.sin((frame - tiembla[0]) * 1.25) * 24 * k;
	}
	const R = 250;
	const cx = 300;
	const cy = 290;
	const punto = (a: number, r: number) => {
		const t = ((a - 90) * Math.PI) / 180;
		return [cx + Math.cos(t) * r, cy + Math.sin(t) * r];
	};
	const arco = (a0: number, a1: number, r: number) => {
		const [x0, y0] = punto(a0, r);
		const [x1, y1] = punto(a1, r);
		return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
	};
	const rojo = topeRojoEn !== undefined && frame >= topeRojoEn && (topeRojoHasta === undefined || frame < topeRojoHasta);
	const enc = enciendeEn === undefined ? 0 : interpolate(frame, [enciendeEn, enciendeEn + 8], [0, 1], clamp);
	const pop = enciendeEn === undefined ? 0 : spring({frame: frame - enciendeEn, fps, config: {damping: 9, mass: 0.5, stiffness: 160}});
	const [ax, ay] = punto(ang, R - 46);
	const esc = ancho / 600;
	return (
		<div style={{width: ancho, height: 340 * esc, opacity: aparece(frame, en, 5)}}>
			<svg viewBox="0 0 600 340" width={ancho} height={340 * esc} style={{overflow: 'visible'}}>
				<path d={arco(-90, 90, R)} stroke="rgba(139,149,168,0.35)" strokeWidth={40} fill="none" strokeLinecap="round" />
				<path
					d={arco(-25, 25, R)}
					stroke={C.azul}
					strokeWidth={40}
					fill="none"
					opacity={0.35 + 0.65 * enc}
					style={{filter: enc > 0 ? `drop-shadow(0 0 ${24 * enc + 8 * pulsoBeat(frame)}px ${C.brillo})` : undefined}}
				/>
				<path
					d={arco(62, 90, R)}
					stroke={rojo ? C.rojo : 'rgba(255,255,255,0.75)'}
					strokeWidth={40}
					fill="none"
					strokeLinecap="round"
					style={{filter: rojo ? 'drop-shadow(0 0 22px rgba(255,77,94,0.7))' : undefined}}
				/>
				{/* marcas */}
				{[-90, -60, -30, 0, 30, 60, 90].map((a) => {
					const [x0, y0] = punto(a, R - 34);
					const [x1, y1] = punto(a, R - 52);
					return <line key={a} x1={x0} y1={y0} x2={x1} y2={y1} stroke="rgba(255,255,255,0.6)" strokeWidth={5} strokeLinecap="round" />;
				})}
				{/* rayos al encender el centro */}
				{enc > 0
					? [-18, -9, 0, 9, 18].map((a) => {
							const [x0, y0] = punto(a, R + 34 + 4 * enc);
							const [x1, y1] = punto(a, R + 34 + 22 * enc);
							return <line key={a} x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.azul} strokeWidth={7} strokeLinecap="round" opacity={enc} />;
						})
					: null}
				<line x1={cx} y1={cy} x2={ax} y2={ay} stroke={C.blanco} strokeWidth={14} strokeLinecap="round" style={{filter: `drop-shadow(${SOMBRA})`}} />
				<circle cx={cx} cy={cy} r={30 * (1 + 0.15 * Math.sin(Math.min(1, pop) * Math.PI))} fill={enc > 0.5 ? C.azul : C.blanco} stroke={C.tinta} strokeWidth={6} />
			</svg>
		</div>
	);
};

// ---------- Figuras distintas que llegan al mismo punto ----------
const Persona: React.FC<{color: string; borde: string}> = ({color, borde}) => (
	<svg viewBox="0 0 100 100" width="100%" height="100%" style={{overflow: 'visible'}}>
		<path d="M16 90c0-20 15-33 34-33s34 13 34 33Z" fill={color} stroke={borde} strokeWidth={6} strokeLinejoin="round" />
		<circle cx={50} cy={30} r={18} fill={color} stroke={borde} strokeWidth={6} />
	</svg>
);

export const Convergen: React.FC<{en: number; llegaEn: number; centroEn: number; ancho?: number; alto?: number}> = ({
	en,
	llegaEn,
	centroEn,
	ancho = 820,
	alto = 440,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const tam = 120;
	const figuras = [
		{desde: [-330, -120], hasta: [-170, -40], color: C.blanco, borde: C.blanco},
		{desde: [330, -130], hasta: [170, -40], color: C.azulOscuro, borde: C.blanco},
		{desde: [0, 170], hasta: [0, 150], color: C.azul, borde: C.blanco},
	];
	const llega = interpolate(frame, [llegaEn, llegaEn + 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const rc = spring({frame: frame - centroEn, fps, config: {damping: 9, mass: 0.5, stiffness: 150}});
	return (
		<div style={{position: 'relative', width: ancho, height: alto}}>
			{/* punto común */}
			<div
				style={{
					position: 'absolute',
					left: ancho / 2 - 90,
					top: alto / 2 - 90 - 30,
					width: 180,
					height: 180,
					borderRadius: 90,
					background: C.azul,
					boxShadow: `0 0 ${50 + 16 * pulsoBeat(frame)}px ${C.brillo}`,
					transform: `scale(${interpolate(rc, [0, 1], [0.3, 1])})`,
					opacity: aparece(frame, centroEn, 4),
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<svg viewBox="0 0 100 100" width={110} height={110}>
					<path d="M14 78 L38 52 L54 64 L84 28 M66 26 h18 v18" fill="none" stroke={C.tinta} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
			{figuras.map((g, i) => {
				const r = spring({frame: frame - (en + i * 4), fps, config: {damping: 11, mass: 0.5, stiffness: 150}});
				const x = interpolate(llega, [0, 1], [g.desde[0], g.hasta[0]]);
				const y = interpolate(llega, [0, 1], [g.desde[1], g.hasta[1]]);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: ancho / 2 - tam / 2 + x,
							top: alto / 2 - tam / 2 - 30 + y,
							width: tam,
							height: tam,
							transform: `scale(${interpolate(r, [0, 1], [0.4, 1])})`,
							opacity: aparece(frame, en + i * 4, 4),
							filter: `drop-shadow(${SOMBRA})`,
						}}
					>
						<Persona color={g.color} borde={g.borde} />
					</div>
				);
			})}
		</div>
	);
};
