// Piezas propias del día 12: torta de 5 pisos, gráfica que se dibuja y titular de noticia.
import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FUENTE, aparece, pulsoBeat, useRebote} from '../robots/ui';
import {letrasEscritas} from '../robots/piezas';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- Torta de 5 pisos ----------
// Los contornos se dibujan en `dibujaEn`; cada piso se llena de azul con su nombre en su palabra.
// `brillaEn`: los 5 pisos brillan juntos. `alquila`: un piso se sale, se pone gris y dice "alquilado".
export const Torta: React.FC<{
	pisos: {nombre: string; en: number}[]; // de abajo hacia arriba
	dibujaEn: number;
	brillaEn?: number;
	alquila?: {indice: number; en: number};
	altoPiso?: number;
}> = ({pisos, dibujaEn, brillaEn, alquila, altoPiso = 104}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const gap = 14;
	const anchoMax = 720;
	const anchoMin = 420;
	const n = pisos.length;
	const dibujo = interpolate(frame, [dibujaEn, dibujaEn + 15], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const brilla = brillaEn === undefined ? 0 : spring({frame: frame - brillaEn, fps, config: {damping: 9, mass: 0.5, stiffness: 160}});
	const sale = alquila ? spring({frame: frame - alquila.en, fps, config: {damping: 12, mass: 0.6, stiffness: 120}}) : 0;
	const late = brillaEn !== undefined && frame >= brillaEn ? pulsoBeat(frame) : 0;
	return (
		<div style={{position: 'relative', width: anchoMax, height: n * altoPiso + (n - 1) * gap}}>
			{pisos.map((p, i) => {
				const ancho = anchoMax - ((anchoMax - anchoMin) * i) / (n - 1);
				const y = (n - 1 - i) * (altoPiso + gap);
				const r = spring({frame: frame - p.en, fps, config: {damping: 10, mass: 0.5, stiffness: 170}});
				const lleno = interpolate(frame, [p.en, p.en + 5], [0, 1], clamp);
				const esAlquilado = alquila?.indice === i;
				const fuera = esAlquilado ? sale : 0;
				const fondo = esAlquilado && fuera > 0.3 ? '#4a5468' : C.azul;
				const brillo = lleno * (0.5 + 0.5 * brilla) * (esAlquilado ? 1 - fuera : 1);
				const esc = 1 + 0.08 * Math.sin(Math.min(1, r) * Math.PI) * (1 - Math.min(1, (frame - p.en) / 18)) + 0.03 * brilla * (1 - fuera);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: (anchoMax - ancho) / 2,
							top: y,
							width: ancho,
							height: altoPiso,
							zIndex: esAlquilado ? 5 : 1,
							transform: `translateX(${fuera * 80}px) translateY(${fuera * -10}px) rotate(${fuera * 4}deg) scale(${frame >= p.en ? esc : 1})`,
						}}
					>
						{/* contorno que se dibuja */}
						<svg width={ancho} height={altoPiso} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							<rect
								x={3}
								y={3}
								width={ancho - 6}
								height={altoPiso - 6}
								rx={22}
								pathLength={1}
								fill="none"
								stroke={C.blanco}
								strokeWidth={5.5}
								strokeDasharray="1 1"
								strokeDashoffset={1 - dibujo}
								opacity={1 - lleno}
							/>
						</svg>
						<div
							style={{
								position: 'absolute',
								inset: 0,
								borderRadius: 22,
								background: fondo,
								opacity: lleno,
								border: `4px solid ${C.blanco}`,
								boxShadow: `0 0 ${20 + 30 * brillo + 10 * late}px rgba(42,157,255,${0.35 + 0.4 * brillo}), 0 10px 24px rgba(0,0,0,0.5)`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: FUENTE,
								fontWeight: 900,
								fontSize: 48,
								color: esAlquilado && fuera > 0.3 ? C.blanco : C.tinta,
							}}
						>
							<span style={{transform: `scale(${interpolate(r, [0, 1], [0.6, 1])})`}}>{p.nombre}</span>
						</div>
						{esAlquilado && fuera > 0.05 ? (
							<div
								style={{
									position: 'absolute',
									right: 16,
									top: -40,
									padding: '8px 18px',
									borderRadius: 18,
									background: C.blanco,
									color: C.tinta,
									fontFamily: FUENTE,
									fontWeight: 800,
									fontSize: 34,
									boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
									transform: `scale(${interpolate(fuera, [0, 1], [0.4, 1])}) rotate(6deg)`,
									opacity: Math.min(1, fuera * 2),
								}}
							>
								alquilado
							</div>
						) : null}
					</div>
				);
			})}
		</div>
	);
};

// ---------- Gráfica de línea que se dibuja sola (sin cifras) ----------
const FORMAS = {
	sube: [[0, 0.78], [0.16, 0.7], [0.3, 0.74], [0.48, 0.52], [0.62, 0.57], [0.8, 0.3], [1, 0.08]],
	plana: [[0, 0.88], [0.14, 0.66], [0.26, 0.52], [0.4, 0.32], [0.52, 0.3], [0.64, 0.33], [0.76, 0.31], [0.88, 0.33], [1, 0.32]],
	bajaSube: [[0, 0.14], [0.14, 0.24], [0.28, 0.5], [0.42, 0.84], [0.56, 0.7], [0.74, 0.38], [1, 0.1]],
} as const;

export const Grafica: React.FC<{
	forma: keyof typeof FORMAS;
	en: number;
	dur?: number;
	ancho?: number;
	alto?: number;
	marcas?: {punto: number; texto: string; en: number; abajo?: boolean}[];
}> = ({forma, en, dur = 24, ancho = 760, alto = 360, marcas = []}) => {
	const frame = useCurrentFrame();
	const pts = FORMAS[forma].map(([x, y]) => [x * ancho, y * alto] as const);
	const largos = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
	const total = largos.reduce((a, b) => a + b, 0);
	const p = interpolate(frame, [en, en + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	// punta de la línea
	let resto = p * total;
	let punta: readonly [number, number] = pts[0];
	for (let i = 0; i < largos.length; i++) {
		if (resto <= largos[i]) {
			const k = largos[i] ? resto / largos[i] : 0;
			punta = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
			break;
		}
		resto -= largos[i];
		punta = pts[i + 1];
	}
	const d = pts.map((q, i) => `${i ? 'L' : 'M'}${q[0]} ${q[1]}`).join(' ');
	const area = `${d} L${ancho} ${alto} L0 ${alto} Z`;
	const late = frame >= en ? pulsoBeat(frame) : 0;
	return (
		<div style={{position: 'relative', width: ancho, height: alto, opacity: aparece(frame, en, 4)}}>
			<svg width={ancho} height={alto} style={{overflow: 'visible', position: 'absolute', inset: 0}}>
				<defs>
					<linearGradient id={`area-${forma}`} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor={C.azul} stopOpacity={0.35} />
						<stop offset="100%" stopColor={C.azul} stopOpacity={0} />
					</linearGradient>
					<clipPath id={`corte-${forma}`}>
						<rect x={0} y={-20} width={punta[0]} height={alto + 40} />
					</clipPath>
				</defs>
				<line x1={0} y1={alto} x2={ancho} y2={alto} stroke="rgba(139,149,168,0.6)" strokeWidth={4} strokeLinecap="round" />
				<path d={area} fill={`url(#area-${forma})`} clipPath={`url(#corte-${forma})`} />
				<path
					d={d}
					pathLength={1}
					fill="none"
					stroke={C.azul}
					strokeWidth={12}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeDasharray="1 1"
					strokeDashoffset={1 - p}
					style={{filter: `drop-shadow(0 0 14px ${C.brillo})`}}
				/>
				{p > 0 ? <circle cx={punta[0]} cy={punta[1]} r={16 + 4 * late} fill={C.blanco} stroke={C.azul} strokeWidth={7} /> : null}
			</svg>
			{marcas.map((m, i) => {
				const r = spring({frame: frame - m.en, fps: 30, config: {damping: 11, mass: 0.6, stiffness: 140}});
				const [x, y] = pts[m.punto];
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: m.abajo ? y + 34 : y - 34,
							transform: `translate(${x > ancho * 0.85 ? -82 : -50}%, ${m.abajo ? 0 : -100}%) scale(${interpolate(r, [0, 1], [0.5, 1])})`,
							opacity: aparece(frame, m.en, 4),
							padding: '10px 22px',
							borderRadius: 20,
							background: C.azul,
							color: C.tinta,
							fontFamily: FUENTE,
							fontWeight: 900,
							fontSize: 40,
							whiteSpace: 'nowrap',
							boxShadow: `0 0 26px ${C.brillo}, 0 10px 20px rgba(0,0,0,0.5)`,
						}}
					>
						{m.texto}
					</div>
				);
			})}
		</div>
	);
};

// ---------- Titular de noticia que se escribe solo ----------
export const Titular: React.FC<{en: number; texto: string; escribeDesde: number; escribeHasta: number}> = ({
	en,
	texto,
	escribeDesde,
	escribeHasta,
}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en);
	const n = letrasEscritas(frame, escribeDesde, escribeHasta, texto.length);
	const cursor = frame < escribeHasta + 20 && Math.floor(frame / 8) % 2 === 0;
	return (
		<div
			style={{
				width: 820,
				borderRadius: 36,
				background: 'rgba(245,248,255,0.97)',
				boxShadow: `0 24px 60px rgba(0,0,0,0.7), 0 0 50px ${C.brillo}`,
				padding: '34px 40px 40px',
				fontFamily: FUENTE,
				transform: `scale(${interpolate(r, [0, 1], [0.7, 1])}) rotate(${interpolate(r, [0, 1], [-4, 0])}deg)`,
				opacity: aparece(frame, en, 5),
				display: 'flex',
				flexDirection: 'column',
				gap: 18,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
				<div style={{width: 16, height: 16, borderRadius: 8, background: C.azul}} />
				<div style={{fontWeight: 800, fontSize: 30, color: C.gris, letterSpacing: '0.08em'}}>titular de hoy</div>
			</div>
			<div style={{height: 6, width: '100%', borderRadius: 3, background: 'rgba(15,20,32,0.12)'}} />
			<div style={{fontWeight: 900, fontSize: 84, lineHeight: 1.05, color: C.tinta, minHeight: 100, textShadow: 'none'}}>
				“{texto.slice(0, n)}
				{n >= texto.length ? '”' : ''}
				<span style={{opacity: cursor ? 1 : 0, color: C.azul}}>|</span>
			</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 12, opacity: 0.5}}>
				<div style={{height: 14, width: '92%', borderRadius: 7, background: C.gris}} />
				<div style={{height: 14, width: '70%', borderRadius: 7, background: C.gris}} />
			</div>
		</div>
	);
};

