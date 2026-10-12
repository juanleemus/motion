// Robotaxis de perfil con el logo de su marca en la puerta, carretera en movimiento
// y caravana de carritos. Para la frase "una o dos empresas van a tener todos los carros autónomos".
import React from 'react';
import {Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, pulsoBeat} from './ui';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ANCHO = 400; // caja del carro: 400 × 170
const R_RUEDA = 30;

// Posición x del carro: entra desde la izquierda y frena con un pequeño rebote.
const usePosicion = (en: number, desde: number, hasta: number) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = (f: number) => spring({frame: f - en, fps, config: {damping: 15, mass: 1, stiffness: 70}});
	const x = desde + (hasta - desde) * p(frame);
	const v = x - (desde + (hasta - desde) * p(frame - 1));
	return {x, v, llego: p(frame)};
};

const Rueda: React.FC<{cx: number; giro: number}> = ({cx, giro}) => (
	<g transform={`translate(${cx} 128)`}>
		<circle r={R_RUEDA} fill="#0b0f19" stroke="#2b3447" strokeWidth={4} />
		<circle r={17} fill="#c9d2e0" />
		<g transform={`rotate(${giro})`}>
			{[0, 72, 144, 216, 288].map((a) => (
				<rect key={a} x={-3} y={-16} width={6} height={13} rx={3} fill="#5c6880" transform={`rotate(${a})`} />
			))}
		</g>
		<circle r={5} fill={C.azulOscuro} />
	</g>
);

export const Robotaxi: React.FC<{
	logo: string;
	en: number;
	x: number;
	y: number;
	escala?: number;
	alturaLogo?: number;
}> = ({logo, en, x, y, escala = 1, alturaLogo = 34}) => {
	const frame = useCurrentFrame();
	const {x: px, v, llego} = usePosicion(en, -1250, x);
	// las ruedas giran con el avance del carro + la velocidad de crucero de la carretera
	const giro = ((px + frame * 14) / R_RUEDA) * (180 / Math.PI);
	const rapido = Math.min(1, Math.abs(v) / 18);
	const bache = Math.sin(frame * 1.7) * 1.2 + Math.sin(frame * 0.9) * 0.8;
	const frena = llego > 0.9 && llego < 1.08 ? (llego - 1) * 60 : 0;
	const inclina = -rapido * 2 + frena * 0.12;
	const lidar = (frame * 9) % 360;
	return (
		<div
			style={{
				position: 'absolute',
				left: px,
				top: y,
				width: ANCHO * escala,
				height: 170 * escala,
				opacity: frame >= en ? 1 : 0,
			}}
		>
			{/* estelas de velocidad */}
			{rapido > 0.08
				? [40, 80, 115].map((yy, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: -260 * rapido * escala,
								top: yy * escala,
								width: (230 - i * 50) * rapido * escala,
								height: 5,
								borderRadius: 3,
								background: `linear-gradient(90deg, rgba(42,157,255,0), rgba(160,210,255,${0.8 * rapido}))`,
							}}
						/>
					))
				: null}
			<svg
				viewBox={`0 0 ${ANCHO} 170`}
				width={ANCHO * escala}
				height={170 * escala}
				style={{overflow: 'visible', transform: `translateY(${bache}px) rotate(${inclina}deg)`, transformOrigin: '50% 80%'}}
			>
				<defs>
					<linearGradient id={`carroceria-${logo}`} x1="0" y1="0" x2="0" y2="1">
						<stop offset="0" stopColor="#ffffff" />
						<stop offset="1" stopColor="#c8d3e3" />
					</linearGradient>
				</defs>
				{/* sombra en el piso */}
				<ellipse cx={200} cy={160} rx={185} ry={10} fill="rgba(0,0,0,0.55)" />
				{/* sensor del techo (lidar) */}
				<rect x={190} y={12} width={44} height={18} rx={6} fill="#1d2638" stroke={C.blanco} strokeWidth={3} />
				<rect x={196 + 32 * Math.abs(Math.sin((lidar * Math.PI) / 180))} y={17} width={8} height={8} rx={2} fill={C.azul} />
				{/* carrocería */}
				<path
					d="M28 118 L28 96 Q30 82 48 78 L108 68 L148 38 Q158 30 176 30 L262 30 Q280 30 292 42 L330 72 L362 80 Q382 85 382 102 L382 118 Q382 128 372 128 L36 128 Q28 128 28 118Z"
					fill={`url(#carroceria-${logo})`}
					stroke={C.blanco}
					strokeWidth={4}
				/>
				{/* ventanas */}
				<path d="M156 42 L124 68 L228 68 L228 42Z" fill="#1d2638" />
				<path d="M238 42 L238 68 L316 70 L286 44Z" fill="#1d2638" />
				{/* franja azul */}
				<path d="M40 104 L370 104" stroke={C.azul} strokeWidth={6} strokeLinecap="round" />
				{/* faro con brillo */}
				<ellipse cx={374} cy={92} rx={7} ry={6} fill={C.azul} />
				<ellipse cx={392} cy={92} rx={22 + 6 * pulsoBeat(frame)} ry={8} fill="rgba(42,157,255,0.25)" />
				{/* placa con el logo en la puerta */}
				<rect x={136} y={70} width={128} height={52} rx={12} fill={C.blanco} stroke="#d5deea" strokeWidth={2} />
				<image
					href={staticFile(`logos/${logo}`)}
					x={142}
					y={96 - alturaLogo / 2}
					width={116}
					height={alturaLogo}
					preserveAspectRatio="xMidYMid meet"
				/>
				<Rueda cx={100} giro={giro} />
				<Rueda cx={302} giro={giro} />
			</svg>
		</div>
	);
};

// Carritos pequeños que llegan en caravana ("todos los carros autónomos").
export const Caravana: React.FC<{en: number; cantidad: number; y: number; ancho: number; paso?: number}> = ({
	en,
	cantidad,
	y,
	ancho,
	paso = 3,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const w = 96;
	const hueco = (ancho - cantidad * w) / (cantidad - 1);
	return (
		<>
			{Array.from({length: cantidad}).map((_, i) => {
				const destino = i * (w + hueco);
				const p = spring({frame: frame - en - i * paso, fps, config: {damping: 14, mass: 0.7, stiffness: 90}});
				const xx = interpolate(p, [0, 1], [-900 - i * 60, destino]);
				const visible = frame >= en + i * paso;
				const giro = ((xx + frame * 10) / 9) * (180 / Math.PI);
				return (
					<svg
						key={i}
						viewBox="0 0 100 50"
						width={w}
						height={48}
						style={{position: 'absolute', left: xx, top: y + Math.sin(frame * 1.5 + i) * 1.2, opacity: visible ? 0.9 : 0, overflow: 'visible'}}
					>
						<path
							d="M6 36 V28 Q7 22 14 21 L30 19 L40 9 Q43 7 48 7 L68 7 Q73 7 76 10 L86 19 L92 21 Q96 23 96 28 V36 Q96 39 93 39 H9 Q6 39 6 36Z"
							fill={C.azul}
							stroke={C.blanco}
							strokeWidth={2.5}
						/>
						<path d="M44 11 L36 19 H62 V11Z M66 11 V19 H80 L73 11Z" fill={C.azulOscuro} />
						{[26, 76].map((cx) => (
							<g key={cx} transform={`translate(${cx} 39) rotate(${giro})`}>
								<circle r={8} fill="#0b0f19" stroke={C.blanco} strokeWidth={2} />
								<rect x={-1} y={-6} width={2} height={5} fill={C.blanco} />
							</g>
						))}
					</svg>
				);
			})}
		</>
	);
};

// Carretera con líneas que corren (sensación de avance).
export const Carretera: React.FC<{ancho: number; alto: number; carriles: number[]; en: number}> = ({
	ancho,
	alto,
	carriles,
	en,
}) => {
	const frame = useCurrentFrame();
	const op = interpolate(frame, [en, en + 8], [0, 1], clamp);
	const abre = interpolate(frame, [en, en + 12], [0.2, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const corre = (frame * 14) % 90;
	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				top: 0,
				width: ancho,
				height: alto,
				opacity: op,
				transform: `scaleX(${abre})`,
				borderRadius: 26,
				overflow: 'hidden',
				background: 'linear-gradient(180deg, rgba(21,28,43,0.92) 0%, rgba(14,19,30,0.96) 100%)',
				boxShadow: `0 20px 50px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(42,157,255,0.25)`,
			}}
		>
			{carriles.map((yy, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: -corre,
						top: yy,
						width: ancho + 180,
						height: 6,
						backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.5) 0 46px, transparent 46px 90px)`,
					}}
				/>
			))}
		</div>
	);
};
