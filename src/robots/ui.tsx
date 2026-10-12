// Piezas reutilizables de Escuela Invora: Texto con *resaltado*, Logo, Cifra,
// Icono, Insignia, Escena, Columna, LogoInvora y Fondo.
import React from 'react';
import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

export const C = {
	azul: '#2a9dff',
	azulOscuro: '#0b63d6',
	tinta: '#0f1420',
	gris: '#8b95a8',
	rojo: '#ff4d5e',
	blanco: '#ffffff',
	brillo: 'rgba(42,157,255,0.6)',
};
export const SOMBRA = '0 6px 16px rgba(0,0,0,0.9)';
export const FUENTE = 'Montserrat';

// Zonas seguras: contenido entre x 70–930 e y 300–1520.
export const ZONA = {x0: 70, x1: 930, y0: 300, y1: 1520};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Rebote estándar de la marca.
export const useRebote = (desde: number, config = {damping: 11, mass: 0.6, stiffness: 140}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - desde, fps, config});
};

export const aparece = (frame: number, desde: number, dur = 6) =>
	interpolate(frame, [desde, desde + dur], [0, 1], clamp);

// ---------- Fondo ----------
export const Fondo: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const zoom = interpolate(frame, [0, durationInFrames], [1, 1.12], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: C.tinta}}>
			<Img
				src={staticFile('fondo-cuadricula.png')}
				style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}}
			/>
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 75% 60% at 50% 48%, rgba(70,110,180,0.16) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.62) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};

// ---------- Escena ----------
// Muestra su contenido entre `desde` y `hasta`; sale con desvanecido y desenfoque de 0,2 s.
export const Escena: React.FC<{desde: number; hasta: number; children: React.ReactNode; salida?: boolean}> = ({
	desde,
	hasta,
	children,
	salida = true,
}) => {
	const frame = useCurrentFrame();
	if (frame < desde || frame >= hasta) return null;
	const s = salida ? interpolate(frame, [hasta - 6, hasta], [0, 1], clamp) : 0;
	return (
		<AbsoluteFill style={{opacity: 1 - s, filter: s > 0 ? `blur(${s * 14}px)` : undefined}}>
			<div
				style={{
					position: 'absolute',
					left: ZONA.x0,
					top: ZONA.y0,
					width: ZONA.x1 - ZONA.x0,
					height: ZONA.y1 - ZONA.y0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{children}
			</div>
		</AbsoluteFill>
	);
};

export const Columna: React.FC<{gap?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
	gap = 36,
	children,
	style,
}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap, ...style}}>{children}</div>
);

export const Fila: React.FC<{gap?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
	gap = 30,
	children,
	style,
}) => (
	<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap, ...style}}>
		{children}
	</div>
);

// ---------- Texto con *resaltado* ----------
const conResaltado = (texto: string, color = C.azul) =>
	texto.split(/(\*[^*]+\*)/g).map((parte, i) =>
		parte.startsWith('*') ? (
			<span key={i} style={{color, textShadow: `0 0 24px ${color === C.azul ? C.brillo : 'rgba(255,77,94,0.6)'}, ${SOMBRA}`}}>
				{parte.slice(1, -1)}
			</span>
		) : (
			<span key={i}>{parte}</span>
		),
	);

export const Texto: React.FC<{
	children: string;
	en: number;
	tam?: number;
	peso?: 800 | 900;
	color?: string;
	ancho?: number;
	sinEntrada?: boolean;
	style?: React.CSSProperties;
}> = ({children, en, tam = 76, peso = 900, color = C.blanco, ancho = 860, sinEntrada = false, style}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en);
	const esc = sinEntrada ? 1 : interpolate(r, [0, 1], [0.6, 1]);
	const op = sinEntrada ? 1 : aparece(frame, en, 5);
	return (
		<div
			style={{
				fontFamily: FUENTE,
				fontWeight: peso,
				fontSize: tam,
				lineHeight: 1.08,
				color,
				textAlign: 'center',
				textShadow: SOMBRA,
				maxWidth: ancho,
				letterSpacing: '-0.01em',
				transform: `scale(${esc})`,
				opacity: op,
				...style,
			}}
		>
			{children.split('\n').map((linea, i) => (
				<div key={i}>{conResaltado(linea)}</div>
			))}
		</div>
	);
};

// ---------- Logo de otra marca ----------
export const Logo: React.FC<{archivo: string; en: number; alto?: number; ancho?: number}> = ({
	archivo,
	en,
	alto = 110,
	ancho,
}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en, {damping: 10, mass: 0.7, stiffness: 150});
	return (
		<div
			style={{
				background: C.blanco,
				borderRadius: 32,
				padding: 30,
				boxShadow: `0 18px 44px rgba(0,0,0,0.65), 0 0 46px ${C.brillo}`,
				transform: `scale(${interpolate(r, [0, 1], [0.5, 1])}) rotate(${interpolate(r, [0, 1], [-6, 0])}deg)`,
				opacity: aparece(frame, en, 4),
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Img src={staticFile(`logos/${archivo}`)} style={{height: alto, width: ancho, objectFit: 'contain', display: 'block'}} />
		</div>
	);
};

// ---------- Cifra gigante que cuenta ----------
export const Cifra: React.FC<{
	valor: number;
	en: number;
	antes?: string;
	despues?: string;
	tam?: number;
	dur?: number;
}> = ({valor, en, antes = '', despues = '', tam = 300, dur = 22}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en);
	const p = interpolate(frame, [en, en + dur], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const n = Math.round(valor * p);
	return (
		<div
			style={{
				fontFamily: FUENTE,
				fontWeight: 900,
				fontSize: tam,
				lineHeight: 1,
				color: C.azul,
				textShadow: `0 0 50px ${C.brillo}, ${SOMBRA}`,
				transform: `scale(${interpolate(r, [0, 1], [0.6, 1])})`,
				opacity: aparece(frame, en, 4),
				fontVariantNumeric: 'tabular-nums',
				letterSpacing: '-0.03em',
				whiteSpace: 'nowrap',
			}}
		>
			{antes}
			{n}
			{despues}
		</div>
	);
};

// ---------- Insignia ----------
export const Insignia: React.FC<{
	numero: number | string;
	etiqueta: string;
	en: number;
	puntos?: {total: number; activo: number};
}> = ({numero, etiqueta, en, puntos}) => {
	const frame = useCurrentFrame();
	const r = useRebote(en);
	const giro = ['7', '4', '9', String(numero)];
	const paso = Math.min(giro.length - 1, Math.max(0, Math.floor((frame - en) / 3)));
	const sub = interpolate((frame - en) % 3, [0, 3], [0, 1]);
	const yNum = paso < giro.length - 1 ? interpolate(sub, [0, 1], [-14, 14]) : 0;
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: aparece(frame, en, 4)}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 18, transform: `scale(${interpolate(r, [0, 1], [0.5, 1])})`}}>
				<div
					style={{
						width: 74,
						height: 74,
						borderRadius: 37,
						background: C.azul,
						boxShadow: `0 0 26px ${C.brillo}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						overflow: 'hidden',
						fontFamily: FUENTE,
						fontWeight: 900,
						fontSize: String(giro[paso]).length > 1 ? 34 : 42,
						color: C.tinta,
					}}
				>
					<span style={{transform: `translateY(${yNum}px)`}}>{giro[paso]}</span>
				</div>
				<div style={{fontFamily: FUENTE, fontWeight: 800, fontSize: 44, color: C.blanco, textShadow: SOMBRA}}>
					{etiqueta}
				</div>
			</div>
			{puntos ? (
				<div style={{display: 'flex', gap: 14}}>
					{Array.from({length: puntos.total}).map((_, i) => (
						<div
							key={i}
							style={{
								width: i + 1 === puntos.activo ? 40 : 14,
								height: 14,
								borderRadius: 7,
								background: i + 1 <= puntos.activo ? C.azul : 'rgba(139,149,168,0.55)',
								boxShadow: i + 1 === puntos.activo ? `0 0 14px ${C.brillo}` : undefined,
							}}
						/>
					))}
				</div>
			) : null}
		</div>
	);
};

// ---------- Ícono que se dibuja y se enciende ----------
// Cada trazo: d (path SVG en caja 100×100) y relleno: 'a' azul, 'b' azul oscuro, null sin relleno.
export type Trazo = {d: string; relleno?: 'a' | 'b' | null};

export const Icono: React.FC<{
	trazos: Trazo[];
	en: number;
	tam?: number;
	encender?: boolean;
	enciendeEn?: number; // por defecto, apenas termina de dibujarse
	extra?: (dibujo: number, encendido: number) => React.ReactNode;
}> = ({trazos, en, tam = 300, encender = true, enciendeEn, extra}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const dibujo = interpolate(frame, [en, en + 15], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const enc = enciendeEn ?? en + 15;
	const e = encender ? spring({frame: frame - enc, fps, config: {damping: 9, mass: 0.5, stiffness: 160}}) : 0;
	const lleno = encender ? interpolate(frame, [enc, enc + 6], [0, 1], clamp) : 0;
	const rayos = encender ? interpolate(frame, [enc, enc + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 0;
	const escala = 1 + 0.12 * Math.sin(Math.min(1, e) * Math.PI) * (1 - Math.min(1, (frame - enc) / 20));
	return (
		<div style={{width: tam, height: tam, position: 'relative', opacity: frame >= en ? 1 : 0}}>
			<svg
				viewBox="-30 -30 160 160"
				style={{
					position: 'absolute',
					inset: -tam * 0.3,
					width: tam * 1.6,
					height: tam * 1.6,
					overflow: 'visible',
					transform: `scale(${frame >= enc ? escala : 1})`,
					filter: lleno > 0 ? `drop-shadow(0 0 ${22 * lleno}px ${C.brillo})` : `drop-shadow(${SOMBRA})`,
				}}
			>
				{/* rayos */}
				{rayos > 0
					? Array.from({length: 8}).map((_, i) => {
							const ang = (i / 8) * Math.PI * 2 - Math.PI / 2;
							const r0 = 66 + 6 * rayos;
							const r1 = r0 + 14 * rayos;
							return (
								<line
									key={i}
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
						})
					: null}
				{trazos.map((t, i) => (
					<path
						key={i}
						d={t.d}
						pathLength={1}
						fill={t.relleno === 'a' ? C.azul : t.relleno === 'b' ? C.azulOscuro : 'none'}
						fillOpacity={t.relleno ? lleno : 0}
						stroke={C.blanco}
						strokeWidth={5.5}
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeDasharray="1 1"
						strokeDashoffset={1 - dibujo}
					/>
				))}
				{extra ? extra(dibujo, lleno) : null}
			</svg>
		</div>
	);
};

// ---------- Logo INVORA (texto) ----------
export const LogoInvora: React.FC<{en: number; tam?: number}> = ({en, tam = 92}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [en, en + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const raya = interpolate(frame, [en + 14, en + 28], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const esp = interpolate(p, [0, 1], [1.1, 0.32]);
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: p}}>
			<div
				style={{
					fontFamily: FUENTE,
					fontWeight: 500,
					fontSize: tam,
					letterSpacing: `${esp}em`,
					marginRight: `-${esp}em`,
					color: C.blanco,
					textShadow: SOMBRA,
					filter: `blur(${(1 - p) * 14}px)`,
					lineHeight: 1,
					whiteSpace: 'nowrap',
				}}
			>
				INVORA
			</div>
			<div style={{width: 260, height: 6, display: 'flex'}}>
				<div
					style={{
						width: 260 * raya,
						height: 6,
						borderRadius: 3,
						background: C.azul,
						boxShadow: `0 0 16px ${C.brillo}`,
					}}
				/>
			</div>
		</div>
	);
};
