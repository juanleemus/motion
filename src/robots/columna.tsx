// Piezas de la "columna que se va llenando" (estilo ficha por secciones) para Escuela Invora:
// FondoSeccion, SeccionColumna, EtiquetaSeccion, TituloSeccion, FranjaDato, TarjetaClara, FilaCifra,
// Pildora, TarjetaVacia, PanelProbabilidad, Calendario y EncuestaFinal.
// Entran como las de ui.tsx: desliz corto hacia arriba con rebote, en la palabra exacta.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {aparece, C, Cifra, Dinamico, FUENTE, pulsoBeat, SOMBRA, Texto, type Trazo, useRebote, ZONA} from './ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const TINTA85 = 'rgba(15,20,32,0.85)';
const BORDE = '2px solid rgba(42,157,255,0.38)';
const ETIQUETA: React.CSSProperties = {fontFamily: FUENTE, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.22em'};

// Entrada estándar de la columna: sube 40 px con rebote y aparece.
const useEntrada = (en: number) => {
	const frame = useCurrentFrame();
	const r = useRebote(en, {damping: 12, mass: 0.6, stiffness: 150});
	return {
		opacity: aparece(frame, en, 5),
		transform: `translateY(${(1 - r) * 40}px) scale(${interpolate(r, [0, 1], [0.92, 1])})`,
	} as React.CSSProperties;
};
// Flotación suave para que nada se quede quieto.
const useFlota = (en: number, amp = 3, fase = 0) => {
	const frame = useCurrentFrame();
	return Math.sin((frame - en) / 26 + fase) * amp;
};

const resaltar = (texto: string, color: string, brillo?: string) =>
	texto.split(/(\*[^*]+\*)/g).map((p, i) =>
		p.startsWith('*') ? (
			<span key={i} style={{color, textShadow: brillo ? `0 0 20px ${brillo}` : undefined}}>
				{p.slice(1, -1)}
			</span>
		) : (
			<span key={i}>{p}</span>
		),
	);

// ---------- Ícono chico: se dibuja y se rellena de azul ----------
export const IconoMini: React.FC<{trazos: Trazo[]; en: number; tam?: number; trazo?: string; relleno?: string}> = ({trazos, en, tam = 64, trazo = C.blanco, relleno}) => {
	const frame = useCurrentFrame();
	const dibujo = interpolate(frame, [en, en + 10], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const lleno = interpolate(frame, [en + 8, en + 13], [0, 1], clamp);
	return (
		<svg viewBox="-6 -6 112 112" width={tam} height={tam} style={{flexShrink: 0, overflow: 'visible', filter: lleno > 0 ? `drop-shadow(0 0 ${10 * lleno}px ${C.brillo})` : undefined}}>
			{trazos.map((t, i) => (
				<path
					key={i}
					d={t.d}
					pathLength={1}
					fill={relleno && t.relleno ? relleno : t.relleno === 'a' ? C.azul : t.relleno === 'b' ? C.azulOscuro : 'none'}
					fillOpacity={t.relleno ? lleno : 0}
					stroke={trazo}
					strokeWidth={7}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeDasharray="1 1"
					strokeDashoffset={1 - dibujo}
				/>
			))}
		</svg>
	);
};

// ---------- Fondo de sección: video a pantalla completa, oscurecido y teñido ----------
export type TramoFondo = {desde: number; hasta: number; src: string; velocidad?: number; inicio?: number};
export const FondoSeccion: React.FC<{tramos: TramoFondo[]; fundido?: number}> = ({tramos, fundido = 10}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill>
			{tramos.map((t, i) => {
				if (frame < t.desde - 1 || frame > t.hasta + fundido) return null;
				const op = Math.min(
					interpolate(frame, [t.desde, t.desde + fundido], [0, 1], clamp),
					interpolate(frame, [t.hasta, t.hasta + fundido], [1, 0], clamp),
				);
				const zoom = interpolate(frame, [t.desde, t.hasta], [1.04, 1.14], clamp);
				return (
					<AbsoluteFill key={i} style={{opacity: op}}>
						<Sequence from={t.desde} durationInFrames={t.hasta + fundido - t.desde + 1} layout="none">
							<AbsoluteFill style={{transform: `scale(${zoom})`}}>
								<OffthreadVideo
									src={staticFile(t.src)}
									muted
									playbackRate={t.velocidad ?? 0.7}
									trimBefore={t.inicio ?? 0}
									style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.42) saturate(0.75) contrast(1.05)'}}
								/>
							</AbsoluteFill>
						</Sequence>
						{/* tinte azul tinta + viñeta */}
						<AbsoluteFill style={{background: 'rgba(15,20,32,0.38)', mixBlendMode: 'multiply'}} />
						<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(11,99,214,0.16), rgba(15,20,32,0.25))'}} />
						<AbsoluteFill
							style={{background: 'radial-gradient(ellipse 80% 65% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)'}}
						/>
					</AbsoluteFill>
				);
			})}
		</AbsoluteFill>
	);
};

// ---------- Columna de una sección: arriba a la izquierda, sale con desvanecido + desenfoque ----------
export const SeccionColumna: React.FC<{desde: number; hasta: number; gap?: number; top?: number; children: React.ReactNode}> = ({
	desde,
	hasta,
	gap = 40,
	top = ZONA.y0,
	children,
}) => {
	const frame = useCurrentFrame();
	if (frame < desde || frame >= hasta) return null;
	const s = interpolate(frame, [hasta - 6, hasta], [0, 1], clamp);
	return (
		<AbsoluteFill style={{opacity: 1 - s, filter: s > 0 ? `blur(${s * 14}px)` : undefined}}>
			<div
				style={{
					position: 'absolute',
					left: ZONA.x0,
					top,
					width: ZONA.x1 - ZONA.x0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					gap,
				}}
			>
				{children}
			</div>
		</AbsoluteFill>
	);
};

// ---------- Etiqueta de contexto (píldora azul, MAYÚSCULA espaciada) ----------
export const EtiquetaSeccion: React.FC<{texto: string; en: number; tam?: number}> = ({texto, en, tam = 34}) => {
	const frame = useCurrentFrame();
	const e = useEntrada(en);
	const brilloX = interpolate(frame - en, [6, 24], [-40, 140], clamp);
	return (
		<div
			style={{
				...ETIQUETA,
				...e,
				position: 'relative',
				overflow: 'hidden',
				fontSize: tam,
				color: C.tinta,
				background: C.azul,
				borderRadius: 60,
				padding: `${tam * 0.42}px ${tam * 0.9}px`,
				boxShadow: `0 0 ${24 + 10 * pulsoBeat(frame)}px ${C.brillo}, 0 10px 24px rgba(0,0,0,0.5)`,
				whiteSpace: 'nowrap',
			}}
		>
			{texto}
			<div
				style={{
					position: 'absolute',
					top: -20,
					bottom: -20,
					left: `${brilloX}%`,
					width: '22%',
					background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))',
					transform: 'rotate(18deg)',
				}}
			/>
		</div>
	);
};

// ---------- Logo chico en tarjeta blanca (para titulares y tarjetas) ----------
export const LogoChico: React.FC<{archivo: string; en: number; alto?: number; ancho?: number; caja?: number}> = ({archivo, en, alto = 70, ancho, caja}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en, {damping: 10, mass: 0.7, stiffness: 150});
	return (
		<div
			style={{
				flexShrink: 0,
				background: C.blanco,
				borderRadius: 26,
				padding: 20,
				minWidth: caja,
				minHeight: caja,
				boxSizing: 'border-box',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				boxShadow: `0 14px 34px rgba(0,0,0,0.6), 0 0 ${36 + 12 * pulsoBeat(frame)}px ${C.brillo}`,
				transform: `scale(${interpolate(r, [0, 1], [0.4, 1])}) rotate(${interpolate(r, [0, 1], [-8, 0])}deg)`,
				opacity: aparece(frame, en, 4),
			}}
		>
			<Img src={staticFile(`logos/${archivo}`)} style={{height: alto, width: ancho, objectFit: 'contain', display: 'block'}} />
		</div>
	);
};

// ---------- Titular de sección: ícono (o logo) + texto grande a la izquierda ----------
export const TituloSeccion: React.FC<{
	texto: string;
	en: number;
	icono?: Trazo[];
	logo?: {archivo: string; alto?: number; ancho?: number; en?: number};
	tam?: number;
	sinEntrada?: boolean;
}> = ({texto, en, icono, logo, tam = 86, sinEntrada}) => {
	const flota = useFlota(en, 3);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 28, width: '100%', transform: `translateY(${flota}px)`}}>
			{logo ? <LogoChico archivo={logo.archivo} alto={logo.alto ?? 64} ancho={logo.ancho} en={logo.en ?? en} /> : null}
			{icono ? <IconoMini trazos={icono} en={en} tam={tam * 1.05} /> : null}
			<Texto en={en} tam={tam} sinEntrada={sinEntrada} ancho={icono || logo ? 700 : 860} style={{textAlign: 'left', lineHeight: 1.04, flex: 1, minWidth: 0}}>
				{texto}
			</Texto>
		</div>
	);
};

// ---------- Franja de dato: banda oscura con número grande y etiquetas chicas ----------
export const FranjaDato: React.FC<{en: number; dato: React.ReactNode; etiquetas: string[]; icono?: Trazo[]}> = ({en, dato, etiquetas, icono}) => {
	const e = useEntrada(en);
	const frame = useCurrentFrame();
	const flota = useFlota(en, 3, 1);
	return (
		<div
			style={{
				...e,
				width: '100%',
				boxSizing: 'border-box',
				background: TINTA85,
				border: BORDE,
				borderRadius: 26,
				padding: '22px 34px',
				display: 'flex',
				alignItems: 'center',
				gap: 30,
				boxShadow: '0 16px 40px rgba(0,0,0,0.55)',
				marginTop: flota,
			}}
		>
			{icono ? <IconoMini trazos={icono} en={en + 2} tam={92} /> : null}
			<div style={{flexShrink: 0}}>{dato}</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
				{etiquetas.map((t, i) => (
					<div key={i} style={{...ETIQUETA, fontSize: 31, color: i === 0 ? C.blanco : C.gris, opacity: aparece(frame, en + 6 + i * 4, 5)}}>
						{t}
					</div>
				))}
			</div>
		</div>
	);
};

// ---------- Tarjeta clara: fondo blanco, texto tinta, palabra clave en azul oscuro ----------
export const TarjetaClara: React.FC<{
	en: number;
	texto: string;
	icono?: Trazo[];
	logo?: {archivo: string; alto?: number; ancho?: number};
	tam?: number;
	ancho?: number | string;
}> = ({en, texto, icono, logo, tam = 54, ancho = '100%'}) => {
	const e = useEntrada(en);
	const frame = useCurrentFrame();
	const flota = useFlota(en, 3, 2);
	return (
		<div
			style={{
				...e,
				width: ancho,
				boxSizing: 'border-box',
				background: C.blanco,
				borderRadius: 28,
				padding: '30px 36px',
				display: 'flex',
				alignItems: 'center',
				gap: 30,
				boxShadow: `0 18px 44px rgba(0,0,0,0.6), 0 0 ${30 + 10 * pulsoBeat(frame)}px rgba(42,157,255,0.35)`,
				marginTop: flota,
			}}
		>
			{logo ? <Img src={staticFile(`logos/${logo.archivo}`)} style={{height: logo.alto ?? 60, width: logo.ancho, objectFit: 'contain', flexShrink: 0}} /> : null}
			{icono ? (
				<div style={{width: 108, height: 108, borderRadius: 54, background: C.tinta, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
					<IconoMini trazos={icono} en={en + 3} tam={68} />
				</div>
			) : null}
			<div style={{fontFamily: FUENTE, fontWeight: 800, fontSize: tam, lineHeight: 1.12, color: C.tinta}}>{resaltar(texto, C.azulOscuro)}</div>
		</div>
	);
};

// ---------- Fila de cifra: etiqueta corta a la izquierda y cifra grande a la derecha ----------
export const FilaCifra: React.FC<{en: number; etiqueta: string; cifra: React.ReactNode}> = ({en, etiqueta, cifra}) => {
	const e = useEntrada(en);
	return (
		<div
			style={{
				...e,
				width: '100%',
				boxSizing: 'border-box',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 24,
				padding: '20px 34px',
				background: TINTA85,
				border: BORDE,
				borderRadius: 26,
				boxShadow: '0 16px 40px rgba(0,0,0,0.55)',
			}}
		>
			<div style={{...ETIQUETA, fontSize: 32, color: C.blanco, lineHeight: 1.3, maxWidth: 400}}>{etiqueta}</div>
			<div>{cifra}</div>
		</div>
	);
};

// ---------- Píldora inclinada con ícono (aviso o conclusión corta) ----------
export const Pildora: React.FC<{
	en: number;
	texto: string;
	icono?: Trazo[];
	tipo?: 'aviso' | 'negativo' | 'acento';
	giro?: number;
	tam?: number;
	style?: React.CSSProperties;
}> = ({en, texto, icono, tipo = 'aviso', giro = -2, tam = 50, style}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en, {damping: 10, mass: 0.6, stiffness: 160});
	const fondo = tipo === 'negativo' ? C.rojo : tipo === 'acento' ? C.azul : C.azulOscuro;
	const texto_c = tipo === 'acento' ? C.tinta : C.blanco;
	const brillo = tipo === 'negativo' ? 'rgba(255,77,94,0.55)' : C.brillo;
	const flota = useFlota(en, 4, 3);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 18,
				padding: `${tam * 0.36}px ${tam * 0.75}px ${tam * 0.36}px ${tam * 0.45}px`,
				borderRadius: 80,
				background: fondo,
				boxShadow: `0 14px 30px rgba(0,0,0,0.55), 0 0 ${26 + 10 * pulsoBeat(frame)}px ${brillo}`,
				fontFamily: FUENTE,
				fontWeight: 800,
				fontSize: tam,
				color: texto_c,
				whiteSpace: 'nowrap',
				transform: `translateY(${(1 - r) * 40 + flota}px) rotate(${interpolate(r, [0, 1], [giro * 4, giro])}deg) scale(${interpolate(r, [0, 1], [0.6, 1])})`,
				opacity: aparece(frame, en, 4),
				...style,
			}}
		>
			{icono ? <IconoMini trazos={icono} en={en + 2} tam={tam * 1.2} trazo={tipo === 'acento' ? C.tinta : C.blanco} relleno={tipo === 'negativo' ? C.tinta : undefined} /> : null}
			<span>
				{tipo === 'acento'
					? resaltar(texto, C.blanco)
					: texto.split(/(\*[^*]+\*)/g).map((p, i) =>
							p.startsWith('*') ? (
								<span key={i} style={{background: tipo === 'negativo' ? C.tinta : C.azul, color: tipo === 'negativo' ? C.blanco : C.tinta, borderRadius: 14, padding: '0 14px', margin: '0 2px'}}>
									{p.slice(1, -1)}
								</span>
							) : (
								<span key={i}>{p}</span>
							),
						)}
			</span>
		</div>
	);
};

// ---------- Tarjeta vacía con "?" que se llena cuando se nombra a alguien ----------
export const TarjetaVacia: React.FC<{en: number; llenaEn: number; nombre: string; sub?: string; foto?: string; ancho?: number}> = ({
	en,
	llenaEn,
	nombre,
	sub,
	foto,
	ancho = 262,
}) => {
	const frame = useCurrentFrame();
	const e = useEntrada(en);
	const {fps} = useVideoConfig();
	const r = spring({frame: frame - llenaEn, fps, config: {damping: 10, mass: 0.6, stiffness: 160}});
	const lleno = frame >= llenaEn;
	const flota = useFlota(en, 4, ancho);
	return (
		<div
			style={{
				...e,
				width: ancho,
				height: 400,
				borderRadius: 28,
				boxSizing: 'border-box',
				border: lleno ? `3px solid ${C.azul}` : '4px dashed rgba(255,255,255,0.55)',
				background: lleno ? TINTA85 : 'rgba(15,20,32,0.45)',
				boxShadow: lleno ? `0 0 ${30 + 10 * pulsoBeat(frame)}px ${C.brillo}, 0 16px 40px rgba(0,0,0,0.55)` : undefined,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 16,
				fontFamily: FUENTE,
				marginTop: flota,
			}}
		>
			{!lleno ? (
				<div style={{fontWeight: 900, fontSize: 130, color: 'rgba(255,255,255,0.55)', transform: `rotate(${Math.sin(frame / 8) * 5}deg)`}}>?</div>
			) : (
				<>
					<div
						style={{
							width: 200,
							height: 200,
							borderRadius: 100,
							overflow: 'hidden',
							border: `4px solid ${C.azul}`,
							background: C.azulOscuro,
							transform: `scale(${interpolate(r, [0, 1], [0.3, 1])})`,
							position: 'relative',
						}}
					>
						{foto ? (
							<>
								<Img src={staticFile(foto)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 18%', filter: 'saturate(0.8)'}} />
								<div style={{position: 'absolute', inset: 0, background: 'rgba(11,99,214,0.18)', mixBlendMode: 'multiply'}} />
							</>
						) : null}
					</div>
					<div style={{fontWeight: 900, fontSize: nombre.length > 8 ? 40 : 50, lineHeight: 1.05, textAlign: 'center', color: C.blanco, textShadow: SOMBRA, transform: `translateY(${(1 - r) * 20}px)`, opacity: r}}>{nombre}</div>
					{sub ? <div style={{...ETIQUETA, fontSize: 26, color: C.gris, opacity: aparece(frame, llenaEn + 5, 5)}}>{sub}</div> : null}
				</>
			)}
		</div>
	);
};

// ---------- Panel de probabilidad: barras que se llenan, marca en el 50 % ----------
export type FilaProb = {etiqueta: string; valor: number; texto: string; llenaEn: number; sentido?: 'sube' | 'baja'};
export const PanelProbabilidad: React.FC<{en: number; titulo: string; filas: FilaProb[]}> = ({en, titulo, filas}) => {
	const frame = useCurrentFrame();
	const e = useEntrada(en);
	return (
		<div
			style={{
				...e,
				width: '100%',
				boxSizing: 'border-box',
				background: TINTA85,
				border: BORDE,
				borderRadius: 28,
				padding: '26px 34px 30px',
				display: 'flex',
				flexDirection: 'column',
				gap: 22,
				boxShadow: '0 16px 40px rgba(0,0,0,0.55)',
				fontFamily: FUENTE,
			}}
		>
			<div style={{...ETIQUETA, fontSize: 28, color: C.gris}}>{titulo}</div>
			{filas.map((f, i) => {
				const p = interpolate(frame, [f.llenaEn - 12, f.llenaEn + 8], [0, f.valor], {...clamp, easing: Easing.out(Easing.cubic)});
				const color = f.sentido === 'baja' ? C.rojo : C.azul;
				const listo = frame >= f.llenaEn + 8;
				return (
					<div key={i} style={{display: 'flex', flexDirection: 'column', gap: 12}}>
						<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
							<span style={{fontWeight: 800, fontSize: 46, color: C.blanco}}>{f.etiqueta}</span>
							<span style={{...ETIQUETA, fontSize: 36, color, opacity: listo ? 1 : 0, textShadow: `0 0 18px ${f.sentido === 'baja' ? 'rgba(255,77,94,0.55)' : C.brillo}`}}>
								{f.texto}
							</span>
						</div>
						<div style={{position: 'relative', height: 56, borderRadius: 28, background: 'rgba(255,255,255,0.1)'}}>
							<div
								style={{
									width: `${p * 100}%`,
									height: '100%',
									borderRadius: 28,
									background: f.sentido === 'baja' ? `linear-gradient(90deg, #b3283a, ${C.rojo})` : `linear-gradient(90deg, ${C.azulOscuro}, ${C.azul})`,
									boxShadow: listo ? `0 0 ${18 + 12 * pulsoBeat(frame)}px ${f.sentido === 'baja' ? 'rgba(255,77,94,0.55)' : C.brillo}` : undefined,
								}}
							/>
							<div style={{position: 'absolute', left: '50%', top: -8, bottom: -8, width: 4, borderRadius: 2, background: C.blanco, opacity: 0.85}} />
							<div style={{...ETIQUETA, position: 'absolute', left: '50%', top: 68, transform: 'translateX(-50%)', fontSize: 24, color: C.gris, letterSpacing: '0.18em'}}>50 %</div>
						</div>
					</div>
				);
			})}
			<div style={{height: 30}} />
		</div>
	);
};

// ---------- Calendario de tarjetas (MAR 17 · MIÉ 18 · JUE 19) ----------
export type DiaCal = {dia: string; num: string; en: number; icono?: Trazo[]; nota?: string; logo?: string};
export const Calendario: React.FC<{dias: DiaCal[]; ancho?: number; alto?: number}> = ({dias, ancho = 262, alto = 300}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', gap: 37}}>
			{dias.map((d, i) => {
				const r = spring({frame: frame - d.en, fps: 30, config: {damping: 11, mass: 0.6, stiffness: 150}});
				const flota = Math.sin((frame - d.en) / 24 + i) * 4;
				return (
					<div
						key={i}
						style={{
							width: ancho,
							height: alto,
							borderRadius: 28,
							overflow: 'hidden',
							background: C.blanco,
							boxShadow: `0 18px 44px rgba(0,0,0,0.6), 0 0 ${30 + 10 * pulsoBeat(frame)}px rgba(42,157,255,0.4)`,
							display: 'flex',
							flexDirection: 'column',
							opacity: aparece(frame, d.en, 4),
							transform: `translateY(${(1 - r) * 60 + flota}px) rotate(${interpolate(r, [0, 1], [i % 2 ? 8 : -8, 0])}deg) scale(${interpolate(r, [0, 1], [0.6, 1])})`,
							fontFamily: FUENTE,
						}}
					>
						<div style={{...ETIQUETA, background: C.azul, color: C.tinta, fontSize: 30, textAlign: 'center', padding: '14px 0', letterSpacing: '0.28em'}}>{d.dia}</div>
						<div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10}}>
							<div style={{fontWeight: 900, fontSize: d.nota ? 84 : 110, color: C.tinta, lineHeight: 1}}>{d.num}</div>
							{d.icono ? (
								<div style={{width: 76, height: 76, borderRadius: 38, background: C.tinta, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<IconoMini trazos={d.icono} en={d.en + 4} tam={48} />
								</div>
							) : null}
							{d.nota ? <div style={{...ETIQUETA, fontSize: 22, color: C.azulOscuro, letterSpacing: '0.14em'}}>{d.nota}</div> : null}
						</div>
					</div>
				);
			})}
		</div>
	);
};

// ---------- Encuesta final: ▲ Sube / ▼ Cae ----------
const Flecha: React.FC<{abajo?: boolean; color: string; tam: number}> = ({abajo, color, tam}) => (
	<svg viewBox="0 0 100 100" width={tam} height={tam}>
		<path d={abajo ? 'M50 86 L92 18 H8Z' : 'M50 14 L92 82 H8Z'} fill={color} stroke={color} strokeWidth={8} strokeLinejoin="round" />
	</svg>
);
export const EncuestaFinal: React.FC<{subeEn: number; caeEn: number; votoEn?: number}> = ({subeEn, caeEn}) => {
	const frame = useCurrentFrame();
	const boton = (en: number, abajo: boolean) => {
		const r = spring({frame: frame - en, fps: 30, config: {damping: 9, mass: 0.6, stiffness: 170}});
		const color = abajo ? C.rojo : C.azul;
		const brillo = abajo ? 'rgba(255,77,94,0.6)' : C.brillo;
		const late = frame >= en ? pulsoBeat(frame) : 0;
		return (
			<div
				style={{
					width: 405,
					height: 210,
					borderRadius: 40,
					background: color,
					boxShadow: `0 ${16 - 6 * late}px 0 ${abajo ? '#a82033' : C.azulOscuro}, 0 26px 50px rgba(0,0,0,0.55), 0 0 ${40 + 20 * late}px ${brillo}`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 22,
					opacity: aparece(frame, en, 4),
					transform: `translateY(${(1 - r) * 70 + 6 * late}px) scale(${interpolate(r, [0, 1], [0.5, 1])}) rotate(${(1 - r) * (abajo ? 6 : -6)}deg)`,
					fontFamily: FUENTE,
					fontWeight: 900,
					fontSize: 86,
					color: C.tinta,
				}}
			>
				<Flecha abajo={abajo} color={C.tinta} tam={78} />
				{abajo ? 'Cae' : 'Sube'}
			</div>
		);
	};
	return (
		<div style={{display: 'flex', gap: 50}}>
			{boton(subeEn, false)}
			{boton(caeEn, true)}
		</div>
	);
};

export {Dinamico};
