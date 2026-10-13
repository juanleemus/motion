// Clip dinámico de 6 s: fondos y políticos meten acciones nuevas a su portafolio.
// Los tiempos son los del reel completo; <Sequence from={-INICIO}> los corre al inicio del clip.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, Dinamico, Escena, FUENTE, Fondo, Icono, Insignia, Texto, ZONA, aparece, pulsoBeat} from '../../robots/ui';
import {ICONOS} from '../../robots/iconos';
import {INICIO, en} from './tiempos';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ANCHO = ZONA.x1 - ZONA.x0; // 860
const CX = ANCHO / 2;

// Posiciones dentro del área segura (0,0 = esquina x70, y300).
const ICONOS_Y = {antes: 470, despues: 300};
const SEPARACION = 210;
const MALETIN = {x: CX, y: 640, tam: 340};

// Tarjeta de acción nueva: mini gráfica que sube y un "+".
const Tarjeta: React.FC = () => (
	<div
		style={{
			width: 150,
			height: 104,
			borderRadius: 22,
			background: C.blanco,
			boxShadow: `0 14px 30px rgba(0,0,0,0.6), 0 0 26px ${C.brillo}`,
			position: 'relative',
		}}
	>
		<svg viewBox="0 0 150 104" width={150} height={104}>
			<path d="M20 78 L52 56 L74 66 L108 30" fill="none" stroke={C.azul} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
			<path d="M92 28 h17 v17" fill="none" stroke={C.azul} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
		</svg>
		<div
			style={{
				position: 'absolute',
				right: -16,
				top: -16,
				width: 48,
				height: 48,
				borderRadius: 24,
				background: C.azul,
				boxShadow: `0 0 16px ${C.brillo}`,
				color: C.tinta,
				fontFamily: FUENTE,
				fontWeight: 900,
				fontSize: 40,
				lineHeight: '48px',
				textAlign: 'center',
			}}
		>
			+
		</div>
	</div>
);

// Cada tarjeta sale de un ícono (izquierda = fondos, derecha = políticos) y cae en arco al maletín.
const Vuelo: React.FC<{sale: number; lado: -1 | 1; i: number; iconosY: number}> = ({sale, lado, i, iconosY}) => {
	const frame = useCurrentFrame();
	const dur = 14;
	const p = interpolate(frame, [sale, sale + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
	if (frame < sale || p >= 1) return null;
	const x0 = CX + lado * SEPARACION;
	const y0 = iconosY + 40;
	// curva hacia afuera (nunca hacia la franja de arriba)
	const arco = lado * Math.sin(p * Math.PI) * (110 + (i % 3) * 30);
	const x = interpolate(p, [0, 1], [x0, MALETIN.x]) + arco;
	const y = interpolate(p, [0, 1], [y0, MALETIN.y - 20]);
	const esc = interpolate(p, [0, 0.2, 0.85, 1], [0.3, 1.1, 0.8, 0.45]);
	const giro = interpolate(p, [0, 1], [lado * -24, lado * 8]);
	return (
		<div
			style={{
				position: 'absolute',
				left: x - 75,
				top: y - 52,
				transform: `scale(${esc}) rotate(${giro}deg)`,
				opacity: interpolate(p, [0, 0.1, 0.92, 1], [0, 1, 1, 0]),
				zIndex: 4,
			}}
		>
			<Tarjeta />
		</div>
	);
};

const Contenido: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const entrando = en('entrando');
	const portafolio = en('portafolio');

	// Los íconos entran de golpe desde los lados y suben cuando aparece el maletín.
	const entraF = spring({frame: frame - en('Fondos'), fps, config: {damping: 12, mass: 0.6, stiffness: 170}});
	const entraP = spring({frame: frame - en('políticos'), fps, config: {damping: 12, mass: 0.6, stiffness: 170}});
	const sube = interpolate(frame, [entrando - 4, entrando + 10], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const iconosY = interpolate(sube, [0, 1], [ICONOS_Y.antes, ICONOS_Y.despues]);
	const iconosEsc = interpolate(sube, [0, 1], [1, 0.62]);

	// Tarjetas: alternan izquierda y derecha mientras dice "entrando a acciones que antes no hacían".
	const salidas = Array.from({length: 8}, (_, i) => entrando + 2 + i * 6);
	const llegadas = salidas.map((s) => s + 14);
	// El maletín "traga" cada tarjeta con un pequeño salto.
	const traga = llegadas.reduce((acc, l) => acc + (frame >= l ? 0.1 * Math.exp(-(frame - l) / 3) : 0), 0);
	const rPort = spring({frame: frame - portafolio, fps, config: {damping: 8, mass: 0.5, stiffness: 170}});
	const golpePort = frame >= portafolio ? 0.14 * Math.sin(Math.min(1, rPort) * Math.PI) : 0;

	const icono = (trazos: typeof ICONOS.edificio, palabra: string, etiqueta: string, lado: -1 | 1, r: number) => (
		<div
			style={{
				position: 'absolute',
				left: CX + lado * SEPARACION - 100,
				top: iconosY - 100,
				width: 200,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 54,
				transform: `translateX(${(1 - r) * lado * 520}px) rotate(${(1 - r) * lado * 20}deg) scale(${iconosEsc})`,
				transformOrigin: '100px 100px',
			}}
		>
			<Icono trazos={trazos} en={en(palabra)} enciendeEn={en(palabra) + 10} tam={200} />
			<div style={{opacity: 1 - sube}}>
				<Texto en={en(palabra)} tam={58} peso={800}>
					{etiqueta}
				</Texto>
			</div>
		</div>
	);

	return (
		<>
			{/* Insignia fija arriba */}
			<Escena desde={INICIO} hasta={INICIO + 9999} salida={false}>
				<div style={{position: 'absolute', top: 0}}>
					<Insignia numero={3} etiqueta="fondos y políticos" en={INICIO - 14} puntos={{total: 4, activo: 3}} />
				</div>
			</Escena>

			<Escena desde={INICIO} hasta={INICIO + 9999} salida={false} golpes={[en('Fondos'), en('políticos'), portafolio]}>
				<div style={{position: 'absolute', inset: 0}}>
					{icono(ICONOS.edificio, 'Fondos', 'fondos', -1, entraF)}
					{icono(ICONOS.politico, 'políticos', 'políticos', 1, entraP)}

					{/* Portafolio */}
					<div
						style={{
							position: 'absolute',
							left: MALETIN.x - MALETIN.tam / 2,
							top: MALETIN.y - MALETIN.tam / 2,
							transform: `scale(${interpolate(spring({frame: frame - entrando, fps, config: {damping: 11, mass: 0.6}}), [0, 1], [0.5, 1]) * (1 + traga + golpePort)})`,
							opacity: aparece(frame, entrando, 4),
							zIndex: 3,
						}}
					>
						<Icono trazos={ICONOS.maletin} en={entrando} enciendeEn={portafolio} tam={MALETIN.tam} />
					</div>
					{/* destello al encenderse */}
					{frame >= portafolio ? (
						<div
							style={{
								position: 'absolute',
								left: MALETIN.x - 260,
								top: MALETIN.y - 260,
								width: 520,
								height: 520,
								borderRadius: '50%',
								border: `6px solid ${C.azul}`,
								transform: `scale(${interpolate(frame, [portafolio, portafolio + 16], [0.4, 1.25], clamp)})`,
								opacity: interpolate(frame, [portafolio, portafolio + 16], [0.8, 0], clamp),
								boxShadow: `0 0 40px ${C.brillo}`,
							}}
						/>
					) : null}

					{salidas.map((s, i) => (
						<Vuelo key={i} sale={s} lado={i % 2 ? 1 : -1} i={i} iconosY={iconosY} />
					))}

					{/* Texto: cambia sin mover lo demás */}
					<div
						style={{
							position: 'absolute',
							left: 0,
							top: 960,
							width: ANCHO,
							height: 300,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						{frame < entrando ? null : frame < en('que antes') ? (
							<Texto en={entrando} tam={84}>
								{'están *entrando*\na acciones'}
							</Texto>
						) : (
							<Texto en={en('que antes')} tam={72}>
								{'que *antes no* hacían\nparte de su\n*portafolio*'}
							</Texto>
						)}
					</div>
				</div>
			</Escena>
			{/* resplandor de fondo que late con la música */}
			<AbsoluteFill
				style={{
					pointerEvents: 'none',
					background: `radial-gradient(circle at 50% ${(ZONA.y0 + MALETIN.y) / 19.2}%, rgba(42,157,255,${
						frame >= portafolio ? 0.12 + 0.06 * pulsoBeat(frame) : 0
					}) 0%, rgba(42,157,255,0) 40%)`,
				}}
			/>
		</>
	);
};

export const ClipPortafolio: React.FC = () => (
	<Dinamico.Provider value>
		<AbsoluteFill style={{fontFamily: FUENTE}}>
			<Fondo />
			<Sequence from={-INICIO}>
				<Contenido />
			</Sequence>
		</AbsoluteFill>
	</Dinamico.Provider>
);
