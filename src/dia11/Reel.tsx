// Día 11 · Natera — Escuela Invora. Cada animación entra en la palabra exacta del audio guía.
import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {
	C,
	Cifra,
	Columna,
	Dinamico,
	Escena,
	Fila,
	FUENTE,
	Fondo,
	Icono,
	Insignia,
	Logo,
	LogoInvora,
	Texto,
	aparece,
	useRebote,
} from '../robots/ui';
import {ChatInvora, Comentario, Cuadricula, Notificacion, SiNo, Tachado, Teclas} from '../robots/piezas';
import {ICONOS} from '../robots/iconos';
import {ICONOS11} from './iconos';
import {en, finDe} from './tiempos';
import {ESCENAS} from './escenas';

const NATERA = {archivo: 'natera.png', alto: 96};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
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

// Muñequito de paciente para la fila de "300 mil pacientes".
const PacienteMini: React.FC<{i: number; desde: number}> = ({i, desde}) => {
	const frame = useCurrentFrame();
	const lleno = aparece(frame, desde + 10 + i * 2, 6);
	return (
		<svg viewBox="0 0 100 100" width="100%" height="100%" style={{overflow: 'visible'}}>
			<path
				d="M16 92c0-20 15-33 34-33s34 13 34 33Z"
				fill={C.azul}
				fillOpacity={lleno}
				stroke={C.blanco}
				strokeWidth={7}
				strokeLinejoin="round"
			/>
			<circle cx={50} cy={30} r={18} fill={C.azulOscuro} fillOpacity={lleno} stroke={C.blanco} strokeWidth={7} />
		</svg>
	);
};

// Renglón con chulo azul que entra con rebote.
const Renglon: React.FC<{en: number; children: string; tam?: number}> = ({en: desde, children, tam = 66}) => {
	const frame = useCurrentFrame();
	const r = useRebote(desde);
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 28,
				width: 820,
				opacity: aparece(frame, desde, 4),
				transform: `translateX(${interpolate(r, [0, 1], [-60, 0])}px)`,
			}}
		>
			<div
				style={{
					width: tam * 1.4,
					height: tam * 1.4,
					borderRadius: tam,
					flexShrink: 0,
					background: C.azul,
					boxShadow: `0 0 30px ${C.brillo}`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transform: `scale(${interpolate(r, [0, 1], [0.4, 1])})`,
				}}
			>
				<svg viewBox="0 0 24 24" width={tam * 0.9} height={tam * 0.9}>
					<path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke={C.tinta} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
			<Texto en={desde} tam={tam} sinEntrada style={{textAlign: 'left'}}>
				{children}
			</Texto>
		</div>
	);
};

// Puntitos casi invisibles que la lupa "no alcanza a ver".
const Restos: React.FC<{desde: number}> = ({desde}) => {
	const frame = useCurrentFrame();
	return (
		<g>
			{Array.from({length: 9}).map((_, i) => {
				const a = random(`ra${i}`) * Math.PI * 2;
				const d = 6 + random(`rd${i}`) * 18;
				const tit = 0.25 + 0.35 * Math.abs(Math.sin((frame - desde) / 9 + i));
				return (
					<circle
						key={i}
						cx={42 + Math.cos(a) * d}
						cy={42 + Math.sin(a) * d}
						r={1.6}
						fill={C.blanco}
						opacity={aparece(frame, desde + 16 + i, 4) * tit}
					/>
				);
			})}
		</g>
	);
};

// Pedacitos de ADN que caen dentro de la gota.
const Pedacitos: React.FC<{desde: number}> = ({desde}) => {
	const frame = useCurrentFrame();
	return (
		<g>
			{Array.from({length: 7}).map((_, i) => {
				const t0 = desde + i * 4;
				const p = interpolate(frame, [t0, t0 + 16], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
				const x = 34 + random(`px${i}`) * 32;
				const y = interpolate(p, [0, 1], [-40, 52 + random(`py${i}`) * 26]);
				const giro = random(`pg${i}`) * 180;
				return (
					<g key={i} transform={`translate(${x} ${y}) rotate(${giro})`} opacity={p > 0 ? 1 : 0}>
						<rect x={-6} y={-2} width={12} height={4} rx={2} fill={C.blanco} />
					</g>
				);
			})}
		</g>
	);
};

export const Reel11: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Dinamico.Provider value>
			<AbsoluteFill style={{fontFamily: FUENTE}}>
				<Fondo />

				{/* Portada fija 3 s: el primer fotograma ya es un titular legible */}
				<E k="portada">
					<Columna gap={30}>
						<Texto en={0} sinEntrada tam={150}>
							{'*30 años*'}
						</Texto>
						<Texto en={0} sinEntrada tam={104}>
							{'ni un solo año\nen *pérdida*'}
						</Texto>
					</Columna>
				</E>

				<E k="druckenmiller">
					<Columna gap={90}>
						<Icono trazos={ICONOS.persona} en={en('Stanley')} tam={300} />
						<Texto en={en('Stanley')} tam={96}>
							{'Stanley\n*Druckenmiller*'}
						</Texto>
					</Columna>
				</E>

				<E k="plata" golpes={[en('865') + 22]}>
					<Columna gap={30}>
						<Texto en={en('hoy tiene')} tam={64} peso={800} color={C.gris}>
							{'hoy tiene'}
						</Texto>
						<Cifra valor={865} en={en('865')} tam={290} antes="$" />
						<Texto en={en('millones', 1)} tam={84}>
							{'millones de dólares'}
						</Texto>
					</Columna>
				</E>

				<E k="empresa">
					<Columna gap={100}>
						<Icono trazos={ICONOS11.edificio} en={en('en una empresa')} tam={300} />
						<Texto en={en('casi nadie')} tam={82}>
							{'una empresa que\n*casi nadie* conoce'}
						</Texto>
					</Columna>
				</E>

				<E k="sangre" golpes={[en('sangre', 1)]}>
					<Columna gap={100}>
						<Icono trazos={ICONOS11.gota} en={en('que busca')} enciendeEn={en('sangre', 1)} tam={300} />
						<Texto en={en('el cáncer', 1)} tam={80}>
							{'busca el *cáncer*\nen un examen\nde *sangre*'}
						</Texto>
					</Columna>
				</E>

				<E k="dia11">
					<Columna gap={125}>
						<Insignia numero={11} etiqueta="de 12" en={en('Día 11')} />
						<Icono
							trazos={ICONOS.calendario}
							en={en('Día 11') + 4}
							tam={260}
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
						<Texto en={en('de la Escuela')} tam={84}>
							{'de la escuela'}
						</Texto>
						<LogoInvora en={en('Invora', 1)} />
					</Columna>
				</E>

				<E k="paciente" golpes={[en('Se fue')]}>
					<Columna gap={70}>
						<Icono trazos={ICONOS.persona} en={en('Después')} tam={260} />
						<Texto en={en('todo paciente')} tam={68}>
							{'todo paciente quiere\nsaber una cosa'}
						</Texto>
						<Texto en={en('Se fue')} tam={150}>
							{'*¿se fue?*'}
						</Texto>
					</Columna>
				</E>

				<E k="restos">
					<Columna gap={100}>
						<Icono
							trazos={ICONOS11.lupa}
							en={en('El problema')}
							enciendeEn={en('pequeños')}
							tam={300}
							extra={() => <Restos desde={en('El problema')} />}
						/>
						<Texto en={en('restos')} tam={84}>
							{'restos tan *pequeños*\nque ningún examen\nlos ve'}
						</Texto>
					</Columna>
				</E>

				<E k="adn">
					<Columna gap={100}>
						<Icono trazos={ICONOS11.adn} en={en('pero las células')} enciendeEn={en('ADN', 1)} tam={300} />
						<Texto en={en('tienen cambios')} tam={80}>
							{'las células de cáncer\ntienen cambios\nen su *ADN*'}
						</Texto>
					</Columna>
				</E>

				<E k="pedacitos">
					<Columna gap={100}>
						<Icono
							trazos={ICONOS11.gota}
							en={en('y pedacitos')}
							enciendeEn={en('sangre', 2)}
							tam={300}
							extra={() => <Pedacitos desde={en('y pedacitos') + 8} />}
						/>
						<Texto en={en('y pedacitos')} tam={80}>
							{'pedacitos de ADN\nquedan en la *sangre*'}
						</Texto>
					</Columna>
				</E>

				<E k="huella">
					<Columna gap={100}>
						<Icono trazos={ICONOS11.huella} en={en('Entonces')} enciendeEn={en('huella')} tam={300} />
						<Texto en={en('huella')} tam={80}>
							{'la *huella*\ndel cáncer\nde cada paciente'}
						</Texto>
					</Columna>
				</E>

				<E k="natera" golpes={[en('Natera', 1)]}>
					<Columna gap={90}>
						<Texto en={en('Y la empresa')} tam={78}>
							{'la empresa que\nvende esta *prueba*\nse llama'}
						</Texto>
						<Logo {...NATERA} en={en('Natera', 1)} alto={NATERA.alto * 1.3} />
					</Columna>
				</E>

				<E k="chat">
					<Columna gap={60}>
						<Texto en={en('Le pregunté')} tam={76}>
							{'le pregunté a *Invora*'}
						</Texto>
						<ChatInvora
							en={en('Le pregunté')}
							pregunta="¿NTRA es buena empresa?"
							escribeDesde={en('Le pregunté') + 6}
							escribeHasta={en('buena empresa') + 4}
							respondeEn={en('buena empresa') + 10}
						/>
					</Columna>
				</E>

				<E k="pacientes" golpes={[en('300') + 22]}>
					<Columna gap={34}>
						<Logo {...NATERA} en={en('Natera', 2)} alto={64} />
						<Texto en={en('Como la historia')} tam={58} peso={800}>
							{'tiene la *historia* de'}
						</Texto>
						<Cifra valor={300} en={en('300')} tam={270} />
						<Texto en={en('mil')} tam={84}>
							{'mil pacientes'}
						</Texto>
						<Cuadricula
							cantidad={10}
							columnas={5}
							en={en('mil')}
							paso={2}
							tam={110}
							gap={34}
							pieza={(i) => <PacienteMini i={i} desde={en('mil')} />}
						/>
					</Columna>
				</E>

				<E k="tratamiento">
					<Columna gap={60}>
						<Renglon en={en('El tratamiento')} tam={68}>{'el *tratamiento*'}</Renglon>
						<Renglon en={en('si el cáncer')} tam={68}>{'si el cáncer\n*volvió*'}</Renglon>
					</Columna>
				</E>

				<E k="ia" golpes={[en('riesgo')]}>
					<Columna gap={100}>
						<Icono
							trazos={ICONOS11.chip}
							en={en('y con esto')}
							enciendeEn={en('inteligencia')}
							tam={280}
							extra={(dibujo, lleno) => (
								<text
									x={50}
									y={61}
									textAnchor="middle"
									fontFamily={FUENTE}
									fontWeight={900}
									fontSize={30}
									fill={lleno > 0.5 ? C.tinta : C.blanco}
									opacity={dibujo > 0.6 ? 1 : 0}
								>
									IA
								</text>
							)}
						/>
						<Texto en={en('inteligencia')} tam={84}>
							{'una *IA* que calcula\nel *riesgo* de que vuelva'}
						</Texto>
					</Columna>
				</E>

				<E k="riesgos" golpes={[en('dos riesgos')]}>
					<Columna gap={100}>
						<Icono trazos={ICONOS.alerta} en={en('Pero Invora')} enciendeEn={en('dos riesgos')} tam={260} />
						<LogoInvora en={en('Pero Invora')} tam={72} />
						<Texto en={en('también me mostró')} tam={88}>
							{'también me mostró\n*dos riesgos*'}
						</Texto>
					</Columna>
				</E>

				{/* Insignia que enumera los riesgos: 1 y 2 (se queda arriba sin saltar) */}
				<Escena desde={ESCENAS.uno} hasta={ESCENAS.comenta}>
					<div style={{position: 'absolute', top: 0}}>
						{frame < ESCENAS.dos ? (
							<Insignia numero={1} etiqueta="riesgo" en={en('Uno')} puntos={{total: 2, activo: 1}} />
						) : (
							<Insignia numero={2} etiqueta="riesgo" en={en('Dos', 2)} puntos={{total: 2, activo: 2}} />
						)}
					</div>
				</Escena>

				<E k="uno">
					<Columna gap={60} style={{marginTop: 120}}>
						<Icono trazos={ICONOS11.chip} en={en('esa IA')} tam={220} />
						<Texto en={en('esa IA')} tam={84}>
							{'esa IA todavía\n*no ha probado*'}
						</Texto>
						<Texto en={en('que mejore')} tam={62} peso={800}>
							{'que mejore la vida\nde los pacientes'}
						</Texto>
					</Columna>
				</E>

				<E k="dos">
					<Columna gap={40} style={{marginTop: 120}}>
						<Icono trazos={ICONOS11.edificio} en={en('Dos', 2)} tam={220} />
						<Texto en={en('la empresa no')} tam={88}>
							{'la empresa'}
						</Texto>
						<Tachado texto="es rentable" en={en('la empresa no')} tachaEn={en('no es rentable')} tam={110} />
					</Columna>
				</E>

				<E k="perdio" golpes={[en('67') + 22]}>
					<Columna gap={30} style={{marginTop: 120}}>
						<Texto en={en('Perdió')} tam={70} peso={800} color={C.gris}>
							{'perdió'}
						</Texto>
						<Cifra valor={67} en={en('67')} tam={300} antes="$" />
						<Texto en={en('millones', 2)} tam={72}>
							{'millones de dólares'}
						</Texto>
						<Texto en={en('el último trimestre')} tam={62} peso={800}>
							{'el último *trimestre*'}
						</Texto>
					</Columna>
				</E>

				<E k="comenta">
					<Columna gap={50}>
						<Fila gap={30}>
							<Texto en={en('Comenta')} tam={96}>
								{'comenta'}
							</Texto>
							<Logo {...NATERA} en={en('Natera', 3)} alto={62} />
						</Fila>
						<Teclas palabra="NATERA" en={en('Natera', 3)} paso={3} tam={120} />
						<Comentario en={en('Natera', 3) + 6} texto="NATERA" enviaEn={en('te mando')} />
						<Notificacion en={en('te mando')} titulo="INVORA" texto={'te mando *todo*'} />
					</Columna>
				</E>

				<E k="lista">
					<Columna gap={50}>
						<Texto en={ESCENAS.lista} sinEntrada tam={64} peso={800} color={C.gris}>
							{'te mando'}
						</Texto>
						<Renglon en={en('el portafolio')} tam={62}>
							{'el *portafolio* de\nDruckenmiller'}
						</Renglon>
						<Renglon en={en('que están')} tam={62}>
							{'qué dicen los\n*analistas*'}
						</Renglon>
						<Renglon en={en('la misma valoración')} tam={62}>
							{'la *valoración*'}
						</Renglon>
					</Columna>
				</E>

				<E k="gringos" golpes={[en('Y aquí')]}>
					<SiNo si={en('gringos')} no={en('Y aquí')} etiquetaSi="los gringos" subSi="hace años" etiquetaNo="aquí todavía no" />
				</E>

				<E k="cierre" salida={false}>
					<Columna gap={50}>
						<Texto en={en('Por esto')} tam={84}>
							{'por esto armé'}
						</Texto>
						<LogoInvora en={en('Invora', 4)} tam={100} />
						<Texto en={en('Soy Miguel')} tam={80} style={{marginTop: 20}}>
							{'soy *Miguel*'}
						</Texto>
						<div style={{marginTop: 30}}>
							<Insignia numero={12} etiqueta="mañana: día 12" en={en('mañana')} />
						</div>
					</Columna>
				</E>
			</AbsoluteFill>
		</Dinamico.Provider>
	);
};
