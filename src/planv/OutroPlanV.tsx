// Pantalla final de plan v para YouTube (15 s): "gracias por escucharnos", logo, dos recuadros para los
// videos sugeridos y el isotipo girando en el lugar del botón de suscribirse. El último segundo va a negro.
import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORES as C} from './tiempos';
import {Brillo, Grano, Isotipo, enfoque} from './IntroPlanV';

export const DURACION_OUTRO = 450;
const T = {
	gracias: 6,
	logo: 20,
	cajas: 34,
	iso: 40,
	etiquetas: 60,
	sale: 414, // todo se desenfoca
	negro: 420, // desde aquí, negro total
};

const SERIF = 'DM Serif Display';
const MONO = 'Space Mono';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Recuadro 16:9 de línea fina que se dibuja solo; ahí YouTube pone el video sugerido.
const Caja: React.FC<{x: number; y: number; w: number; etiqueta: string; retraso: number}> = ({x, y, w, etiqueta, retraso}) => {
	const frame = useCurrentFrame();
	const h = (w * 9) / 16;
	const perimetro = 2 * (w + h);
	const p = interpolate(frame, [T.cajas + retraso, T.cajas + retraso + 26], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const sale = interpolate(frame, [T.sale, T.sale + 8], [1, 0], clamp);
	return (
		<>
			<svg width={w + 4} height={h + 4} style={{position: 'absolute', left: x - 2, top: y - 2, opacity: sale}}>
				<rect x={2} y={2} width={w} height={h} rx={14} fill="rgba(237,237,234,0.03)" stroke={C.papel} strokeOpacity={0.55} strokeWidth={2} strokeDasharray={`${perimetro * p} ${perimetro}`} />
			</svg>
			<div style={{position: 'absolute', left: x, top: y + h + 22, width: w, textAlign: 'center', fontFamily: MONO, fontSize: 22, letterSpacing: '0.3em', color: C.papel, ...enfoque(frame, T.etiquetas + retraso, T.sale, 14)}}>
				{etiqueta}
			</div>
		</>
	);
};

export const OutroPlanV: React.FC = () => {
	const frame = useCurrentFrame();
	const {width} = useVideoConfig();
	const cx = width / 2;
	const cajaW = 600;
	const cajaY = 400;
	const giro = interpolate(frame, [T.iso + 40, T.sale], [0, 240]);
	const respira = 0.85 + 0.15 * Math.sin(frame / 22);

	return (
		<AbsoluteFill style={{backgroundColor: '#000000', overflow: 'hidden'}}>
			<Audio src={staticFile('planv/outro-audio.wav')} />
			<Brillo entra={0} pico={40} sale={T.negro - 2} fuerza={0.55 * respira} />

			<div style={{position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 84, color: C.papel, ...enfoque(frame, T.gracias, T.sale, 16)}}>
				gracias por escucharnos
			</div>
			<div style={{position: 'absolute', top: 232, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 26, ...enfoque(frame, T.logo, T.sale, 16)}}>
				<span style={{fontFamily: SERIF, fontSize: 64, color: C.papel}}>
					plan <span style={{color: C.bermellon}}>v</span>
				</span>
				<span style={{fontFamily: MONO, fontSize: 22, letterSpacing: '0.35em', color: 'rgba(237,237,234,0.7)'}}>podcast</span>
			</div>

			<Caja x={cx - 120 - cajaW} y={cajaY} w={cajaW} etiqueta="siguiente episodio" retraso={0} />
			<Caja x={cx + 120} y={cajaY} w={cajaW} etiqueta="también te puede gustar" retraso={6} />

			<div style={{position: 'absolute', left: cx - 95, top: cajaY + (cajaW * 9) / 32 - 95, ...enfoque(frame, T.iso - 2, T.sale, 8)}}>
				<Isotipo tam={190} en={T.iso} giroExtra={giro} />
			</div>
			<div style={{position: 'absolute', top: cajaY + (cajaW * 9) / 16 + 22, left: 0, right: 0, textAlign: 'center', fontFamily: MONO, fontSize: 22, letterSpacing: '0.3em', color: C.bermellon, ...enfoque(frame, T.etiquetas + 3, T.sale, 14)}}>
				suscríbete
			</div>

			<div style={{position: 'absolute', bottom: 70, left: 0, right: 0, textAlign: 'center', fontFamily: MONO, fontSize: 22, letterSpacing: '0.2em', color: 'rgba(237,237,234,0.55)', ...enfoque(frame, T.etiquetas + 10, T.sale, 14)}}>
				nos vemos en el próximo episodio
			</div>
			<Grano />
			{frame >= T.negro && <AbsoluteFill style={{backgroundColor: '#000000'}} />}
		</AbsoluteFill>
	);
};
