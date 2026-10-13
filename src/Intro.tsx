// Intro de la serie "Día X de 12 de la Escuela Invora" (4,5 s, o 2,5 s con corta). Solo cambia el número del día.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, Columna, Escena, FUENTE, Fondo, Icono, Insignia, LogoInvora, Texto} from './robots/ui';
import {ICONOS} from './robots/iconos';
import {DURACION_INTRO, DURACION_INTRO_CORTA, TOTAL_DIAS, T_INTRO as T_LARGA, T_INTRO_CORTA} from './tiemposIntro';

// posicion 'arriba-izquierda': todo más pequeño y arriba a la izquierda, para dejar libre
// la esquina de abajo a la derecha (ahí se monta una persona encima).
const ESQUINA = {escala: 0.72, x: -140, y: -232};

export const Intro: React.FC<{dia: number; corta?: boolean; posicion?: 'centro' | 'arriba-izquierda'}> = ({
	dia,
	corta = false,
	posicion = 'centro',
}) => {
	const frame = useCurrentFrame();
	const T_INTRO = corta ? T_INTRO_CORTA : T_LARGA;
	const duracion = corta ? DURACION_INTRO_CORTA : DURACION_INTRO;
	const opacidad = interpolate(frame, [T_INTRO.baja, T_INTRO.baja + 12], [1, 0.35], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<AbsoluteFill style={{fontFamily: FUENTE}}>
			<Fondo />
			<AbsoluteFill style={{opacity: opacidad}}>
				<Escena desde={0} hasta={duracion} salida={false}>
					<div
						style={
							posicion === 'arriba-izquierda'
								? {transform: `translate(${ESQUINA.x}px, ${ESQUINA.y}px) scale(${ESQUINA.escala})`}
								: undefined
						}
					>
					<Columna gap={150}>
						<Insignia numero={dia} etiqueta={`de ${TOTAL_DIAS}`} en={T_INTRO.insignia} />
						<Icono
							trazos={ICONOS.calendario}
							en={T_INTRO.dibujo}
							enciendeEn={T_INTRO.enciende}
							tam={330}
							extra={(dibujo) => (
								<g opacity={dibujo > 0.5 ? 1 : 0} fontFamily={FUENTE} textAnchor="middle" fill={C.blanco}>
									<text x={50} y={36} fontSize={12} fontWeight={800}>
										día
									</text>
									<text x={50} y={84} fontSize={dia > 9 ? 36 : 42} fontWeight={900}>
										{dia}
									</text>
								</g>
							)}
						/>
						<Columna gap={40} style={{marginTop: 30}}>
							<Texto en={T_INTRO.escuela} tam={88}>
								{'de la escuela'}
							</Texto>
							<LogoInvora en={T_INTRO.invora} tam={100} separacion={posicion === 'arriba-izquierda' ? 0.62 : undefined} />
						</Columna>
					</Columna>
					</div>
				</Escena>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
