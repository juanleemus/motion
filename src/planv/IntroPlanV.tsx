// Intro de plan v en clave "title card": los nombres de los tres hosts se enfocan uno a uno, un brillo bermellón que sube,
// el isotipo (sombrero visto desde arriba) se dibuja y se arma con el nombre, y todo se desvanece.
import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORES as C, DUR_NOMBRE, NEGRO_FINAL, NOMBRES, T_NOMBRES, T_PLANV as T} from './tiempos';

const SERIF = 'DM Serif Display';
const SANS = 'Inter';
const MONO = 'Space Mono';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Radios del isotipo (mismo dibujo que el PNG de la marca, en un lienzo de 1200 x 1200).
const R = 560;
const radio = (i: number) => R * (1 - i * 0.085);
const ANILLOS = [0, 2, 4, 6].map((i) => ({ext: radio(i), int: radio(i + 1)}));
const DISCO = radio(8);

const zigzag = (r: number, amp: number, picos: number) => {
	const pts: string[] = [];
	for (let k = 0; k <= picos * 2; k++) {
		const a = (k / (picos * 2)) * Math.PI * 2;
		const rr = r + (k % 2 === 0 ? amp : -amp);
		pts.push(`${(rr * Math.cos(a)).toFixed(1)},${(rr * Math.sin(a)).toFixed(1)}`);
	}
	return pts.join(' ');
};

// Entrada y salida con desenfoque: de borroso a nítido y de vuelta.
const enfoque = (frame: number, entra: number, sale: number, dur = 14) => {
	const e = interpolate(frame, [entra, entra + dur], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const s = interpolate(frame, [sale, sale + 10], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	return {
		opacity: e * (1 - s),
		filter: `blur(${(1 - e) * 18 + s * 16}px)`,
		transform: `translateY(${(1 - e) * 22 - s * 18}px)`,
	};
};

// Nombre de un host: número en Space Mono y nombre en DM Serif itálica.
const Host: React.FC<{nombre: string; i: number; tam: number}> = ({nombre, i, tam}) => {
	const frame = useCurrentFrame();
	const entra = T_NOMBRES[i];
	const sale = entra + DUR_NOMBRE;
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: tam * 0.18}}>
			<div style={{fontFamily: MONO, fontSize: tam * 0.24, letterSpacing: '0.35em', color: C.bermellon, ...enfoque(frame, entra, sale, 12)}}>
				{`0${i + 1} / 03`}
			</div>
			<div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: tam, lineHeight: 1, color: C.papel, ...enfoque(frame, entra + 2, sale, 14)}}>
				{nombre}
			</div>
		</AbsoluteFill>
	);
};

// Brillo difuso que sube desde abajo (como en la referencia, pero en bermellón).
const Brillo: React.FC<{entra: number; pico: number; sale: number; fuerza?: number}> = ({entra, pico, sale, fuerza = 1}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const sube = interpolate(frame, [entra, pico], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const baja = interpolate(frame, [pico + 6, sale], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
	const v = sube * (1 - baja) * fuerza;
	if (v <= 0) return null;
	const y = interpolate(sube, [0, 1], [height * 0.55, height * 0.12]);
	return (
		<div
			style={{
				position: 'absolute',
				left: -width * 0.2,
				width: width * 1.4,
				top: y,
				height: height * 1.1,
				background: `radial-gradient(ellipse 50% 45% at 50% 55%, ${C.bermellon} 0%, rgba(242,56,31,0.55) 40%, rgba(242,56,31,0) 75%)`,
				filter: 'blur(90px)',
				opacity: Math.min(1, v * 1.05),
			}}
		/>
	);
};

// Grano analógico sobre todo el cuadro.
const Grano: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	return (
		<svg width={width} height={height} style={{position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: 0.35}}>
			<filter id="grano">
				<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.floor(frame / 2)} />
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="100%" height="100%" filter="url(#grano)" />
		</svg>
	);
};

// Isotipo: los anillos se dibujan girando de adentro hacia afuera, con textura de sello.
const Isotipo: React.FC<{tam: number}> = ({tam}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const giro = interpolate(frame, [T.logo, T.logo + 40], [-120, 0], {...clamp, easing: Easing.out(Easing.cubic)});
	const disco = spring({frame: frame - T.logo, fps, config: {damping: 13, stiffness: 150}});
	return (
		<svg width={tam} height={tam} viewBox="-600 -600 1200 1200" style={{overflow: 'visible'}}>
			<defs>
				<filter id="sello" x="-10%" y="-10%" width="120%" height="120%">
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="ruido" />
					<feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -6 4.6" result="mascara" />
					<feComposite in="SourceGraphic" in2="mascara" operator="in" />
				</filter>
			</defs>
			<g filter="url(#sello)" transform={`rotate(${giro})`}>
				{ANILLOS.map((a, k) => {
					const inicio = T.logo + 4 + (ANILLOS.length - 1 - k) * 4;
					const p = interpolate(frame, [inicio, inicio + 20], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
					const medio = (a.ext + a.int) / 2;
					const largo = 2 * Math.PI * medio;
					return (
						<circle
							key={k}
							r={medio}
							fill="none"
							stroke={C.bermellon}
							strokeWidth={a.ext - a.int}
							strokeDasharray={`${largo * p} ${largo}`}
							transform={`rotate(${k % 2 === 0 ? -90 : 90})`}
						/>
					);
				})}
				<polyline
					points={zigzag((ANILLOS[1].ext + ANILLOS[1].int) / 2, 11, 72)}
					fill="none"
					stroke={C.negro}
					strokeWidth={12}
					opacity={interpolate(frame, [T.logo + 22, T.logo + 30], [0, 1], clamp)}
				/>
				<g transform={`scale(${disco})`}>
					<circle r={DISCO} fill={C.bermellon} />
					<polyline points={zigzag(130, 9, 48)} fill="none" stroke={C.negro} strokeWidth={10} />
					<circle r={78} fill="none" stroke={C.negro} strokeWidth={4} />
					<circle r={26} fill={C.negro} />
				</g>
			</g>
		</svg>
	);
};

// "plan v" letra por letra con desenfoque; la v en bermellón.
const Nombre: React.FC<{tam: number}> = ({tam}) => {
	const frame = useCurrentFrame();
	const letras = ['p', 'l', 'a', 'n', ' ', 'v'];
	return (
		<div style={{fontFamily: SERIF, fontSize: tam, lineHeight: 1, color: C.papel, display: 'flex', whiteSpace: 'pre'}}>
			{letras.map((l, i) => (
				<span key={i} style={{display: 'inline-block', color: l === 'v' ? C.bermellon : C.papel, ...enfoque(frame, T.arma + 4 + i * 3, T.sale + i * 1.5, 16)}}>
					{l}
				</span>
			))}
		</div>
	);
};

export const IntroPlanV: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height, fps} = useVideoConfig();
	const vertical = height > width;
	const cx = width / 2;
	const cy = height / 2;
	const tamHost = vertical ? 150 : 140;

	// El isotipo aparece centrado y se corre para armarse con el nombre.
	const tamIso = vertical ? 280 : 230;
	const arma = spring({frame: frame - T.arma, fps, config: {damping: 18, stiffness: 110}});
	const tamNombre = vertical ? 170 : 150;
	const isoX = vertical ? cx : cx - 260 * arma;
	const isoY = vertical ? cy - 150 * arma : cy;
	const isoSale = enfoque(frame, T.logo - 2, T.sale, 6);

	return (
		<AbsoluteFill style={{backgroundColor: '#000000', overflow: 'hidden'}}>
			<Audio src={staticFile('planv/intro-sfx.wav')} />
			<Brillo entra={T.brillo} pico={T.logo - 2} sale={T.logo + 22} />
			<Brillo entra={T.brillo2} pico={T.sale} sale={NEGRO_FINAL - 2} fuerza={0.8} />

			{NOMBRES.map((n, i) => (
				<Host key={n} nombre={n} i={i} tam={tamHost} />
			))}

			<div
				style={{
					position: 'absolute',
					left: isoX - tamIso / 2,
					top: isoY - tamIso / 2,
					opacity: isoSale.opacity,
					filter: isoSale.filter,
				}}
			>
				<Isotipo tam={tamIso} />
			</div>

			<div
				style={{
					position: 'absolute',
					left: vertical ? 0 : cx - 100,
					right: vertical ? 0 : undefined,
					top: vertical ? cy + 40 : cy - tamNombre * 0.62,
					display: 'flex',
					flexDirection: 'column',
					alignItems: vertical ? 'center' : 'flex-start',
					gap: vertical ? 26 : 18,
				}}
			>
				<Nombre tam={tamNombre} />
				<div style={{fontFamily: MONO, fontSize: vertical ? 26 : 24, color: 'rgba(237,237,234,0.75)', letterSpacing: '0.35em', paddingLeft: vertical ? 0 : 6, ...enfoque(frame, T.etiqueta, T.sale, 14)}}>
					podcast
				</div>
			</div>
			<Grano />
			{frame >= NEGRO_FINAL && <AbsoluteFill style={{backgroundColor: '#000000'}} />}
		</AbsoluteFill>
	);
};
