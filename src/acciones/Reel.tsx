// Cómo ver una acción antes de que salga en las noticias — Escuela Invora.
// Cada animación entra en la palabra exacta del audio guía.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, Cifra, Columna, Dinamico, Escena, Fila, FUENTE, Fondo, Icono, Insignia, Logo, LogoInvora, Texto} from '../robots/ui';
import {Comentario, Cuadricula, Notificacion, RayaRoja, SiNo, Teclas} from '../robots/piezas';
import {Circulos, Convergen, GraficaSube, Medidor} from '../robots/graficos';
import {ICONOS} from '../robots/iconos';
import {en} from './tiempos';
import {ESCENAS} from './escenas';
import {LOGOS} from './logos';

const orden = Object.keys(ESCENAS) as (keyof typeof ESCENAS)[];
const hasta = (k: keyof typeof ESCENAS) => ESCENAS[orden[orden.indexOf(k) + 1]];
const E: React.FC<{k: keyof typeof ESCENAS; children: React.ReactNode; salida?: boolean; golpes?: number[]}> = ({
	k,
	children,
	salida,
	golpes,
}) => (
	<Escena desde={ESCENAS[k]} hasta={hasta(k)} salida={salida} golpes={golpes}>
		{children}
	</Escena>
);

// Bajo la insignia: el contenido se corre hacia abajo para no montarse sobre ella.
const BAJO_INSIGNIA = 150;

// Cuadro de altura fija donde un texto reemplaza a otro sin mover lo demás.
const Cambia: React.FC<{alto: number; children: React.ReactNode}> = ({alto, children}) => (
	<div style={{height: alto, width: 860, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
);

const Burbuja: React.FC = () => (
	<svg viewBox="0 0 100 100" width="100%" height="100%" style={{overflow: 'visible'}}>
		<path
			d="M14 16 h72 a8 8 0 0 1 8 8 v42 a8 8 0 0 1 -8 8 h-40 l-18 16 v-16 h-14 a8 8 0 0 1 -8 -8 v-42 a8 8 0 0 1 8 -8Z"
			fill={C.azul}
			stroke={C.blanco}
			strokeWidth={6}
			strokeLinejoin="round"
		/>
		<path d="M30 45 v1 M50 45 v1 M70 45 v1" stroke={C.tinta} strokeWidth={9} strokeLinecap="round" />
	</svg>
);

export const ReelAcciones: React.FC = () => {
	const frame = useCurrentFrame();
	const insignia = (n: number, etiqueta: string, palabra: string) => (
		<Insignia numero={n} etiqueta={etiqueta} en={en(palabra)} puntos={{total: 4, activo: n}} />
	);
	return (
		<Dinamico.Provider value>
			<AbsoluteFill style={{fontFamily: FUENTE}}>
				<Fondo />

				{/* Portada: el primer fotograma ya es un titular legible */}
				<E k="portada">
					<Columna gap={70}>
						<Icono trazos={ICONOS.periodico} en={en('noticias')} enciendeEn={en('tarde')} tam={230} />
						<Texto en={0} sinEntrada tam={98}>
							{'cuando una\nacción sale en\nlas *noticias*…\nya es *tarde*'}
						</Texto>
					</Columna>
				</E>

				<E k="formas" golpes={[en('cuatro', 1) + 22]}>
					<Columna gap={36}>
						<Cifra valor={4} en={en('cuatro', 1)} tam={300} dur={16} />
						<Texto en={en('formas')} tam={76}>
							{'formas de verla *antes*'}
						</Texto>
						<div style={{marginTop: 60}}>
							<Circulos en={en('y la cuarta')} paso={3} tam={130} enciende={[undefined, undefined, undefined, en('cuarta')]} />
						</div>
						<Texto en={en('y la cuarta')} tam={70} style={{marginTop: 30}}>
							{'y la *cuarta* casi\nnadie la hace'}
						</Texto>
					</Columna>
				</E>

				{/* Insignias de las cuatro formas, fijas arriba con sus puntos de progreso */}
				<Escena desde={ESCENAS.reportes} hasta={ESCENAS.mano}>
					<div style={{position: 'absolute', top: 0}}>
						{frame < ESCENAS.directivos
							? insignia(1, 'los reportes', 'Uno')
							: frame < ESCENAS.fondos
								? insignia(2, 'los directivos', 'Dos')
								: frame < ESCENAS.redes
									? insignia(3, 'fondos y políticos', 'Tres')
									: insignia(4, 'las redes', 'Y cuatro')}
					</div>
				</Escena>

				{/* 1 · reportes */}
				<E k="reportes">
					<Columna gap={90} style={{marginTop: BAJO_INSIGNIA}}>
						<Icono trazos={ICONOS.documento} en={en('Lee')} enciendeEn={en('reportes')} tam={250} />
						<Texto en={en('Lee')} tam={84}>
							{'lee lo que dicen\nlos *CEO* en sus\n*reportes*'}
						</Texto>
					</Columna>
				</E>

				<E k="frena">
					<Columna gap={70} style={{marginTop: BAJO_INSIGNIA}}>
						<Icono trazos={ICONOS.embudo} en={en('frena')} enciendeEn={en('crecimiento')} tam={250} />
						<Texto en={en('Busca')} tam={80}>
							{'¿qué les *frena*\nel crecimiento?'}
						</Texto>
						<Texto en={en('quién')} tam={64} peso={800}>
							{'¿y quién les *vende eso*?'}
						</Texto>
					</Columna>
				</E>

				<E k="micron" golpes={[en('disparara') + 10]}>
					<Columna gap={50} style={{marginTop: BAJO_INSIGNIA}}>
						<Texto en={en('Meses')} tam={76}>
							{'meses *antes*'}
						</Texto>
						<Logo {...LOGOS.micron} en={en('Micron')} />
						<GraficaSube en={en('Micron') + 4} disparaEn={en('disparara')} ancho={720} alto={300} />
					</Columna>
				</E>

				<E k="memoria">
					<Columna gap={56} style={{marginTop: BAJO_INSIGNIA}}>
						<Columna gap={28}>
							<Fila gap={28}>
								<Logo {...LOGOS.microsoft} en={en('Microsoft')} />
								<Logo {...LOGOS.meta} en={en('Meta')} />
							</Fila>
							<Logo {...LOGOS.amazon} en={en('Amazon')} alto={LOGOS.amazon.alto * 1.25} />
						</Columna>
						<Icono trazos={ICONOS.chip} en={en('memoria') - 8} enciendeEn={en('memoria') + 7} tam={180} />
						<Texto en={en('ya decían')} tam={74}>
							{'la *memoria* era\nsu problema'}
						</Texto>
					</Columna>
				</E>

				{/* 2 · directivos */}
				<E k="directivos">
					<Columna gap={90} style={{marginTop: BAJO_INSIGNIA}}>
						<Icono trazos={ICONOS.politico} en={en('Directivos')} tam={250} />
						<Texto en={en('Directivos')} tam={80}>
							{'*directivos* comprando\nacciones de su\n*propia empresa*'}
						</Texto>
					</Columna>
				</E>

				<E k="plata" golpes={[en('no acciones')]}>
					<Columna gap={80} style={{marginTop: BAJO_INSIGNIA}}>
						<SiNo
							si={en('Pero con')}
							no={en('no acciones')}
							etiquetaSi="con su plata"
							etiquetaNo={'acciones de\nsu sueldo'}
							tam={64}
							ancho={560}
						/>
					</Columna>
				</E>

				<E k="conviccion">
					<Columna gap={90} style={{marginTop: BAJO_INSIGNIA}}>
						<Icono trazos={ICONOS.diana} en={en('Plata propia')} enciendeEn={en('convicción')} tam={260} />
						<Texto en={en('Plata propia')} tam={88}>
							{'plata propia\nes *convicción*'}
						</Texto>
					</Columna>
				</E>

				{/* 3 · fondos y políticos */}
				<E k="fondos">
					<Columna gap={70} style={{marginTop: BAJO_INSIGNIA}}>
						<Fila gap={130}>
							<Columna gap={60}>
								<Icono trazos={ICONOS.edificio} en={en('Fondos')} tam={200} />
								<Texto en={en('Fondos')} tam={56} peso={800}>
									{'fondos'}
								</Texto>
							</Columna>
							<Columna gap={60}>
								<Icono trazos={ICONOS.politico} en={en('políticos')} tam={200} />
								<Texto en={en('políticos')} tam={56} peso={800}>
									{'políticos'}
								</Texto>
							</Columna>
						</Fila>
						<Texto en={en('entrando')} tam={72} style={{marginTop: 20}}>
							{'entrando a acciones\nque *antes no tenían*'}
						</Texto>
					</Columna>
				</E>

				<E k="sector" golpes={[en('pregúntate')]}>
					<Columna gap={30} style={{marginTop: BAJO_INSIGNIA}}>
						<Convergen en={en('gente')} llegaEn={en('llega')} centroEn={en('mismo')} />
						<Cambia alto={200}>
							{frame < en('pregúntate') ? (
								<Texto en={en('Si gente')} tam={70}>
									{'gente *distinta*,\nal *mismo sector*'}
								</Texto>
							) : (
								<Texto en={en('pregúntate')} tam={84}>
									{'pregúntate\n*¿por qué?*'}
								</Texto>
							)}
						</Cambia>
					</Columna>
				</E>

				{/* 4 · redes */}
				<E k="redes">
					<Columna gap={70} style={{marginTop: BAJO_INSIGNIA}}>
						<Cuadricula cantidad={12} columnas={4} en={en('cada vez')} paso={2} tam={120} gap={30} pieza={() => <Burbuja />} />
						<Texto en={en('Y cuatro') + 12} tam={76}>
							{'se mencionan\n*cada vez más*\nen redes'}
						</Texto>
					</Columna>
				</E>

				<E k="posts">
					<Columna gap={70} style={{marginTop: BAJO_INSIGNIA}}>
						<SiNo
							si={en('lee los comentarios')}
							no={en('Pero no leas')}
							etiquetaSi={'los\ncomentarios'}
							etiquetaNo="los posts"
							tam={68}
							ancho={560}
							noPrimero
						/>
					</Columna>
				</E>

				<E k="medidor">
					<Columna gap={50} style={{marginTop: BAJO_INSIGNIA}}>
						<Medidor
							en={en('Si todo')}
							claves={[
								[en('Si todo'), -60],
								[en('eufórico'), 84],
								[en('pelea'), 0],
								[en('oportunidad'), 0],
							]}
							tiembla={[en('pelea'), en('ahí')]}
							topeRojoEn={en('ya vas')}
							topeRojoHasta={en('pelea')}
							enciendeEn={en('oportunidad')}
						/>
						<Cambia alto={280}>
							{frame < en('Si hay') ? (
								<Columna gap={24}>
									<Texto en={en('Si todo')} tam={68}>
										{'si todo el mundo\nestá *eufórico*…'}
									</Texto>
									<Texto en={en('ya vas')} tam={76}>
										{'ya vas *tarde*'}
									</Texto>
								</Columna>
							) : frame < en('Y ahí') ? (
								<Columna gap={24}>
									<Texto en={en('Si hay')} tam={76}>
										{'si hay *pelea*…'}
									</Texto>
									<Texto en={en('todavía')} tam={64} peso={800}>
										{'todavía no hay consenso'}
									</Texto>
								</Columna>
							) : (
								<Texto en={en('Y ahí')} tam={80}>
									{'ahí puede estar\nla *oportunidad*'}
								</Texto>
							)}
						</Cambia>
					</Columna>
				</E>

				<E k="mano">
					<Columna gap={90}>
						<div style={{position: 'relative'}}>
							<Icono trazos={ICONOS.mano} en={en('No lo hagas')} encender={false} tam={280} />
							<div style={{position: 'absolute', left: -20, top: -20}}>
								<RayaRoja en={en('mano')} ancho={320} alto={320} />
							</div>
						</div>
						<Texto en={en('No lo hagas')} tam={92}>
							{'no lo hagas\n*a mano*'}
						</Texto>
					</Columna>
				</E>

				<E k="invora">
					<Columna gap={70}>
						<LogoInvora en={en('Invora')} tam={110} separacion={0.62} />
						<Texto en={en('hace las')} tam={84} style={{marginTop: 30}}>
							{'hace las *cuatro*\npor ti'}
						</Texto>
						<Circulos
							en={en('hace las')}
							marca="check"
							paso={2}
							tam={120}
							enciende={[0, 1, 2, 3].map((i) => en('cuatro', 3) + i * 3)}
						/>
					</Columna>
				</E>

				<E k="comenta">
					<Columna gap={56}>
						<Texto en={en('Comenta')} tam={104}>
							{'comenta *guia*'}
						</Texto>
						<Teclas palabra="GUIA" en={en('GUIA')} paso={4} />
						<Comentario en={en('GUIA') + 8} texto="GUIA" enviaEn={en('GUIA') + 22} />
						<Notificacion en={en('te mando')} titulo="INVORA" texto={'te mando la *guía* paso a paso'} />
					</Columna>
				</E>

				<E k="cierre" salida={false}>
					<Columna gap={70}>
						<LogoInvora en={ESCENAS.cierre} tam={110} separacion={0.62} />
						<Texto en={en('Miguel')} tam={92} style={{marginTop: 20}}>
							{'soy *Miguel*'}
						</Texto>
					</Columna>
				</E>
			</AbsoluteFill>
		</Dinamico.Provider>
	);
};
