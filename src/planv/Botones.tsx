// Animaciones de "suscribirse" y "me gusta" de plan v sobre fondo verde (chroma) para montar encima del video.
// Sin grano ni desenfoques: así el verde se recorta limpio.
import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORES as C} from './tiempos';

export const VERDE = '#00FF00';
export const DURACION_SUSCRIBIR = 120;
export const DURACION_LIKE = 90;
const SERIF = 'DM Serif Display';
const SANS = 'Inter';
const MONO = 'Space Mono';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Entrada con rebote y salida encogiéndose.
const usarAparicion = (entra: number, sale: number) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const e = spring({frame: frame - entra, fps, config: {damping: 12, stiffness: 170}});
	const s = interpolate(frame, [sale, sale + 10], [0, 1], {...clamp, easing: Easing.in(Easing.back(1.8))});
	return {escala: e * (1 - s), opacidad: Math.min(1, e * 1.4) * (1 - s)};
};

// Isotipo plano (el sombrero visto desde arriba), versión simple para tamaños chicos.
const IsotipoChico: React.FC<{tam: number; giro?: number}> = ({tam, giro = 0}) => {
	const R = 560;
	const radio = (i: number) => R * (1 - i * 0.085);
	return (
		<svg width={tam} height={tam} viewBox="-600 -600 1200 1200">
			<g transform={`rotate(${giro})`}>
				{[0, 2, 4, 6].map((i) => (
					<circle key={i} r={(radio(i) + radio(i + 1)) / 2} fill="none" stroke={C.bermellon} strokeWidth={radio(i) - radio(i + 1)} />
				))}
				<circle r={radio(8)} fill={C.bermellon} />
				<circle r={78} fill="none" stroke={C.negro} strokeWidth={12} />
				<circle r={30} fill={C.negro} />
			</g>
		</svg>
	);
};

// Cursor de flecha que viaja hasta un punto y hace clic.
const Cursor: React.FC<{desde: [number, number]; hasta: [number, number]; llega: number; clic: number; sale: number}> = ({desde, hasta, llega, clic, sale}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [llega - 22, llega], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const x = interpolate(p, [0, 1], [desde[0], hasta[0]]);
	const y = interpolate(p, [0, 1], [desde[1], hasta[1]]);
	const aprieta = interpolate(frame, [clic - 2, clic, clic + 5], [1, 0.82, 1], clamp);
	const op = interpolate(frame, [llega - 22, llega - 16, sale, sale + 8], [0, 1, 1, 0], clamp);
	return (
		<svg width={80} height={80} viewBox="0 0 24 24" style={{position: 'absolute', left: x - 12, top: y - 6, opacity: op, transform: `scale(${aprieta})`, transformOrigin: '20% 15%'}}>
			<path d="M5 2 L5 20 L9.6 15.6 L12.6 22 L15.4 20.8 L12.4 14.6 L19 14.6 Z" fill={C.papel} stroke={C.negro} strokeWidth={1.4} strokeLinejoin="round" />
		</svg>
	);
};

// Onda que sale del punto donde se hace clic.
const Onda: React.FC<{x: number; y: number; clic: number; color: string}> = ({x, y, clic, color}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [clic, clic + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	if (frame < clic || p >= 1) return null;
	return <div style={{position: 'absolute', left: x - 70 * p, top: y - 70 * p, width: 140 * p, height: 140 * p, borderRadius: '50%', border: `6px solid ${color}`, opacity: 1 - p}} />;
};

const Campana: React.FC<{tam: number; color: string}> = ({tam, color}) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
		<path d="M6 16 V11 a6 6 0 0 1 12 0 v5 l1.6 2 H4.4 Z" fill={color} />
		<path d="M10 20.5 a2 2 0 0 0 4 0" />
	</svg>
);

export const SuscribirPlanV: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height, fps} = useVideoConfig();
	const T = {entra: 4, llega: 42, clic: 46, campana: 58, sale: 104};
	const {escala, opacidad} = usarAparicion(T.entra, T.sale);
	const hecho = frame >= T.clic + 2;
	const boton = interpolate(frame, [T.clic - 2, T.clic, T.clic + 8], [1, 0.92, 1], clamp);
	const cambio = spring({frame: frame - (T.clic + 2), fps, config: {damping: 14, stiffness: 200}});
	const giroCampana = frame >= T.campana ? Math.sin((frame - T.campana) * 0.9) * 22 * Math.exp(-(frame - T.campana) / 14) : 0;
	const campana = spring({frame: frame - T.campana + 4, fps, config: {damping: 10, stiffness: 200}});
	// medidas de la tarjeta
	const W = 900;
	const H = 200;
	const x0 = (width - W) / 2;
	const y0 = (height - H) / 2;
	const botonX = x0 + W - 300;
	const botonY = y0 + 55;
	return (
		<AbsoluteFill style={{backgroundColor: VERDE}}>
			<Audio src={staticFile('planv/sfx-suscribir.wav')} />
			<div style={{position: 'absolute', left: x0, top: y0, width: W, height: H, transform: `scale(${escala})`, opacity: opacidad, transformOrigin: 'center'}}>
				<div style={{position: 'absolute', inset: 0, background: C.negro, borderRadius: 100, border: `3px solid ${C.bermellon}`}} />
				<div style={{position: 'absolute', left: 30, top: 30}}>
					<IsotipoChico tam={140} giro={frame * 1.5} />
				</div>
				<div style={{position: 'absolute', left: 200, top: 46}}>
					<div style={{fontFamily: SERIF, fontSize: 64, lineHeight: 1, color: C.papel}}>
						plan <span style={{color: C.bermellon}}>v</span>
					</div>
					<div style={{fontFamily: MONO, fontSize: 22, letterSpacing: '0.3em', color: C.papel, marginTop: 12}}>podcast</div>
				</div>
				<div
					style={{
						position: 'absolute',
						left: botonX - x0,
						top: botonY - y0,
						width: 260,
						height: 90,
						borderRadius: 45,
						background: hecho ? '#2A2A2A' : C.bermellon,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 12,
						transform: `scale(${boton})`,
						fontFamily: SANS,
						fontWeight: 600,
						fontSize: 34,
						color: C.papel,
					}}
				>
					{hecho ? (
						<span style={{transform: `scale(${0.6 + 0.4 * cambio})`, display: 'flex', alignItems: 'center', gap: 12}}>
							suscrito
							<svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke={C.papel} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
								<path d="M4 12.5 L9.5 18 L20 6.5" />
							</svg>
						</span>
					) : (
						'suscribirse'
					)}
				</div>
				<div style={{position: 'absolute', left: W + 24, top: 58, transform: `scale(${campana}) rotate(${giroCampana}deg)`, transformOrigin: '50% 10%'}}>
					<div style={{width: 84, height: 84, borderRadius: 42, background: C.negro, border: `3px solid ${C.bermellon}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
						<Campana tam={46} color={C.papel} />
					</div>
				</div>
			</div>
			<Onda x={botonX + 130} y={botonY + 45} clic={T.clic} color={C.papel} />
			<Cursor desde={[width * 0.78, height * 0.92]} hasta={[botonX + 150, botonY + 52]} llega={T.llega} clic={T.clic} sale={T.campana + 12} />
		</AbsoluteFill>
	);
};

const Pulgar: React.FC<{tam: number; lleno: number}> = ({tam, lleno}) => (
	<svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" strokeLinejoin="round" strokeLinecap="round">
		<path
			d="M7 10.5 V20 H4.5 a1 1 0 0 1 -1 -1 v-7.5 a1 1 0 0 1 1 -1 Z M7 10.5 L10.8 3.4 a1.9 1.9 0 0 1 3.5 1.2 L13.6 9 H19 a2 2 0 0 1 2 2.3 l-1.2 7 a2 2 0 0 1 -2 1.7 H7"
			fill={lleno > 0.5 ? C.bermellon : 'none'}
			stroke={lleno > 0.5 ? C.bermellon : C.papel}
			strokeWidth={1.8}
		/>
	</svg>
);

export const LikePlanV: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height, fps} = useVideoConfig();
	const T = {entra: 4, llega: 38, clic: 42, sale: 76};
	const {escala, opacidad} = usarAparicion(T.entra, T.sale);
	const hecho = frame >= T.clic;
	const rebote = hecho ? 1 + 0.35 * Math.sin(Math.min(1, (frame - T.clic) / 10) * Math.PI) : interpolate(frame, [T.clic - 3, T.clic], [1, 0.9], clamp);
	const texto = spring({frame: frame - (T.clic + 3), fps, config: {damping: 14, stiffness: 180}});
	const W = 480;
	const H = 170;
	const x0 = (width - W) / 2;
	const y0 = (height - H) / 2;
	const iconoX = x0 + 50;
	const iconoY = y0 + 25;
	// explosión de puntos alrededor del pulgar
	const p = interpolate(frame, [T.clic, T.clic + 16], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const chispas = hecho && p < 1
		? Array.from({length: 10}, (_, i) => {
				const a = (i / 10) * Math.PI * 2;
				const d = 70 + 70 * p;
				const r = 10 * (1 - p);
				return <div key={i} style={{position: 'absolute', left: iconoX + 60 + Math.cos(a) * d - r, top: iconoY + 60 + Math.sin(a) * d - r, width: r * 2, height: r * 2, borderRadius: '50%', background: i % 2 ? C.bermellon : C.papel}} />;
			})
		: null;
	return (
		<AbsoluteFill style={{backgroundColor: VERDE}}>
			<Audio src={staticFile('planv/sfx-like.wav')} />
			<div style={{position: 'absolute', left: x0, top: y0, width: W, height: H, transform: `scale(${escala})`, opacity: opacidad}}>
				<div style={{position: 'absolute', inset: 0, background: C.negro, borderRadius: 85, border: `3px solid ${C.bermellon}`}} />
				<div style={{position: 'absolute', left: 50, top: 25, transform: `scale(${rebote})`}}>
					<Pulgar tam={120} lleno={hecho ? 1 : 0} />
				</div>
				<div style={{position: 'absolute', left: 200, top: 0, height: H, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
					<div style={{fontFamily: SANS, fontWeight: 600, fontSize: 46, color: C.papel}}>me gusta</div>
					<div style={{fontFamily: MONO, fontSize: 20, letterSpacing: '0.2em', color: C.bermellon, opacity: texto, transform: `translateY(${(1 - texto) * 10}px)`, marginTop: 6}}>
						¡gracias!
					</div>
				</div>
			</div>
			{chispas}
			<Onda x={iconoX + 60} y={iconoY + 60} clic={T.clic} color={C.bermellon} />
			<Cursor desde={[width * 0.75, height * 0.9]} hasta={[iconoX + 70, iconoY + 62]} llega={T.llega} clic={T.clic} sale={T.clic + 14} />
		</AbsoluteFill>
	);
};
