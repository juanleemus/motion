// Día 12 · Google, la más barata de las 4 gigantes — Escuela Invora.
// Cada animación entra en la palabra exacta del audio guía.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, Cifra, Columna, Dinamico, Escena, Fila, FUENTE, Fondo, Icono, Insignia, Logo, LogoInvora, Texto} from '../robots/ui';
import {ChatInvora, Comentario, Notificacion, RayaRoja, SiNo, Tachado, Teclas} from '../robots/piezas';
import {ICONOS} from '../robots/iconos';
import {LOGOS12 as L} from '../logos';
import {Grafica, Titular, Torta} from './piezas';
import {en, finDe} from './tiempos';
import {ESCENAS} from './escenas';

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

// Los 5 pisos de Google: insignia numerada con puntos de progreso.
const PISOS_GOOGLE = [
	{k: 'energia', etiqueta: 'energía', en: en('En energía')},
	{k: 'chips', etiqueta: 'chips', en: en('En chips')},
	{k: 'nube', etiqueta: 'nube', en: en('En nube')},
	{k: 'modelo', etiqueta: 'modelo', en: en('Modelo')},
	{k: 'apps', etiqueta: 'apps', en: en('En apps')},
] as const;

// Logo con una raya roja encima (se tacha en `tachaEn`).
const LogoTachado: React.FC<{logo: {archivo: string; alto: number}; en: number; tachaEn: number}> = ({logo, en: entra, tachaEn}) => {
	const ancho = Math.round(logo.alto * 4.95) + 60;
	const alto = logo.alto + 60;
	return (
		<div style={{position: 'relative', width: ancho, height: alto}}>
			<Logo {...logo} en={entra} />
			<RayaRoja en={tachaEn} ancho={ancho} alto={alto} />
		</div>
	);
};

export const Reel12: React.FC = () => {
	const frame = useCurrentFrame();
	const piso = [...PISOS_GOOGLE].reverse().find((p) => frame >= p.en - 3) ?? PISOS_GOOGLE[0];
	const nPiso = PISOS_GOOGLE.indexOf(piso) + 1;
	return (
		<Dinamico.Provider value>
			<AbsoluteFill style={{fontFamily: FUENTE}}>
				<Fondo />

				{/* Portada: el primer fotograma ya es un titular legible (fijo 3 s) */}
				<E k="portada">
					<Columna gap={26}>
						<Texto en={0} sinEntrada tam={100}>
							{'la más barata\nde las'}
						</Texto>
						<Texto en={0} sinEntrada tam={128} color={C.azul} style={{textShadow: `0 0 40px ${C.brillo}, 0 6px 16px rgba(0,0,0,0.9)`}}>
							{'4 gigantes'}
						</Texto>
						<Texto en={0} sinEntrada tam={100}>
							{'de la IA'}
						</Texto>
					</Columna>
				</E>

				<E k="cadena">
					<Columna gap={110}>
						<Icono trazos={ICONOS.cadena} en={ESCENAS.cadena + 2} tam={300} />
						<Texto en={en('inteligencia')} tam={92}>
							{'toda la *cadena*\nde la IA'}
						</Texto>
					</Columna>
				</E>

				<E k="meta" golpes={[en('subió')]}>
					<Columna gap={50}>
						<Logo {...L.meta} en={en('Meta', 1)} alto={L.meta.alto * 1.25} />
						<Texto en={en('es una')} tam={92}>
							{'es una y\n*ya subió*'}
						</Texto>
						<Grafica forma="sube" en={en('ya subió')} dur={18} ancho={640} alto={300} />
					</Columna>
				</E>

				<E k="barata">
					<Columna gap={110}>
						<Icono trazos={ICONOS.etiqueta} en={en('Hay otra')} tam={300} />
						<Texto en={en('Hay otra') + 6} tam={96}>
							{'hay otra\n*más barata*'}
						</Texto>
					</Columna>
				</E>

				<E k="perdiendo">
					<Columna gap={110}>
						<Icono trazos={ICONOS.flechaAbajo} en={en('Todo el mundo')} tam={280} />
						<Texto en={en('cree que')} tam={92}>
							{'todos creen que\n*va perdiendo*'}
						</Texto>
					</Columna>
				</E>

				<E k="dia12">
					<Columna gap={125}>
						<Insignia numero={12} etiqueta="de 100" en={en('Día 12')} />
						<Icono
							trazos={ICONOS.calendario}
							en={en('Día 12') + 4}
							tam={260}
							extra={(dibujo) => (
								<g opacity={dibujo > 0.4 ? 1 : 0} fontFamily={FUENTE} textAnchor="middle" fill={C.blanco}>
									<text x={50} y={36} fontSize={12} fontWeight={800}>
										día
									</text>
									<text x={50} y={84} fontSize={36} fontWeight={900}>
										12
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

				<E k="torta">
					<Columna gap={90}>
						<div style={{height: 190, display: 'flex', alignItems: 'center'}}>
							{frame < en('Si tienes') ? (
								<Texto en={en('La IA es')} tam={84}>
									{'la IA es una *torta*\nde *5 pisos*'}
								</Texto>
							) : frame < en('Si alquilas') ? (
								<Texto en={en('te quedas')} tam={84}>
									{'con los 5, te quedas\ncon *toda la ganancia*'}
								</Texto>
							) : frame < en('el dueño') ? (
								<Texto en={en('Si alquilas')} tam={84}>
									{'si *alquilas* uno…'}
								</Texto>
							) : (
								<Texto en={en('el dueño')} tam={84}>
									{'el dueño te pone\n*el ritmo*'}
								</Texto>
							)}
						</div>
						<Torta
							dibujaEn={en('torta')}
							pisos={[
								{nombre: 'energía', en: en('Energía')},
								{nombre: 'chips', en: en('chips')},
								{nombre: 'centros de datos', en: en('centros')},
								{nombre: 'modelos', en: en('modelos')},
								{nombre: 'aplicaciones', en: en('aplicaciones')},
							]}
							brillaEn={en('los cinco', 1)}
							alquila={{indice: 1, en: en('alquilas')}}
						/>
					</Columna>
				</E>

				<E k="chat">
					<Columna gap={60}>
						<Texto en={en('Le pedí')} tam={84}>
							{'le pedí a *Invora*'}
						</Texto>
						<ChatInvora
							en={en('Le pedí') + 4}
							pregunta="¿quién tiene los 5 pisos de la IA?"
							escribeDesde={en('que revisara')}
							escribeHasta={finDe('los cinco', 2)}
							respondeEn={finDe('los cinco', 2) + 3}
							respuesta="salen *4*"
							respuestaEn={en('Salen')}
						/>
					</Columna>
				</E>

				<E k="cuatro" golpes={[en('Google', 1)]}>
					<Columna gap={60}>
						<Texto en={ESCENAS.cuatro + 2} tam={96}>
							{'salen *4*'}
						</Texto>
						<div style={{display: 'grid', gridTemplateColumns: '400px 400px', gap: 40, justifyItems: 'center', alignItems: 'center'}}>
							<Logo archivo={L.amazon.archivo} en={en('Amazon')} alto={100} ancho={320} />
							<Logo archivo={L.microsoft.archivo} en={en('Microsoft')} alto={100} ancho={320} />
							<Logo archivo={L.meta.archivo} en={en('Meta', 2)} alto={100} ancho={320} />
							<Logo archivo={L.google.archivo} en={en('Google', 1)} alto={100} ancho={320} />
						</div>
					</Columna>
				</E>

				<E k="numeroUno" golpes={[en('Google', 2)]}>
					<Columna gap={70}>
						<Insignia numero={1} etiqueta="la número uno" en={en('Y la número')} />
						<LogoTachado logo={L.meta} en={en('Meta', 3)} tachaEn={finDe('Meta', 3)} />
						<Logo {...L.google} en={en('Google', 2)} alto={150} />
					</Columna>
				</E>

				{/* Insignia de los 5 pisos de Google (1 energía … 5 apps) */}
				<Escena desde={ESCENAS.energia} hasta={ESCENAS.veces}>
					<div style={{position: 'absolute', top: 0}}>
						<Insignia key={nPiso} numero={nPiso} etiqueta={piso.etiqueta} en={piso.en} puntos={{total: 5, activo: nPiso}} />
					</div>
				</Escena>

				<E k="energia" golpes={[en('tres') + 12]}>
					<Columna gap={40} style={{marginTop: 150}}>
						<Icono trazos={ICONOS.rayo} en={en('En energía')} tam={200} />
						<Cifra valor={3} en={en('tres')} antes="+" tam={260} dur={12} />
						<Texto en={en('gigavatios')} tam={70}>
							{'gigavatios de\n*nuclear* asegurados'}
						</Texto>
					</Columna>
				</E>

				<E k="chips">
					<Columna gap={50} style={{marginTop: 150}}>
						<Icono trazos={ICONOS.chip} en={en('En chips')} tam={200} />
						<Texto en={en('los suyos')} tam={92}>
							{'los *suyos*'}
						</Texto>
						<Logo {...L.anthropic} en={en('Anthropic')} />
						<Texto en={en('le alquila')} tam={76}>
							{'le alquila *millones*'}
						</Texto>
					</Columna>
				</E>

				<E k="nube" golpes={[en('514') + 22]}>
					<Columna gap={30} style={{marginTop: 150}}>
						<Icono trazos={ICONOS.nube} en={en('En nube')} tam={190} />
						<Cifra valor={514} en={en('514')} tam={260} />
						<Texto en={en('mil millones')} tam={68}>
							{'mil millones de dólares'}
						</Texto>
						<Texto en={en('contratos')} tam={64} peso={800} style={{marginTop: 20}}>
							{'en *contratos firmados*'}
						</Texto>
					</Columna>
				</E>

				<E k="modelo" golpes={[en('950') + 22]}>
					<Columna gap={40} style={{marginTop: 150}}>
						<Logo {...L.gemini} en={en('Gemini')} alto={L.gemini.alto * 1.1} />
						<Cifra valor={950} en={en('950')} antes="+" tam={250} />
						<Texto en={en('millones de usuarios')} tam={72}>
							{'millones de usuarios\n*al mes*'}
						</Texto>
					</Columna>
				</E>

				<E k="apps">
					<Columna gap={50} style={{marginTop: 150}}>
						<Icono trazos={ICONOS.lupa} en={en('búsqueda')} tam={190} />
						<Texto en={en('búsqueda')} tam={76}>
							{'*búsqueda*'}
						</Texto>
						<Fila gap={24}>
							<Logo {...L.youtube} en={en('YouTube')} />
							<Logo {...L.android} en={en('Android')} />
							<Logo {...L.gmail} en={en('Gmail')} />
						</Fila>
					</Columna>
				</E>

				<E k="veces" golpes={[en('17') + 22]}>
					<Fila gap={20} style={{alignItems: 'flex-start'}}>
						<Columna gap={30} style={{width: 420}}>
							<Logo {...L.google} en={en('unas 17')} alto={64} />
							<Cifra valor={17} en={en('17')} tam={230} />
							<Texto en={en('utilidades')} tam={52} peso={800}>
								{'veces\nutilidades'}
							</Texto>
						</Columna>
						<Columna gap={30} style={{width: 420}}>
							<div style={{height: 124, display: 'flex', alignItems: 'center'}}>
								<Texto en={en('contra')} tam={64} peso={800} color={C.gris}>
									{'las otras'}
								</Texto>
							</div>
							<div style={{height: 230, display: 'flex', alignItems: 'center'}}>
								<Texto en={en('20 a 27')} tam={124} color={C.gris}>
									{'20–27'}
								</Texto>
							</div>
							<Texto en={en('de las otras')} tam={52} peso={800} color={C.gris}>
								{'veces\nutilidades'}
							</Texto>
						</Columna>
					</Fila>
				</E>

				<E k="caida" golpes={[en('casi 20') + 22]}>
					<Columna gap={40}>
						<Texto en={en('Entonces')} tam={80}>
							{'¿por qué está casi'}
						</Texto>
						<Fila gap={30}>
							<Cifra valor={20} en={en('casi 20')} despues="%" tam={250} />
							<Icono trazos={ICONOS.flechaAbajo} en={en('casi 20') + 6} enciendeEn={en('abajo')} tam={140} />
						</Fila>
						<Texto en={en('abajo')} tam={110}>
							{'*abajo*?'}
						</Texto>
					</Columna>
				</E>

				<E k="plana">
					<Columna gap={70}>
						<Grafica
							forma="plana"
							en={en('Porque desde')}
							dur={en('avanzado') - en('Porque desde')}
							ancho={720}
							alto={330}
							marcas={[{punto: 4, texto: 'desde febrero', en: en('febrero')}]}
						/>
						<Texto en={en('sus modelos')} tam={80}>
							{'sus modelos casi\n*no han avanzado*'}
						</Texto>
					</Columna>
				</E>

				<E k="ojo" golpes={[en('volver')]}>
					<Columna gap={50}>
						<Icono trazos={ICONOS.ojo} en={en('Ojo')} tam={180} />
						<Texto en={en('Ojo')} tam={100}>
							{'*ojo*'}
						</Texto>
						<Texto en={en('esto no quiere')} tam={60} peso={800}>
							{'esto no quiere decir que'}
						</Texto>
						<Tachado texto="vaya a volver" en={en('vaya')} tachaEn={en('volver')} caeEn={finDe('volver') + 4} tam={96} />
					</Columna>
				</E>

				<E k="titular">
					<Columna gap={56}>
						<Texto en={en('Pero cuando')} tam={72}>
							{'cuando los *titulares*\ndigan'}
						</Texto>
						<Logo {...L.google} en={en('Google', 3)} alto={70} />
						<Titular
							en={en('titulares')}
							texto="google volvió"
							escribeDesde={en('Google volvió')}
							escribeHasta={finDe('Google volvió')}
						/>
					</Columna>
				</E>

				<E k="pasado">
					<Columna gap={110}>
						<Texto en={en('la caída')} tam={72}>
							{'la caída ya va a\nhaber *pasado*'}
						</Texto>
						<Grafica
							forma="bajaSube"
							en={en('la caída')}
							dur={finDe('pasado') - en('la caída')}
							ancho={680}
							alto={320}
							marcas={[
								{punto: 3, texto: 'la caída', en: en('caída'), abajo: true},
								{punto: 6, texto: 'ya pasó', en: en('pasado')},
							]}
						/>
						<Fila gap={26} style={{marginTop: 20}}>
							<Texto en={en('como ya vimos')} tam={60} peso={800} style={{whiteSpace: 'nowrap'}}>
								{'como pasó con'}
							</Texto>
							<Logo {...L.meta} en={en('Meta', 4)} alto={64} />
						</Fila>
					</Columna>
				</E>

				<E k="comenta">
					<Columna gap={56}>
						<Fila gap={30}>
							<Texto en={en('Comenta')} tam={104}>
								{'comenta'}
							</Texto>
							<Logo {...L.google} en={en('Google', 4)} alto={70} />
						</Fila>
						<Teclas palabra="GOOGLE" en={en('Google', 4)} paso={4} tam={118} />
						<Comentario en={en('Google', 4) + 8} texto="GOOGLE" enviaEn={en('Google', 4) + 30} />
						<Notificacion en={en('te mando')} titulo="INVORA" texto={'te mando el *análisis completo*'} />
					</Columna>
				</E>

				<E k="gringos" golpes={[en('aquí no')]}>
					<SiNo si={en('Esto los gringos')} no={en('aquí no')} etiquetaSi="los gringos" subSi="hace años" etiquetaNo="aquí no" />
				</E>

				<E k="cierre" salida={false}>
					<Columna gap={50}>
						<Texto en={en('Por eso')} tam={84}>
							{'por eso armé'}
						</Texto>
						<LogoInvora en={en('Invora', 3)} tam={100} />
						<Texto en={en('Soy Miguel')} tam={80} style={{marginTop: 20}}>
							{'soy *Miguel*'}
						</Texto>
						<div style={{marginTop: 30}}>
							<Insignia numero={13} etiqueta="mañana: día 13" en={en('mañana')} />
						</div>
					</Columna>
				</E>
			</AbsoluteFill>
		</Dinamico.Provider>
	);
};
