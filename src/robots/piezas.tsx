// Piezas de la biblioteca frase → animación: chat de INVORA, teclas 3D,
// sí/no, tachado, cuadrícula de íconos y notificación.
import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FUENTE, SOMBRA, aparece, useRebote} from './ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const resaltar = (t: string) =>
	t.split(/(\*[^*]+\*)/g).map((p, i) =>
		p.startsWith('*') ? (
			<span key={i} style={{color: C.azul}}>
				{p.slice(1, -1)}
			</span>
		) : (
			<span key={i}>{p}</span>
		),
	);

// Cantidad de letras escritas en el chat en cada fotograma.
export const letrasEscritas = (frame: number, desde: number, hasta: number, total: number) =>
	Math.round(interpolate(frame, [desde, hasta], [0, total], clamp));

// ---------- Chat de INVORA que se escribe solo ----------
export const ChatInvora: React.FC<{
	en: number;
	pregunta: string;
	escribeDesde: number;
	escribeHasta: number;
	respondeEn?: number;
	respuesta?: string;
	respuestaEn?: number;
}> = ({en, pregunta, escribeDesde, escribeHasta, respondeEn, respuesta, respuestaEn}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en);
	const n = letrasEscritas(frame, escribeDesde, escribeHasta, pregunta.length);
	const escribiendo = frame < escribeHasta;
	const cursor = escribiendo && Math.floor(frame / 8) % 2 === 0;
	const enviado = frame >= escribeHasta;
	const rEnvio = useRebote(escribeHasta);
	const rResp = useRebote(respondeEn ?? 99999);
	const rTexto = useRebote(respuestaEn ?? 99999);
	return (
		<div
			style={{
				width: 840,
				borderRadius: 40,
				background: 'rgba(16,22,36,0.94)',
				border: '2px solid rgba(42,157,255,0.4)',
				boxShadow: `0 24px 60px rgba(0,0,0,0.7), 0 0 50px rgba(42,157,255,0.25)`,
				padding: 36,
				fontFamily: FUENTE,
				transform: `scale(${interpolate(r, [0, 1], [0.7, 1])})`,
				opacity: aparece(frame, en, 5),
				display: 'flex',
				flexDirection: 'column',
				gap: 26,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
				<div style={{width: 16, height: 16, borderRadius: 8, background: C.azul, boxShadow: `0 0 12px ${C.brillo}`}} />
				<div style={{fontWeight: 500, fontSize: 32, letterSpacing: '0.32em', color: C.blanco}}>INVORA</div>
			</div>
			{/* burbuja del usuario */}
			<div style={{display: 'flex', justifyContent: 'flex-end', minHeight: 190}}>
				<div
					style={{
						maxWidth: 680,
						background: enviado ? C.azul : 'rgba(255,255,255,0.08)',
						color: enviado ? C.tinta : C.blanco,
						borderRadius: '32px 32px 8px 32px',
						padding: '24px 30px',
						fontWeight: 800,
						fontSize: 40,
						lineHeight: 1.2,
						transform: enviado ? `scale(${interpolate(rEnvio, [0, 1], [0.94, 1])})` : undefined,
						boxShadow: enviado ? `0 0 30px ${C.brillo}` : undefined,
						opacity: frame >= escribeDesde ? 1 : 0,
					}}
				>
					{pregunta.slice(0, n)}
					<span style={{opacity: cursor ? 1 : 0}}>|</span>
				</div>
			</div>
			{/* respuesta de Invora */}
			<div style={{display: 'flex', justifyContent: 'flex-start', minHeight: 96}}>
				{respondeEn !== undefined && frame >= respondeEn ? (
					<div
						style={{
							background: 'rgba(255,255,255,0.1)',
							borderRadius: '32px 32px 32px 8px',
							padding: '24px 30px',
							transform: `scale(${interpolate(rResp, [0, 1], [0.6, 1])})`,
							transformOrigin: 'left center',
							fontWeight: 800,
							fontSize: 40,
							color: C.blanco,
						}}
					>
						{respuesta && respuestaEn !== undefined && frame >= respuestaEn ? (
							<span style={{display: 'inline-block', transform: `scale(${interpolate(rTexto, [0, 1], [0.8, 1])})`}}>
								{resaltar(respuesta)}
							</span>
						) : (
							<span style={{display: 'flex', gap: 12, padding: '10px 4px'}}>
								{[0, 1, 2].map((i) => (
									<span
										key={i}
										style={{
											width: 16,
											height: 16,
											borderRadius: 8,
											background: C.gris,
											transform: `translateY(${Math.sin((frame - respondeEn) / 4 - i) * 6}px)`,
										}}
									/>
								))}
							</span>
						)}
					</div>
				) : null}
			</div>
		</div>
	);
};

// ---------- Teclas 3D que escriben la palabra ----------
export const Teclas: React.FC<{palabra: string; en: number; paso?: number}> = ({palabra, en, paso = 5}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div style={{display: 'flex', gap: 22}}>
			{palabra.split('').map((l, i) => {
				const t = en + i * paso;
				const entra = spring({frame: frame - (en - 6 + i * 2), fps, config: {damping: 12, mass: 0.5}});
				const baja = interpolate(frame, [t, t + 2, t + 6], [0, 1, 0], clamp);
				const marcada = frame >= t;
				return (
					<div
						key={i}
						style={{
							width: 150,
							height: 150,
							borderRadius: 30,
							background: marcada ? C.azul : '#1d2638',
							boxShadow: `0 ${16 - baja * 12}px 0 ${marcada ? C.azulOscuro : '#0b0f19'}, 0 ${26 - baja * 12}px 40px rgba(0,0,0,0.6)${
								marcada ? `, 0 0 40px ${C.brillo}` : ''
							}`,
							transform: `translateY(${baja * 12}px) scale(${interpolate(entra, [0, 1], [0.5, 1])})`,
							opacity: aparece(frame, en - 6 + i * 2, 4),
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: FUENTE,
							fontWeight: 900,
							fontSize: 84,
							color: marcada ? C.tinta : C.blanco,
						}}
					>
						{l}
					</div>
				);
			})}
		</div>
	);
};

// ---------- Comentario enviado + notificación de INVORA ----------
export const Notificacion: React.FC<{en: number; titulo: string; texto: string}> = ({en, titulo, texto}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en, {damping: 13, mass: 0.6, stiffness: 120});
	return (
		<div
			style={{
				width: 820,
				borderRadius: 36,
				background: 'rgba(245,248,255,0.97)',
				boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 40px ${C.brillo}`,
				padding: '26px 30px',
				display: 'flex',
				alignItems: 'center',
				gap: 24,
				fontFamily: FUENTE,
				transform: `translateY(${interpolate(r, [0, 1], [-60, 0])}px) scale(${interpolate(r, [0, 1], [0.85, 1])})`,
				opacity: aparece(frame, en, 5),
			}}
		>
			<div
				style={{
					width: 96,
					height: 96,
					borderRadius: 24,
					background: C.tinta,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexShrink: 0,
				}}
			>
				<div style={{fontWeight: 500, fontSize: 52, color: C.blanco}}>I</div>
			</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
				<div style={{fontWeight: 500, fontSize: 28, letterSpacing: '0.32em', color: C.tinta}}>{titulo}</div>
				<div style={{fontWeight: 800, fontSize: 38, color: C.tinta, lineHeight: 1.15}}>{resaltar(texto)}</div>
			</div>
		</div>
	);
};

export const Comentario: React.FC<{en: number; texto: string; enviaEn: number}> = ({en, texto, enviaEn}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en);
	const sube = interpolate(frame, [enviaEn, enviaEn + 8], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 18,
				width: 760,
				padding: '20px 24px 20px 34px',
				borderRadius: 60,
				background: 'rgba(255,255,255,0.1)',
				border: '2px solid rgba(255,255,255,0.25)',
				fontFamily: FUENTE,
				transform: `scale(${interpolate(r, [0, 1], [0.7, 1])})`,
				opacity: aparece(frame, en, 4),
			}}
		>
			<div
				style={{
					flex: 1,
					fontWeight: 800,
					fontSize: 46,
					color: C.blanco,
					transform: `translateY(${-sube * 80}px)`,
					opacity: 1 - sube,
				}}
			>
				{texto}
			</div>
			<div
				style={{
					width: 80,
					height: 80,
					borderRadius: 40,
					background: C.azul,
					boxShadow: frame >= enviaEn ? `0 0 30px ${C.brillo}` : undefined,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<svg viewBox="0 0 24 24" width={40} height={40}>
					<path d="M4 12 L20 4 L14 20 L11 13 Z" fill={C.tinta} />
				</svg>
			</div>
		</div>
	);
};

// ---------- Sí / no ----------
export const SiNo: React.FC<{si: number; no: number; etiquetaSi: string; subSi?: string; etiquetaNo: string}> = ({
	si,
	no,
	etiquetaSi,
	subSi,
	etiquetaNo,
}) => {
	const frame = useCurrentFrame();
	const rs = useRebote(si);
	const rn = useRebote(no);
	const fila = (r: number, color: string, marca: React.ReactNode, titulo: string, sub: string | undefined, desde: number) => (
		<div style={{display: 'flex', alignItems: 'center', gap: 34, opacity: aparece(frame, desde, 4)}}>
			<div
				style={{
					width: 190,
					height: 190,
					borderRadius: 95,
					background: color,
					boxShadow: `0 0 50px ${color === C.azul ? C.brillo : 'rgba(255,77,94,0.55)'}, 0 16px 30px rgba(0,0,0,0.5)`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transform: `scale(${interpolate(r, [0, 1], [0.4, 1])})`,
					flexShrink: 0,
				}}
			>
				{marca}
			</div>
			<div style={{fontFamily: FUENTE, color: C.blanco, textShadow: SOMBRA, width: 420}}>
				<div style={{fontWeight: 900, fontSize: 72, lineHeight: 1}}>{titulo}</div>
				{sub ? <div style={{fontWeight: 800, fontSize: 44, color: C.azul, marginTop: 10}}>{sub}</div> : null}
			</div>
		</div>
	);
	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: 70}}>
			{fila(
				rs,
				C.azul,
				<svg viewBox="0 0 24 24" width={110} height={110}>
					<path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke={C.tinta} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
				</svg>,
				etiquetaSi,
				subSi,
				si,
			)}
			{fila(
				rn,
				C.rojo,
				<svg viewBox="0 0 24 24" width={100} height={100}>
					<path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke={C.tinta} strokeWidth={3.4} strokeLinecap="round" />
				</svg>,
				etiquetaNo,
				undefined,
				no,
			)}
		</div>
	);
};

// ---------- Frase que se tacha en rojo y se cae ----------
export const Tachado: React.FC<{texto: string; en: number; tachaEn: number; caeEn?: number; tam?: number}> = ({
	texto,
	en,
	tachaEn,
	caeEn,
	tam = 76,
}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en);
	const linea = interpolate(frame, [tachaEn, tachaEn + 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const cae = caeEn === undefined ? 0 : interpolate(frame, [caeEn, caeEn + 14], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	return (
		<div
			style={{
				position: 'relative',
				fontFamily: FUENTE,
				fontWeight: 900,
				fontSize: tam,
				lineHeight: 1.08,
				color: frame >= tachaEn ? 'rgba(255,255,255,0.75)' : C.blanco,
				textShadow: SOMBRA,
				textAlign: 'center',
				transform: `scale(${interpolate(r, [0, 1], [0.6, 1])}) translateY(${cae * 420}px) rotate(${cae * 9}deg)`,
				opacity: aparece(frame, en, 5) * (1 - cae),
			}}
		>
			{texto.split('\n').map((l, i, arr) => (
				<div key={i} style={{position: 'relative', display: 'block'}}>
					<span style={{position: 'relative', display: 'inline-block'}}>
						{l}
						<span
							style={{
								position: 'absolute',
								left: -12,
								top: '52%',
								height: 12,
								borderRadius: 6,
								background: C.rojo,
								boxShadow: '0 0 18px rgba(255,77,94,0.6)',
								width: `calc(${Math.max(0, Math.min(1, linea * arr.length - i)) * 100}% + 24px)`,
								opacity: linea * arr.length - i > 0 ? 1 : 0,
							}}
						/>
					</span>
				</div>
			))}
		</div>
	);
};

// ---------- Cuadrícula de piezas que aparecen una por una ----------
export const Cuadricula: React.FC<{
	cantidad: number;
	columnas: number;
	en: number;
	paso?: number;
	tam: number;
	gap?: number;
	pieza: (i: number, encendida: boolean) => React.ReactNode;
	destacada?: {indice: number; en: number};
}> = ({cantidad, columnas, en, paso = 3, tam, gap = 26, pieza, destacada}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const filas = Math.ceil(cantidad / columnas);
	const ancho = columnas * tam + (columnas - 1) * gap;
	const alto = filas * tam + (filas - 1) * gap;
	const d = destacada ? interpolate(frame, [destacada.en, destacada.en + 12], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 0;
	return (
		<div style={{position: 'relative', width: ancho, height: alto}}>
			{Array.from({length: cantidad}).map((_, i) => {
				const fila = Math.floor(i / columnas);
				const col = i % columnas;
				const x = col * (tam + gap);
				const y = fila * (tam + gap);
				const r = spring({frame: frame - (en + i * paso), fps, config: {damping: 11, mass: 0.5, stiffness: 150}});
				const esDest = destacada?.indice === i;
				const cx = ancho / 2 - tam / 2;
				const cy = alto / 2 - tam / 2;
				const tx = esDest ? interpolate(d, [0, 1], [x, cx]) : x;
				const ty = esDest ? interpolate(d, [0, 1], [y, cy]) : y;
				const esc = interpolate(r, [0, 1], [0.4, 1]) * (esDest ? 1 + 0.6 * d : 1 - 0.4 * d);
				const op = aparece(frame, en + i * paso, 4) * (esDest ? 1 : 1 - d);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: tx,
							top: ty,
							width: tam,
							height: tam,
							transform: `scale(${esc})`,
							opacity: op,
							zIndex: esDest ? 2 : 1,
						}}
					>
						{pieza(i, esDest && d > 0.5)}
					</div>
				);
			})}
		</div>
	);
};

// Línea roja que tacha un bloque completo (por ejemplo, las 10 apps).
export const RayaRoja: React.FC<{en: number; ancho: number; alto: number; hasta?: number}> = ({en, ancho, alto, hasta}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [en, en + 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const fuera = hasta === undefined ? 1 : interpolate(frame, [hasta, hasta + 6], [1, 0], clamp);
	const largo = Math.hypot(ancho, alto) * 0.92;
	const ang = (Math.atan2(alto, ancho) * 180) / Math.PI;
	return (
		<div
			style={{
				position: 'absolute',
				left: (ancho - largo) / 2,
				top: alto / 2 - 8,
				width: largo,
				height: 16,
				borderRadius: 8,
				background: C.rojo,
				boxShadow: '0 0 24px rgba(255,77,94,0.7)',
				transform: `rotate(${-ang}deg) scaleX(${p})`,
				opacity: p > 0 ? fuera : 0,
				zIndex: 5,
			}}
		/>
	);
};
