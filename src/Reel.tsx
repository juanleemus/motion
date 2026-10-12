// Día 5 · Uber — Escuela Invora. Cada animación entra en la palabra exacta del audio guía.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, Columna, Dinamico, Escena, Fila, FUENTE, Fondo, Icono, Insignia, Logo, LogoInvora, Texto, Cifra} from './robots/ui';
import {Caravana, Carretera, Robotaxi} from './robots/carros';
import {ChatInvora, Comentario, Cuadricula, Notificacion, RayaRoja, SiNo, Tachado, Teclas} from './robots/piezas';
import {ICONOS} from './robots/iconos';
import {en, finDe} from './tiempos';
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

const AppMini: React.FC<{encendida: boolean}> = ({encendida}) => (
	<div
		style={{
			width: '100%',
			height: '100%',
			borderRadius: 34,
			background: encendida ? C.azul : '#1d2638',
			border: `3px solid ${encendida ? C.azul : 'rgba(255,255,255,0.35)'}`,
			boxShadow: encendida ? `0 0 40px ${C.brillo}` : '0 10px 24px rgba(0,0,0,0.5)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<svg viewBox="0 0 100 100" width="62%" height="62%">
			<path
				d="M10 70 V54 l11 -20 c2 -4 5 -6 10 -6 h38 c5 0 8 2 10 6 l11 20 v16 c0 3 -2 5 -5 5 H15 c-3 0 -5 -2 -5 -5Z"
				fill="none"
				stroke={encendida ? C.tinta : C.blanco}
				strokeWidth={7}
				strokeLinejoin="round"
			/>
		</svg>
	</div>
);

const CarroMini: React.FC = () => (
	<svg viewBox="-4 0 108 100" width="100%" height="100%">
		<path
			d="M10 70 V54 l11 -20 c2 -4 5 -6 10 -6 h38 c5 0 8 2 10 6 l11 20 v16 c0 3 -2 5 -5 5 H15 c-3 0 -5 -2 -5 -5Z"
			fill={C.azul}
			stroke={C.blanco}
			strokeWidth={6}
			strokeLinejoin="round"
		/>
		<circle cx={28} cy={75} r={9} fill={C.azulOscuro} stroke={C.blanco} strokeWidth={5} />
		<circle cx={72} cy={75} r={9} fill={C.azulOscuro} stroke={C.blanco} strokeWidth={5} />
	</svg>
);

export const Reel: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Dinamico.Provider value>
		<AbsoluteFill style={{fontFamily: FUENTE}}>
			<Fondo />

			{/* Portada: el primer fotograma ya es un titular legible */}
			<E k="portada">
				<Columna gap={60}>
					<Texto en={0} sinEntrada tam={124}>
						{'la gente está\n*vendiendo*\nuber'}
					</Texto>
					<Logo {...LOGOS.uber} en={en('Uber', 1)} />
				</Columna>
			</E>

			{/* Insignia que enumera a los que compran: 1 CEO, 2 Pelosi, 3 Ackman */}
			<Escena desde={ESCENAS.ceo} hasta={ESCENAS.feo}>
				<div style={{position: 'absolute', top: 0}}>
					{frame < ESCENAS.pelosi ? (
						<Insignia numero={1} etiqueta="el CEO de uber" en={en('CEO')} puntos={{total: 3, activo: 1}} />
					) : frame < ESCENAS.ackman ? (
						<Insignia numero={2} etiqueta="Nancy Pelosi" en={en('Nancy')} puntos={{total: 3, activo: 2}} />
					) : (
						<Insignia numero={3} etiqueta="Bill Ackman" en={en('Bill')} puntos={{total: 3, activo: 3}} />
					)}
				</div>
			</Escena>

			<E k="ceo">
				<Columna gap={70} style={{marginTop: 120}}>
					<Logo {...LOGOS.uber} en={en('Uber', 2)} alto={LOGOS.uber.alto * 1.3} />
					<Texto en={en('está comprando', 1)} tam={100}>
						{'está\n*comprando*'}
					</Texto>
				</Columna>
			</E>

			<E k="plata" golpes={[en('10 millones') + 22]}>
				<Columna gap={20} style={{marginTop: 120}}>
					<Cifra valor={10} en={en('10 millones')} tam={340} antes="$" />
					<Texto en={en('millones')} tam={84}>
						{'millones de dólares'}
					</Texto>
					<Texto en={en('propia plata')} tam={64} peso={800} style={{marginTop: 30}}>
						{'de su *propia plata*'}
					</Texto>
				</Columna>
			</E>

			<E k="pelosi">
				<Columna gap={60} style={{marginTop: 120}}>
					<Icono trazos={ICONOS.persona} en={en('Nancy')} tam={300} />
					<Texto en={en('también compró')} tam={100}>
						{'también\n*compró*'}
					</Texto>
				</Columna>
			</E>

			<E k="ackman">
				<Columna gap={60} style={{marginTop: 120}}>
					<Texto en={en('tiene más plata')} tam={72}>
						{'tiene más plata en'}
					</Texto>
					<Logo {...LOGOS.uber} en={en('Uber', 3)} alto={LOGOS.uber.alto * 1.2} />
					<Texto en={en('cualquier otra')} tam={72}>
						{'que en *cualquier*\n*otra acción*'}
					</Texto>
				</Columna>
			</E>

			<E k="feo" golpes={[en('equivocando')]}>
				<Columna gap={110}>
					<Icono trazos={ICONOS.alerta} en={en('Alguien')} tam={300} />
					<Texto en={en('equivocando')} tam={100}>
						{'alguien se está\n*equivocando feo*'}
					</Texto>
				</Columna>
			</E>

			<E k="dia5">
				<Columna gap={125}>
					<Insignia numero={5} etiqueta="de 12" en={en('Día 5')} />
					<Icono
						trazos={ICONOS.calendario}
						en={en('Día 5') + 4}
						tam={260}
						extra={(dibujo, lleno) => (
							<g opacity={dibujo > 0.4 ? 1 : 0} fontFamily={FUENTE} textAnchor="middle">
								<text x={50} y={36} fontSize={12} fontWeight={800} fill={C.blanco}>
									día
								</text>
								<text x={50} y={83} fontSize={42} fontWeight={900} fill={lleno > 0.5 ? C.blanco : C.blanco}>
									5
								</text>
							</g>
						)}
					/>
					<Texto en={en('de la Escuela')} tam={84}>
						{'de la escuela'}
					</Texto>
					<LogoInvora en={en('Invora', 1)} />
				</Columna>
			</E>

			<E k="miedo">
				<Columna gap={110}>
					<Icono trazos={ICONOS.fantasma} en={en('miedo', 1)} tam={300} />
					<Texto en={en('A qué le')} tam={96}>
						{'¿a qué le tiene\n*miedo* la gente?'}
					</Texto>
				</Columna>
			</E>

			<E k="carros">
				<Columna gap={110}>
					<Icono trazos={ICONOS.robotaxi} en={en('carros', 1)} tam={320} />
					<Texto en={en('A los carros')} tam={96}>
						{'carros que se\nmanejan *solos*'}
					</Texto>
				</Columna>
			</E>

			<E k="waymo">
				<Columna gap={44}>
					<Logo {...LOGOS.waymo} en={en('Waymo', 1)} alto={LOGOS.waymo.alto * 1.25} />
					<Fila gap={24}>
						<Texto en={en('de Google')} tam={56} peso={800} color={C.gris}>
							{'de'}
						</Texto>
						<Logo {...LOGOS.google} en={en('Google')} alto={LOGOS.google.alto * 0.8} />
					</Fila>
					<Texto en={en('taxis sin')} tam={70} style={{marginTop: 30}}>
						{'ya tiene taxis\n*sin conductor*'}
					</Texto>
					<Texto en={en('varias ciudades')} tam={50} peso={800}>
						{'en varias ciudades\nde Estados Unidos'}
					</Texto>
				</Columna>
			</E>

			<E k="tesla">
				<Columna gap={60}>
					<Logo {...LOGOS.tesla} en={en('Tesla')} alto={LOGOS.tesla.alto * 1.2} />
					<Icono trazos={ICONOS.red} en={en('red')} tam={240} />
					<Texto en={en('armando')} tam={88}>
						{'está armando\nsu *propia red*'}
					</Texto>
				</Columna>
			</E>

			<E k="pregunta">
				<Columna gap={70}>
					<Texto en={en('la pregunta', 1)} tam={70} peso={800} color={C.blanco}>
						{'la pregunta es *obvia*'}
					</Texto>
					<Fila gap={40}>
						<Logo {...LOGOS.waymo} en={en('Waymo', 2)} />
						<Icono trazos={ICONOS.robotaxi} en={en('el carro', 1)} tam={170} />
					</Fila>
					<Texto en={en('para qué')} tam={92}>
						{'¿para qué\nnecesita a'}
					</Texto>
					<Logo {...LOGOS.uber} en={en('Uber', 4)} alto={LOGOS.uber.alto * 1.2} />
				</Columna>
			</E>

			<E k="chat" golpes={[en('cambia todo')]}>
				<Columna gap={56}>
					<Texto en={en('una sola')} tam={70}>
						{'le hice *una sola*\n*pregunta*'}
					</Texto>
					<ChatInvora
						en={en('Entonces')}
						pregunta="si los robotaxis matan a uber… ¿por qué los de adentro están comprando?"
						escribeDesde={en('si los robotaxis')}
						escribeHasta={finDe('están comprando', 1)}
						respondeEn={en('Y la respuesta')}
					/>
					<Texto en={en('cambia todo')} tam={84}>
						{'la respuesta\n*cambia todo*'}
					</Texto>
				</Columna>
			</E>

			<E k="unaODos" golpes={[en('dos empresas') + 14]}>
				<Columna gap={34}>
					<Texto en={en('El miedo supone')} tam={58} peso={800} color={C.gris}>
						{'el miedo supone que'}
					</Texto>
					<Texto en={en('una o dos')} tam={104}>
						{'*una o dos*\nempresas'}
					</Texto>
					<div style={{position: 'relative', width: 860, height: 470}}>
						<Carretera ancho={860} alto={470} carriles={[118, 262]} en={en('El miedo supone')} />
						<Caravana en={en('todos', 1)} cantidad={7} y={44} ancho={830} />
						<Robotaxi logo={LOGOS.tesla.archivo} en={en('dos empresas')} x={468} y={118} escala={0.95} alturaLogo={42} />
						<Robotaxi logo={LOGOS.waymo.archivo} en={en('una o dos')} x={4} y={262} escala={1.15} alturaLogo={48} />
					</div>
					<Texto en={en('van a tener')} tam={68}>
						{'van a tener *todos*\nlos carros autónomos'}
					</Texto>
				</Columna>
			</E>

			<E k="flotas">
				<Columna gap={40}>
					<Texto en={en('Pero y si')} tam={70} peso={800}>
						{'¿y si hay'}
					</Texto>
					<Cifra valor={10} en={en('diez', 1)} tam={300} />
					<Cuadricula
						cantidad={10}
						columnas={5}
						en={en('flotas')}
						paso={2}
						tam={130}
						gap={24}
						pieza={() => <CarroMini />}
					/>
					<Texto en={en('flotas')} tam={84}>
						{'flotas *distintas*?'}
					</Texto>
				</Columna>
			</E>

			<E k="apps">
				<Columna gap={70}>
					<div style={{position: 'relative'}}>
						<Cuadricula
							cantidad={10}
							columnas={5}
							en={en('diez', 2)}
							paso={2}
							tam={140}
							gap={28}
							pieza={(i, enc) => <AppMini encendida={enc} />}
							destacada={{indice: 7, en: en('Vas a abrir', 2)}}
						/>
						<RayaRoja en={en('Tú no vas')} ancho={5 * 140 + 4 * 28} alto={2 * 140 + 28} hasta={en('Vas a abrir', 2)} />
					</div>
					<div style={{position: 'relative', height: 200, width: 860, display: 'flex', justifyContent: 'center'}}>
						{frame < en('Vas a abrir', 2) ? (
							<Texto en={en('Diez apps')} tam={80}>
								{'*diez apps*\npara comparar'}
							</Texto>
						) : (
							<Texto en={en('Vas a abrir', 2)} tam={80}>
								{'vas a abrir *la que*\nte muestra'}
							</Texto>
						)}
					</div>
				</Columna>
			</E>

			<E k="cerca">
				<Columna gap={110}>
					<Icono trazos={ICONOS.telefono} en={en('el carro', 2)} tam={320} />
					<Texto en={en('el carro', 2)} tam={88}>
						{'el carro *más cerca*\ny *más barato*'}
					</Texto>
				</Columna>
			</E>

			<E k="esaApp" golpes={[en('Uber', 6)]}>
				<Columna gap={70}>
					<Texto en={en('Y esa app')} tam={84}>
						{'y esa app…\npodría ser'}
					</Texto>
					<Logo {...LOGOS.uber} en={en('Uber', 6)} alto={LOGOS.uber.alto * 1.6} />
				</Columna>
			</E>

			<E k="ojo">
				<Columna gap={50}>
					<Fila gap={10}>
						<Icono trazos={ICONOS.ojo} en={en('Ojo')} tam={180} />
					</Fila>
					<Texto en={en('Ojo')} tam={100}>
						{'*ojo*'}
					</Texto>
					<Texto en={en('eso no quiere')} tam={64} peso={800}>
						{'eso no quiere decir que'}
					</Texto>
					<Tachado
						texto={'los de adentro\ntengan razón'}
						en={en('los de adentro', 2)}
						tachaEn={en('tengan razón')}
						caeEn={finDe('tengan razón') + 4}
						tam={84}
					/>
				</Columna>
			</E>

			<E k="apostando">
				<Columna gap={110}>
					<Icono trazos={ICONOS.ficha} en={en('Pero ahora')} tam={280} />
					<Texto en={en('Pero ahora')} tam={76}>
						{'ahora sabes en qué\nestán *apostando*'}
					</Texto>
				</Columna>
			</E>

			<E k="comenta">
				<Columna gap={60}>
					<Texto en={en('Comenta')} tam={110}>
						{'comenta *uber*'}
					</Texto>
					<Teclas palabra="UBER" en={en('UBER', 7)} paso={4} />
					<Comentario en={en('UBER', 7) + 8} texto="UBER" enviaEn={en('UBER', 7) + 22} />
					<Notificacion en={en('te mando')} titulo="INVORA" texto={'te mando *todo* lo que encontró'} />
				</Columna>
			</E>

			<E k="gringos" golpes={[en('Aquí no')]}>
				<Columna gap={70}>
					<SiNo si={en('gringos')} no={en('Aquí no')} etiquetaSi="los gringos" subSi="hace años" etiquetaNo="aquí no" />
				</Columna>
			</E>

			<E k="cierre" salida={false}>
				<Columna gap={50}>
					<Texto en={en('Por eso')} tam={84}>
						{'por eso armé'}
					</Texto>
					<LogoInvora en={en('Invora', 4)} tam={100} />
					<Texto en={en('Soy Miguel')} tam={80} style={{marginTop: 20}}>
						{'soy *Miguel*'}
					</Texto>
					<div style={{marginTop: 30}}>
						<Insignia numero={6} etiqueta="mañana: día 6" en={en('mañana')} />
					</div>
				</Columna>
			</E>
		</AbsoluteFill>
		</Dinamico.Provider>
	);
};

