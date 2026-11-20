// Objetos gráficos "uno por idea" para Escuela Invora (guion audiovisual): Subtitulos, TorreNasdaq,
// EtiquetaPrecio, LluviaBilletes, Foco, GraficaPrecio, Latido, TitularMedio y FichaInvora.
// Mismo lenguaje de marca que ui.tsx / columna.tsx: Montserrat, azul tech, tinta, rojo solo para "no".
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {aparece, C, FUENTE, pulsoBeat, SOMBRA, useRebote} from './ui';
import {FPS, type Palabra} from '../tiemposBase';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ETQ: React.CSSProperties = {fontFamily: FUENTE, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.22em'};
const norm = (s: string) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9ñ]/g, '');

// ---------- Subtítulos grandes palabra por palabra; la palabra clave va en caja azul ----------
// Grupos de hasta `max` palabras, cortados en la puntuación. Cada palabra aparece cuando se dice.
export const Subtitulos: React.FC<{
	palabras: Palabra[];
	claves: string[]; // palabras (o números) que van en caja azul
	negativas?: string[]; // palabras que van en caja roja ("no")
	ocultar?: [number, number][]; // tramos (en fotogramas) sin subtítulos
	y?: number;
	max?: number;
	tam?: number;
	reemplazos?: Record<string, string>; // cómo se escribe en pantalla (p. ej. "83" -> "83 $")
	propios?: string[]; // nombres que conservan sus mayúsculas (el resto va en minúscula)
}> = ({palabras, claves, negativas = [], ocultar = [], y = 1300, max = 4, tam = 66, reemplazos = {}, propios = []}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / FPS;
	if (ocultar.some(([a, b]) => frame >= a && frame < b)) return null;
	// Arma los grupos
	const grupos: Palabra[][] = [];
	let g: Palabra[] = [];
	palabras.forEach((p, i) => {
		g.push(p);
		const sig = palabras[i + 1];
		const corta = /[.,?!:]$/.test(p.w) || g.length >= max || !sig || sig.t0 - p.t1 > 0.35;
		if (corta) {
			grupos.push(g);
			g = [];
		}
	});
	const actual = grupos.find((gr, i) => t >= gr[0].t0 - 0.05 && t < (grupos[i + 1]?.[0].t0 ?? gr[gr.length - 1].t1 + 0.6) - 0.05);
	if (!actual) return null;
	const setC = new Set(claves.map(norm));
	const setN = new Set(negativas.map(norm));
	return (
		<div style={{position: 'absolute', left: 70, width: 860, top: y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '10px 18px'}}>
			{actual.map((p, i) => {
				const f0 = Math.round(p.t0 * FPS);
				const r = spring({frame: frame - f0, fps, config: {damping: 11, mass: 0.5, stiffness: 180}});
				const limpio = p.w.replace(/[.,?!:¿¡]/g, '');
				const clave = setC.has(norm(limpio));
				const neg = setN.has(norm(limpio));
				const conserva = new Set(propios.map(norm)).has(norm(limpio)) || /[A-ZÁÉÍÓÚÑ].*[A-ZÁÉÍÓÚÑ]/.test(limpio);
				const texto = reemplazos[limpio] ?? (conserva ? limpio : limpio.toLowerCase()).replace(/^nvidia$/, 'NVIDIA').replace(/^amd$/, 'AMD').replace(/^ipo$/, 'IPO').replace(/^ant$/, 'ANT').replace(/^cnbc$/, 'CNBC').replace(/^anthropic$/, 'Anthropic').replace(/^claude$/, 'Claude').replace(/^nasdaq$/, 'Nasdaq').replace(/^yahoo$/, 'Yahoo').replace(/^finance$/, 'Finance').replace(/^bloomberg$/, 'Bloomberg').replace(/^invora$/, 'Invora').replace(/^micron$/, 'Micron');
				const caja = clave || neg;
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							fontFamily: FUENTE,
							fontWeight: caja ? 900 : 800,
							fontSize: tam,
							lineHeight: 1.1,
							color: caja ? (neg ? C.blanco : C.tinta) : C.blanco,
							background: caja ? (neg ? C.rojo : C.azul) : undefined,
							padding: caja ? '2px 16px 6px' : undefined,
							borderRadius: caja ? 14 : undefined,
							boxShadow: caja ? `0 0 ${24 + 10 * pulsoBeat(frame)}px ${neg ? 'rgba(255,77,94,0.55)' : C.brillo}` : undefined,
							textShadow: caja ? undefined : SOMBRA,
							opacity: frame >= f0 - 1 ? 1 : 0,
							transform: `translateY(${(1 - r) * 26}px) scale(${interpolate(r, [0, 1], [0.7, 1])}) rotate(${caja ? (1 - r) * -6 - 1.5 : 0}deg)`,
						}}
					>
						{texto}
					</span>
				);
			})}
		</div>
	);
};

// ---------- Torre cilíndrica del Nasdaq con banda de tickers ----------
export const TorreNasdaq: React.FC<{en: number; antEn: number; chipEn?: number; logo?: string}> = ({en, antEn, chipEn, logo}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en, {damping: 14, mass: 0.8, stiffness: 90});
	const desp = (frame * 3.2) % 900;
	const tickers = frame >= antEn ? ['ANT', 'GOOGL', 'ANT', 'AMZN', 'ANT', 'META'] : ['GOOGL', 'AMZN', 'META', 'GOOGL', 'AMZN', 'META'];
	const antP = spring({frame: frame - antEn, fps: 30, config: {damping: 9, mass: 0.6, stiffness: 160}});
	const chipP = chipEn === undefined ? 0 : interpolate(frame, [chipEn, chipEn + 14], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const W = 540;
	return (
		<div style={{position: 'relative', width: 860, height: 760, transform: `translateY(${(1 - r) * 120}px)`, opacity: aparece(frame, en, 6)}}>
			{/* edificios de fondo */}
			<svg width={860} height={760} style={{position: 'absolute', inset: 0}}>
				{Array.from({length: 9}).map((_, i) => {
					const w = 70 + random(`w${i}`) * 50;
					const h = 220 + random(`h${i}`) * 260;
					const x = i * 98 - 20;
					return (
						<g key={i} opacity={0.75}>
							<rect x={x} y={760 - h} width={w} height={h} fill="#141c2e" stroke="rgba(42,157,255,0.25)" strokeWidth={2} />
							{Array.from({length: Math.floor(h / 34)}).map((_, k) => (
								<rect key={k} x={x + 12} y={760 - h + 16 + k * 34} width={w - 24} height={8} fill={random(`l${i}-${k}`) > 0.55 ? 'rgba(42,157,255,0.5)' : 'rgba(255,255,255,0.06)'} />
							))}
						</g>
					);
				})}
			</svg>
			{/* torre */}
			<div style={{position: 'absolute', left: (860 - W) / 2, bottom: 0, width: W, height: 700}}>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						borderRadius: `${W / 2}px / 46px`,
						background: 'linear-gradient(90deg, #0b1220 0%, #1b2a48 30%, #24406e 50%, #1b2a48 70%, #0b1220 100%)',
						boxShadow: `0 0 60px rgba(42,157,255,0.35), inset 0 0 40px rgba(0,0,0,0.6)`,
						overflow: 'hidden',
					}}
				>
					{Array.from({length: 22}).map((_, k) => (
						<div key={k} style={{position: 'absolute', left: 0, right: 0, top: 70 + k * 28, height: 3, background: 'rgba(42,157,255,0.18)'}} />
					))}
				</div>
				{/* letrero */}
				<div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center'}}>
					{logo ? (
						<div style={{background: C.blanco, borderRadius: 18, padding: '12px 22px', boxShadow: `0 0 30px ${C.brillo}`}}>
							<Img src={staticFile(`logos/${logo}`)} style={{height: 44, display: 'block'}} />
						</div>
					) : (
						<div style={{...ETQ, fontSize: 40, color: C.blanco, letterSpacing: '0.3em'}}>NASDAQ</div>
					)}
				</div>
				{/* banda de tickers */}
				<div
					style={{
						position: 'absolute',
						left: -10,
						right: -10,
						top: 230,
						height: 96,
						background: '#05080f',
						borderTop: `3px solid ${C.azul}`,
						borderBottom: `3px solid ${C.azul}`,
						boxShadow: `0 0 40px ${C.brillo}`,
						overflow: 'hidden',
						borderRadius: 10,
					}}
				>
					<div style={{position: 'absolute', top: 14, left: -desp, display: 'flex', gap: 60, whiteSpace: 'nowrap'}}>
						{[...tickers, ...tickers, ...tickers].map((tk, i) => (
							<span
								key={i}
								style={{
									fontFamily: FUENTE,
									fontWeight: 900,
									fontSize: 56,
									color: tk === 'ANT' ? C.azul : 'rgba(255,255,255,0.8)',
									textShadow: tk === 'ANT' ? `0 0 ${20 * antP}px ${C.brillo}` : undefined,
								}}
							>
								{tk} <span style={{fontSize: 36, color: tk === 'ANT' ? C.azul : C.gris}}>▲</span>
							</span>
						))}
					</div>
				</div>
				{/* ANT grande que entra */}
				{frame >= antEn ? (
					<div
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							top: 380,
							display: 'flex',
							justifyContent: 'center',
							transform: `scale(${interpolate(antP, [0, 1], [0.3, 1])})`,
							opacity: antP,
						}}
					>
						<div style={{fontFamily: FUENTE, fontWeight: 900, fontSize: 150, color: C.azul, textShadow: `0 0 50px ${C.brillo}, ${SOMBRA}`, letterSpacing: '0.04em'}}>ANT</div>
					</div>
				) : null}
			</div>
			{/* chip IA que vuela a la banda */}
			{chipEn !== undefined && frame >= chipEn && chipP < 1 ? (
				<div
					style={{
						position: 'absolute',
						left: interpolate(chipP, [0, 1], [700, 400]),
						top: interpolate(chipP, [0, 1], [40, 290]),
						width: 110,
						height: 110,
						borderRadius: 20,
						background: C.azul,
						boxShadow: `0 0 40px ${C.brillo}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: FUENTE,
						fontWeight: 900,
						fontSize: 52,
						color: C.tinta,
						transform: `scale(${1 - chipP * 0.5}) rotate(${chipP * 180}deg)`,
					}}
				>
					IA
				</div>
			) : null}
		</div>
	);
};

// ---------- Etiqueta de precio: rango tachado y sello que cae encima ----------
export const EtiquetaPrecio: React.FC<{en: number; selloEn: number; rangoEn: number; tachaEn: number; sello: string; rango: string}> = ({
	en,
	selloEn,
	rangoEn,
	tachaEn,
	sello,
	rango,
}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en, {damping: 11, mass: 0.7, stiffness: 120});
	const s = spring({frame: frame - selloEn, fps: 30, config: {damping: 8, mass: 0.9, stiffness: 200}});
	const tacha = interpolate(frame, [tachaEn, tachaEn + 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const golpe = frame >= selloEn + 6 ? 10 * Math.exp(-(frame - selloEn - 6) / 3) * Math.sin((frame - selloEn) * 2) : 0;
	const balanceo = Math.sin((frame - en) / 18) * 3;
	return (
		<div style={{position: 'relative', width: 700, height: 560, transform: `translate(${golpe}px, ${(1 - r) * -300}px) rotate(${-6 + balanceo}deg)`, opacity: aparece(frame, en, 4)}}>
			{/* cuerda */}
			<svg width={700} height={560} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<path d="M 120 120 C 60 0, 20 -40, -40 -120" stroke={C.gris} strokeWidth={6} fill="none" />
			</svg>
			<div
				style={{
					position: 'absolute',
					left: 60,
					top: 60,
					width: 600,
					height: 400,
					background: C.blanco,
					clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 18% 100%, 0 50%)',
					boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
					filter: `drop-shadow(0 0 30px rgba(42,157,255,0.4))`,
				}}
			/>
			<div style={{position: 'absolute', left: 120, top: 245, width: 34, height: 34, borderRadius: 17, background: C.tinta}} />
			<div style={{position: 'absolute', left: 200, top: 110, width: 430, display: 'flex', flexDirection: 'column', gap: 10, fontFamily: FUENTE}}>
				<div style={{...ETQ, fontSize: 28, color: C.gris, opacity: aparece(frame, rangoEn, 5)}}>rango inicial</div>
				<div style={{position: 'relative', alignSelf: 'flex-start', opacity: aparece(frame, rangoEn, 5)}}>
					<div style={{fontWeight: 900, fontSize: 104, color: frame >= tachaEn ? C.gris : C.tinta, lineHeight: 1}}>{rango}</div>
					<div style={{position: 'absolute', left: -10, top: '50%', height: 12, borderRadius: 6, background: C.rojo, width: `calc(${tacha * 100}% + 20px)`, boxShadow: '0 0 16px rgba(255,77,94,0.6)'}} />
				</div>
				<div style={{...ETQ, fontSize: 28, color: C.azulOscuro, marginTop: 14, opacity: aparece(frame, selloEn, 4)}}>precio de salida</div>
			</div>
			{/* sello */}
			{frame >= selloEn ? (
				<div
					style={{
						position: 'absolute',
						left: 330,
						top: 300,
						padding: '10px 34px',
						border: `8px solid ${C.azul}`,
						borderRadius: 26,
						background: 'rgba(42,157,255,0.12)',
						fontFamily: FUENTE,
						fontWeight: 900,
						fontSize: 120,
						lineHeight: 1,
						color: C.azul,
						textShadow: `0 0 30px ${C.brillo}`,
						transform: `scale(${interpolate(s, [0, 1], [3, 1])}) rotate(${-8}deg)`,
						opacity: Math.min(1, s * 2),
						whiteSpace: 'nowrap',
					}}
				>
					{sello}
				</div>
			) : null}
		</div>
	);
};

// ---------- Foco de luz desde arriba ----------
export const Foco: React.FC<{en: number}> = ({en}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [en, en + 12], [0, 1], clamp);
	const titila = 0.9 + 0.1 * Math.sin(frame / 5);
	return (
		<AbsoluteFill style={{opacity: o * titila, pointerEvents: 'none'}}>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 38% 70% at 50% 0%, rgba(160,210,255,0.28) 0%, rgba(42,157,255,0.10) 45%, rgba(0,0,0,0) 75%)'}} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 42% 8% at 50% 72%, rgba(42,157,255,0.30) 0%, rgba(0,0,0,0) 70%)'}} />
		</AbsoluteFill>
	);
};

// ---------- Lluvia de billetes con un texto (ANT) ----------
export const LluviaBilletes: React.FC<{en: number; hasta: number; texto: string; cantidad?: number}> = ({en, hasta, texto, cantidad = 26}) => {
	const frame = useCurrentFrame();
	if (frame < en || frame > hasta + 30) return null;
	const sale = interpolate(frame, [hasta - 8, hasta], [1, 0], clamp);
	return (
		<AbsoluteFill style={{opacity: sale, pointerEvents: 'none'}}>
			{Array.from({length: cantidad}).map((_, i) => {
				const retraso = random(`d${i}`) * 50;
				const t = frame - en - retraso;
				if (t < 0) return null;
				const vel = 7 + random(`v${i}`) * 7;
				const x = 40 + random(`x${i}`) * 1000 + Math.sin(t / 10 + i) * 40;
				const y = -200 + ((t * vel) % 2300);
				const giro = Math.sin(t / 12 + i) * 40;
				const ladeo = Math.cos(t / 9 + i);
				const lejos = 0.55 + random(`s${i}`) * 0.6;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: 190 * lejos,
							height: 92 * lejos,
							borderRadius: 8,
							background: 'linear-gradient(135deg, #1e3a66, #2a9dff)',
							border: '3px solid rgba(255,255,255,0.7)',
							boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
							transform: `rotate(${giro}deg) scaleY(${0.35 + 0.65 * Math.abs(ladeo)})`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: FUENTE,
							fontWeight: 900,
							fontSize: 40 * lejos,
							color: C.blanco,
							opacity: 0.35 + 0.5 * lejos,
						}}
					>
						{texto}
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

// ---------- Gráfica de precio que se dibuja punto por punto ----------
export type PuntoPrecio = {valor: number; en: number; etiqueta: string; detalle?: string; tono?: 'azul' | 'rojo' | 'gris'};
export const GraficaPrecio: React.FC<{
	en: number;
	puntos: PuntoPrecio[];
	base?: {valor: number; texto: string}; // línea punteada (precio de salida)
	min: number;
	max: number;
	ancho?: number;
	alto?: number;
	extra?: React.ReactNode;
	incognita?: number; // fotograma en que aparece el "?" al final
}> = ({en, puntos, base, min, max, ancho = 860, alto = 640, extra, incognita}) => {
	const frame = useCurrentFrame();
	const e = useRebote(en);
	const pad = {l: 30, r: 150, t: 60, b: 60};
	const X = (i: number) => pad.l + (i / Math.max(1, puntos.length - 1)) * (ancho - pad.l - pad.r);
	const Y = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (alto - pad.t - pad.b);
	// progreso de cada tramo
	const prog = puntos.map((p, i) => (i === 0 ? interpolate(frame, [p.en, p.en + 6], [0, 1], clamp) : interpolate(frame, [p.en - 8, p.en + 6], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)})));
	let d = `M ${X(0)} ${Y(puntos[0].valor)}`;
	for (let i = 1; i < puntos.length; i++) {
		const p = prog[i];
		if (p <= 0) break;
		const x0 = X(i - 1), y0 = Y(puntos[i - 1].valor), x1 = X(i), y1 = Y(puntos[i].valor);
		d += ` L ${x0 + (x1 - x0) * p} ${y0 + (y1 - y0) * p}`;
	}
	const ultimo = puntos[puntos.length - 1];
	return (
		<div style={{position: 'relative', width: ancho, height: alto, opacity: aparece(frame, en, 6), transform: `translateY(${(1 - e) * 40}px)`}}>
			<svg width={ancho} height={alto} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<defs>
					<linearGradient id="relleno" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor={C.azul} stopOpacity={0.35} />
						<stop offset="100%" stopColor={C.azul} stopOpacity={0} />
					</linearGradient>
				</defs>
				{[0, 1, 2, 3, 4].map((k) => (
					<line key={k} x1={pad.l} x2={ancho - pad.r} y1={pad.t + (k * (alto - pad.t - pad.b)) / 4} y2={pad.t + (k * (alto - pad.t - pad.b)) / 4} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
				))}
				{base ? (
					<g opacity={aparece(frame, en + 4, 8)}>
						<line x1={pad.l} x2={ancho - pad.r + 20} y1={Y(base.valor)} y2={Y(base.valor)} stroke={C.blanco} strokeWidth={4} strokeDasharray="14 12" opacity={0.8} />
						<text x={ancho - pad.r + 30} y={Y(base.valor) + 12} fill={C.blanco} fontFamily={FUENTE} fontWeight={800} fontSize={34}>
							{base.texto}
						</text>
					</g>
				) : null}
				<path d={`${d} L ${X(Math.max(0, prog.filter((p) => p > 0).length - 1))} ${alto - pad.b} L ${X(0)} ${alto - pad.b} Z`} fill="url(#relleno)" opacity={0.8} />
				<path d={d} stroke={C.azul} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{filter: `drop-shadow(0 0 14px ${C.brillo})`}} />
				{puntos.map((p, i) => {
					const vis = frame >= p.en;
					const s = spring({frame: frame - p.en, fps: 30, config: {damping: 9, mass: 0.5, stiffness: 180}});
					const color = p.tono === 'rojo' ? C.rojo : p.tono === 'gris' ? C.gris : C.azul;
					const arriba = i === 0 || puntos[i - 1].valor <= p.valor;
					return vis ? (
						<g key={i} transform={`translate(${X(i)} ${Y(p.valor)})`}>
							<circle r={18 * s} fill={color} stroke={C.blanco} strokeWidth={5} />
							<circle r={18 + ((frame - p.en) % 30)} fill="none" stroke={color} strokeWidth={3} opacity={0.6 * (1 - ((frame - p.en) % 30) / 30)} />
							<g transform={`translate(0 ${arriba ? -44 : 70}) scale(${s})`} opacity={s}>
								<text textAnchor="middle" fill={C.blanco} fontFamily={FUENTE} fontWeight={900} fontSize={54} style={{textShadow: SOMBRA} as React.CSSProperties}>
									{p.etiqueta}
								</text>
								{p.detalle ? (
									<text textAnchor="middle" y={arriba ? -58 : 40} fill={C.gris} fontFamily={FUENTE} fontWeight={800} fontSize={24} letterSpacing="0.18em">
										{p.detalle.toUpperCase()}
									</text>
								) : null}
							</g>
						</g>
					) : null;
				})}
				{incognita !== undefined && frame >= incognita ? (
					<g transform={`translate(${X(puntos.length - 1) + 70} ${Y(ultimo.valor)})`}>
						<circle r={46} fill={C.tinta} stroke={C.azul} strokeWidth={5} />
						<text textAnchor="middle" y={22} fill={C.azul} fontFamily={FUENTE} fontWeight={900} fontSize={64}>
							?
						</text>
					</g>
				) : null}
			</svg>
			{extra}
		</div>
	);
};

// ---------- Latido (ECG) con corazón y etiqueta ----------
export const Latido: React.FC<{en: number; etiqueta: string; ancho?: number}> = ({en, etiqueta, ancho = 860}) => {
	const frame = useCurrentFrame();
	const t = frame - en;
	if (t < 0) return null;
	const periodo = 36;
	const fase = (t % periodo) / periodo;
	const late = Math.exp(-(((t % periodo) - 0) / 4)) + 0.6 * Math.exp(-Math.max(0, (t % periodo) - 8) / 4) * ((t % periodo) >= 8 ? 1 : 0);
	// trazo ECG repetido
	const seg = 'h 60 l 20 -20 l 14 40 l 22 -150 l 22 190 l 18 -80 l 16 20 h 70';
	const d = `M 0 200 ${seg} ${seg} ${seg}`;
	const dib = interpolate(t, [0, 30], [0, 1], clamp);
	return (
		<div style={{position: 'relative', width: ancho, height: 380, opacity: aparece(frame, en, 5)}}>
			<svg width={ancho} height={380} viewBox="0 0 860 380" style={{position: 'absolute', inset: 0}}>
				<path d={d} stroke={C.azul} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - dib} style={{filter: `drop-shadow(0 0 16px ${C.brillo})`}} />
				{/* barrido que recorre la línea */}
				<rect x={(fase * 960) - 100} y={0} width={60} height={380} fill="url(#barrido)" opacity={dib >= 1 ? 1 : 0} />
				<defs>
					<linearGradient id="barrido" x1="0" x2="1">
						<stop offset="0" stopColor="#0f1420" stopOpacity={0} />
						<stop offset="1" stopColor="#0f1420" stopOpacity={0.85} />
					</linearGradient>
				</defs>
			</svg>
			<div style={{position: 'absolute', right: 30, top: -20, transform: `scale(${1 + 0.18 * late})`}}>
				<svg viewBox="0 0 100 90" width={150} height={135} style={{filter: `drop-shadow(0 0 ${20 + 20 * late}px rgba(255,77,94,0.6))`}}>
					<path d="M50 86 C 20 62, 4 44, 4 26 A 22 22 0 0 1 50 16 A 22 22 0 0 1 96 26 C 96 44, 80 62, 50 86 Z" fill={C.rojo} stroke={C.blanco} strokeWidth={4} />
				</svg>
			</div>
			<div style={{position: 'absolute', left: 0, top: -10, ...ETQ, fontSize: 54, letterSpacing: '0.24em', color: C.tinta, background: C.azul, padding: '10px 28px', borderRadius: 60, boxShadow: `0 0 30px ${C.brillo}`}}>
				{etiqueta}
			</div>
		</div>
	);
};

// ---------- Tarjeta de titular de un medio (texto parafraseado de la voz, con el medio) ----------
export const TitularMedio: React.FC<{en: number; medio: string; logo?: {archivo: string; alto?: number}; texto: string}> = ({en, medio, logo, texto}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en, {damping: 12, mass: 0.7, stiffness: 130});
	const flota = Math.sin((frame - en) / 24) * 5;
	return (
		<div
			style={{
				width: 860,
				boxSizing: 'border-box',
				background: C.blanco,
				borderRadius: 30,
				padding: '34px 40px 40px',
				boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 ${36 + 10 * pulsoBeat(frame)}px rgba(42,157,255,0.4)`,
				transform: `translateY(${(1 - r) * 80 + flota}px) rotate(${interpolate(r, [0, 1], [4, -1.5])}deg)`,
				opacity: aparece(frame, en, 5),
				fontFamily: FUENTE,
				display: 'flex',
				flexDirection: 'column',
				gap: 22,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 20, borderBottom: '3px solid #e3e8f0', paddingBottom: 18}}>
				{logo ? <Img src={staticFile(`logos/${logo.archivo}`)} style={{height: logo.alto ?? 44, display: 'block'}} /> : null}
				<div style={{...ETQ, fontSize: 24, color: C.gris}}>{medio}</div>
			</div>
			<div style={{fontWeight: 900, fontSize: 58, lineHeight: 1.08, color: C.tinta}}>
				{texto.split(/(\*[^*]+\*)/g).map((p, i) =>
					p.startsWith('*') ? (
						<span key={i} style={{color: C.azulOscuro}}>
							{p.slice(1, -1)}
						</span>
					) : (
						<span key={i}>{p}</span>
					),
				)}
			</div>
		</div>
	);
};

// ---------- Ficha de la plataforma Invora (logo + ticker), sin cifras ----------
export const FichaInvora: React.FC<{en: number; logo: {archivo: string; alto?: number}; ticker: string; nombre: string}> = ({en, logo, ticker, nombre}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en, {damping: 10, mass: 0.6, stiffness: 160});
	const flota = Math.sin((frame - en) / 20 + ticker.length) * 5;
	return (
		<div
			style={{
				width: 262,
				height: 330,
				boxSizing: 'border-box',
				borderRadius: 28,
				background: 'rgba(15,20,32,0.92)',
				border: `3px solid ${C.azul}`,
				boxShadow: `0 0 ${30 + 10 * pulsoBeat(frame)}px ${C.brillo}, 0 20px 40px rgba(0,0,0,0.55)`,
				padding: 22,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 16,
				transform: `translateY(${(1 - r) * 80 + flota}px) scale(${interpolate(r, [0, 1], [0.5, 1])})`,
				opacity: aparece(frame, en, 4),
				fontFamily: FUENTE,
			}}
		>
			<div style={{...ETQ, fontSize: 18, color: C.gris, alignSelf: 'flex-start'}}>Ficha · Invora</div>
			<div style={{width: '100%', height: 110, background: C.blanco, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Img src={staticFile(`logos/${logo.archivo}`)} style={{height: logo.alto ?? 46, maxWidth: 190, objectFit: 'contain'}} />
			</div>
			<div style={{fontWeight: 900, fontSize: 54, color: C.blanco, lineHeight: 1}}>{ticker}</div>
			<div style={{...ETQ, fontSize: 18, color: C.azul, textAlign: 'center'}}>{nombre}</div>
			{/* renglones de la ficha (sin cifras: la ficha la recibe quien comenta) */}
			{[0.9, 0.7].map((w, i) => (
				<div key={i} style={{width: `${w * 100}%`, height: 12, borderRadius: 6, background: 'rgba(139,149,168,0.35)', opacity: aparece(frame, en + 8 + i * 4, 6)}} />
			))}
		</div>
	);
};

// ---------- Caja de titular fija arriba (se queda todo el video, como en la referencia) ----------
export const CajaTitular: React.FC<{texto: string; desde?: number; hasta: number; icono?: React.ReactNode}> = ({texto, desde = 0, hasta, icono}) => {
	const frame = useCurrentFrame();
	if (frame < desde || frame >= hasta) return null;
	const sale = interpolate(frame, [hasta - 6, hasta], [0, 1], clamp);
	const late = pulsoBeat(frame);
	return (
		<div
			style={{
				position: 'absolute',
				left: 70,
				top: 270,
				maxWidth: 860,
				display: 'flex',
				alignItems: 'center',
				gap: 18,
				padding: '18px 34px',
				borderRadius: 22,
				background: C.azul,
				boxShadow: `0 0 ${30 + 14 * late}px ${C.brillo}, 0 16px 34px rgba(0,0,0,0.55)`,
				fontFamily: FUENTE,
				fontWeight: 900,
				fontSize: 64,
				lineHeight: 1,
				color: C.tinta,
				transform: `rotate(-1.5deg) scale(${1 + 0.015 * late})`,
				opacity: 1 - sale,
				filter: sale > 0 ? `blur(${sale * 12}px)` : undefined,
				whiteSpace: 'nowrap',
			}}
		>
			{icono}
			{texto}
		</div>
	);
};

// ---------- Regla de precios objetivo: banda de la mayoría y rango completo punteado ----------
export const RangoPrecios: React.FC<{
	en: number;
	min: number;
	max: number;
	banda: {de: number; a: number; enDe: number; enA: number};
	rango: {de: number; a: number; enDe: number; enA: number};
	ancho?: number;
}> = ({en, min, max, banda, rango, ancho = 860}) => {
	const frame = useCurrentFrame();
	const e = useRebote(en);
	const X = (v: number) => 40 + ((v - min) / (max - min)) * (ancho - 80);
	const pB = interpolate(frame, [banda.enDe, banda.enA + 6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const xB0 = X(banda.de);
	const xB1 = X(banda.de) + (X(banda.a) - X(banda.de)) * pB;
	const pR0 = interpolate(frame, [rango.enDe, rango.enDe + 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const pR1 = interpolate(frame, [rango.enA, rango.enA + 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const ticks = [];
	for (let v = Math.ceil(min / 50) * 50; v <= max; v += 50) ticks.push(v);
	const etq = (x: number, y: number, t: string, color: string, op: number, tam = 52, ancla: 'start' | 'middle' | 'end' = 'middle') => (
		<text x={x} y={y} textAnchor={ancla} fill={color} fontFamily={FUENTE} fontWeight={900} fontSize={tam} opacity={op}>
			{t}
		</text>
	);
	return (
		<div style={{width: ancho, height: 380, opacity: aparece(frame, en, 5), transform: `translateY(${(1 - e) * 40}px)`}}>
			<svg width={ancho} height={380} style={{overflow: 'visible'}}>
				<rect x={0} y={0} width={ancho} height={380} rx={28} fill="rgba(15,20,32,0.85)" stroke="rgba(42,157,255,0.38)" strokeWidth={2} />
				<text x={34} y={56} fill={C.gris} fontFamily={FUENTE} fontWeight={800} fontSize={26} letterSpacing="0.22em">
					PRECIOS OBJETIVO · US$
				</text>
				{/* eje */}
				<line x1={40} x2={ancho - 40} y1={230} y2={230} stroke="rgba(255,255,255,0.35)" strokeWidth={4} />
				{ticks.map((v) => (
					<g key={v}>
						<line x1={X(v)} x2={X(v)} y1={222} y2={238} stroke="rgba(255,255,255,0.35)" strokeWidth={3} />
						<text x={X(v)} y={270} textAnchor="middle" fill={C.gris} fontFamily={FUENTE} fontWeight={800} fontSize={22}>
							{v}
						</text>
					</g>
				))}
				{/* rango completo, punteado */}
				<line x1={X(rango.de)} x2={X(rango.de) + (X((rango.de + rango.a) / 2) - X(rango.de)) * pR0 + (X(rango.a) - X((rango.de + rango.a) / 2)) * pR1} y1={310} y2={310} stroke={C.blanco} strokeWidth={5} strokeDasharray="14 10" opacity={pR0} />
				<line x1={X(rango.de)} x2={X(rango.de)} y1={292} y2={328} stroke={C.blanco} strokeWidth={5} opacity={pR0} />
				<line x1={X(rango.a)} x2={X(rango.a)} y1={292} y2={328} stroke={C.blanco} strokeWidth={5} opacity={pR1} />
				{etq(X(rango.de), 360, String(rango.de), C.blanco, pR0, 34)}
				{etq(X(rango.a), 360, String(rango.a), C.blanco, pR1, 34)}
				{/* banda de la mayoría */}
				{pB > 0 ? <rect x={xB0} y={150} width={Math.max(4, xB1 - xB0)} height={80} rx={12} fill={C.azul} style={{filter: `drop-shadow(0 0 16px ${C.brillo})`}} /> : null}
				{etq(xB0 - 14, 210, String(banda.de), C.azul, interpolate(frame, [banda.enDe, banda.enDe + 6], [0, 1], clamp), 52, 'end')}
				{etq(X(banda.a) + 14, 210, String(banda.a), C.azul, interpolate(frame, [banda.enA, banda.enA + 6], [0, 1], clamp), 52, 'start')}
			</svg>
		</div>
	);
};

// ---------- Esquema "no es una línea recta": sube y baja, con flechas rojas en las caídas ----------
// Es un esquema (sin escala ni precios), no la cotización real.
export const LineaNoRecta: React.FC<{en: number; caidas: number[]; ancho?: number; alto?: number}> = ({en, caidas, ancho = 860, alto = 440}) => {
	const frame = useCurrentFrame();
	const puntos: [number, number][] = [
		[0, 340], [90, 300], [170, 320], [250, 220], [320, 150], [380, 260], [460, 230], [540, 120], [600, 90], [660, 210], [740, 160], [860, 60],
	];
	const caidaIdx = [5, 9]; // tramos que bajan
	const dib = interpolate(frame, [en, en + 40], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const d = 'M ' + puntos.map(([x, y]) => `${(x / 860) * ancho} ${(y / 440) * alto}`).join(' L ');
	return (
		<div style={{position: 'relative', width: ancho, height: alto + 40, opacity: aparece(frame, en, 5)}}>
			<svg width={ancho} height={alto} style={{overflow: 'visible'}}>
				<line x1={0} x2={ancho} y1={alto * 0.9} y2={(alto * 0.1)} stroke="rgba(255,255,255,0.35)" strokeWidth={4} strokeDasharray="12 12" opacity={interpolate(frame, [en + 6, en + 16], [0, 1], clamp)} />
				<path d={d} stroke={C.azul} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - dib} style={{filter: `drop-shadow(0 0 14px ${C.brillo})`}} />
				{caidas.map((f, i) => {
					const [x0, y0] = puntos[caidaIdx[i % caidaIdx.length] - 1];
					const s = spring({frame: frame - f, fps: 30, config: {damping: 9, mass: 0.5, stiffness: 170}});
					return frame >= f ? (
						<g key={i} transform={`translate(${(x0 / 860) * ancho + 30} ${(y0 / 440) * alto - 20}) scale(${s})`}>
							<path d="M0 0 L0 60 M-24 38 L0 64 L24 38" stroke={C.rojo} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 12px rgba(255,77,94,0.6))'}} />
						</g>
					) : null;
				})}
			</svg>
			<div style={{position: 'absolute', right: 0, bottom: 0, ...ETQ, fontSize: 20, color: C.gris}}>esquema · no es la cotización real</div>
		</div>
	);
};

// ---------- Pantalla dividida: video o foto de apoyo arriba, gráficos abajo ----------
// Cada tramo cambia de material con un fundido; entra con una cortina desde arriba y sale con fundido.
export type TramoArriba = {desde: number; src: string; etiqueta?: string; velocidad?: number; inicio?: number};
export const FotoArriba: React.FC<{desde: number; hasta: number; tramos: TramoArriba[]; alto?: number}> = ({desde, hasta, tramos, alto = 860}) => {
	const frame = useCurrentFrame();
	if (frame < desde || frame >= hasta) return null;
	const entra = interpolate(frame, [desde, desde + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const sale = interpolate(frame, [hasta - 6, hasta], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: alto, overflow: 'hidden', clipPath: `inset(0 0 ${(1 - entra) * 100}% 0)`, opacity: 1 - sale}}>
			{tramos.map((t, i) => {
				const fin = tramos[i + 1]?.desde ?? hasta;
				if (frame < t.desde - 1 || frame > fin + 8) return null;
				const op = Math.min(interpolate(frame, [t.desde, t.desde + 8], [i === 0 ? 1 : 0, 1], clamp), interpolate(frame, [fin, fin + 8], [1, 0], clamp));
				const zoom = interpolate(frame, [t.desde, fin + 8], [1.04, 1.12], clamp);
				const esVideo = t.src.endsWith('.mp4');
				return (
					<AbsoluteFill key={i} style={{opacity: op}}>
						<AbsoluteFill style={{transform: `scale(${zoom})`}}>
							{esVideo ? (
								<SequenciaVideo desde={t.desde} src={t.src} velocidad={t.velocidad ?? 0.8} inicio={t.inicio ?? 0} />
							) : (
								<Img src={staticFile(t.src)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75) saturate(0.85)'}} />
							)}
						</AbsoluteFill>
						{t.etiqueta ? (
							<div style={{position: 'absolute', left: 70, bottom: 120, ...ETQ, fontSize: 24, color: C.blanco, background: 'rgba(15,20,32,0.75)', padding: '10px 18px', borderRadius: 30, opacity: interpolate(frame, [t.desde + 6, t.desde + 14], [0, 1], clamp)}}>
								{t.etiqueta}
							</div>
						) : null}
					</AbsoluteFill>
				);
			})}
			{/* tinte azul tinta y fundido hacia los gráficos de abajo */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(15,20,32,0.35) 0%, rgba(11,99,214,0.12) 45%, rgba(15,20,32,0.25) 70%, #0f1420 100%)'}} />
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, background: C.azul, boxShadow: `0 0 20px ${C.brillo}`, opacity: 0.6}} />
		</div>
	);
};
const SequenciaVideo: React.FC<{desde: number; src: string; velocidad: number; inicio: number}> = ({desde, src, velocidad, inicio}) => (
	<Sequence from={desde - 1} layout="none">
		<OffthreadVideo src={staticFile(src)} muted playbackRate={velocidad} trimBefore={inicio} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.72) saturate(0.85)'}} />
	</Sequence>
);
