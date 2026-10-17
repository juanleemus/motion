// Clip suelto "Día 11 de la escuela INVORA" para superponer sobre la cámara (≈2 s).
// Todo va arriba y más junto, para dejar libre la parte de abajo. Sin fondo = transparente.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {C, Columna, Dinamico, FUENTE, Fondo, Icono, Insignia, LogoInvora, Texto, ZONA} from '../robots/ui';
import {ICONOS} from '../robots/iconos';
import {en} from './tiempos';

// El clip arranca cuando se dice "Día" (0:13.98 del reel).
export const INICIO_CLIP = en('Día 11');
export const DURACION_CLIP = 63; // 2,1 s

const Contenido: React.FC = () => (
	<div style={{position: 'absolute', left: ZONA.x0, top: ZONA.y0, width: ZONA.x1 - ZONA.x0, display: 'flex', justifyContent: 'center'}}>
		<Columna gap={95}>
			<Insignia numero={11} etiqueta="de 12" en={en('Día 11')} />
			<Icono
				trazos={ICONOS.calendario}
				en={en('Día 11') + 4}
				tam={230}
				extra={(dibujo) => (
					<g opacity={dibujo > 0.4 ? 1 : 0} fontFamily={FUENTE} textAnchor="middle" fill={C.blanco}>
						<text x={50} y={36} fontSize={12} fontWeight={800}>
							día
						</text>
						<text x={50} y={84} fontSize={36} fontWeight={900}>
							11
						</text>
					</g>
				)}
			/>
			<Columna gap={26} style={{marginTop: 10}}>
				<Texto en={en('de la Escuela')} tam={84}>
					{'de la escuela'}
				</Texto>
				<LogoInvora en={en('Invora', 1)} vel={2} />
			</Columna>
		</Columna>
	</div>
);

export const ClipDia: React.FC<{transparente: boolean}> = ({transparente}) => (
	<Dinamico.Provider value>
		<AbsoluteFill style={{fontFamily: FUENTE}}>
			{transparente ? null : <Fondo />}
			<Sequence from={-INICIO_CLIP}>
				<Contenido />
			</Sequence>
		</AbsoluteFill>
	</Dinamico.Provider>
);
