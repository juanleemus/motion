// Día 7 · Energía — Escuela Invora. Cada animación entra en la palabra exacta del audio guía.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, Cifra, Columna, Dinamico, Escena, Fila, FUENTE, Fondo, Icono, Insignia, Logo, LogoInvora, Texto} from '../../robots/ui';
import {
	ChatInvora,
	Comentario,
	Cuadricula,
	GraficaBrecha,
	Medidor,
	Notificacion,
	SiNo,
	Tachado,
	TarjetaNombre,
	Teclas,
} from '../../robots/piezas';
import {ICONOS} from '../../robots/iconos';
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

// Reactor modular en miniatura para la fila "en serie".
const ModuloMini: React.FC = () => (
	<svg viewBox="0 0 100 100" width="100%" height="100%">
		<path d="M50 8 L88 27 L50 46 L12 27Z" fill={C.azulOscuro} stroke={C.blanco} strokeWidth={5} strokeLinejoin="round" />
		<path d="M12 27 V71 L50 92 V46Z" fill={C.azul} stroke={C.blanco} strokeWidth={5} strokeLinejoin="round" />
		<path d="M88 27 V71 L50 92 V46Z" fill={C.azul} stroke={C.blanco} strokeWidth={5} strokeLinejoin="round" />
	</svg>
);

// El rayo se enciende y luego parpadea hasta quedar casi apagado ("sin luz").
const apagon = (frame: number, desde: number) => {
	const t = frame - desde;
	if (t < 0) return 1;
	const parpadeo = [1, 0.25, 1, 0.9, 0.2, 0.6, 0.15];
	return t < parpadeo.length * 2 ? parpadeo[Math.floor(t / 2)] : 0.18;
};

export const ReelDia7: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Dinamico.Provider value>
			<AbsoluteFill style={{fontFamily: FUENTE}}>
				<Fondo />

				{/* Portada: el primer fotograma ya es un titular legible */}
				<E k="portada">
					<Columna gap={70}>
						<Texto en={0} sinEntrada tam={112}>
							{'la IA tiene un\n*problema*'}
						</Texto>
						<Columna gap={26}>
							<Texto en={en('no se resuelve')} tam={56} peso={800} color={C.gris}>
								{'no se resuelve con'}
							</Texto>
							<Fila gap={40}>
								<Icono trazos={ICONOS.chip} en={en('más chips')} tam={170} encender={false} />
								<Tachado texto="más chips" en={en('más chips')} tachaEn={en('chips') + 6} tam={92} />
							</Fila>
						</Columna>
					</Columna>
				</E>

				<E k="sinLuz" golpes={[en('luz')]}>
					<Columna gap={110}>
						<div style={{opacity: apagon(frame, en('luz'))}}>
							<Icono trazos={ICONOS.rayo} en={en('Se está')} tam={320} />
						</div>
						<Texto en={en('Se está')} tam={100}>
							{'se está quedando\n*sin luz*'}
						</Texto>
					</Columna>
				</E>

				<E k="nvidia">
					<Columna gap={70}>
						<Texto en={en('El CEO')} tam={64} peso={800} color={C.gris}>
							{'el CEO de'}
						</Texto>
						<Logo {...LOGOS.nvidia} en={en('Nvidia')} />
						<Texto en={en('ya dijo')} tam={92} style={{marginTop: 30}}>
							{'ya dijo cuál es\nla *solución*'}
						</Texto>
					</Columna>
				</E>

				<E k="inversores" golpes={[en('misma empresa')]}>
					<Columna gap={50}>
						<Logo {...LOGOS.amazon} en={en('Amazon', 1)} />
						<Fila gap={26}>
							<TarjetaNombre nombre="Soros" en={en('Soros', 1)} tam={50} />
							<TarjetaNombre nombre="Peter Thiel" en={en('Peter')} tam={50} />
						</Fila>
						<Icono trazos={ICONOS.empresa} en={en('metieron')} enciendeEn={en('misma empresa')} tam={210} />
						<Texto en={en('metieron')} tam={74}>
							{'metieron *plata* en\nla *misma empresa*'}
						</Texto>
					</Columna>
				</E>

				<E k="dia7">
					<Columna gap={125}>
						<Insignia numero={7} etiqueta="de 12" en={en('Día 7')} />
						<Icono
							trazos={ICONOS.calendario}
							en={en('Día 7') + 4}
							tam={260}
							extra={(dibujo) => (
								<g opacity={dibujo > 0.4 ? 1 : 0} fontFamily={FUENTE} textAnchor="middle" fill={C.blanco}>
									<text x={50} y={36} fontSize={12} fontWeight={800}>
										día
									</text>
									<text x={50} y={83} fontSize={42} fontWeight={900}>
										7
									</text>
								</g>
							)}
						/>
						<Texto en={en('de la escuela')} tam={84}>
							{'de la escuela'}
						</Texto>
						<LogoInvora en={en('Invora', 1)} />
					</Columna>
				</E>

				<E k="centro" golpes={[en('ciudad')]}>
					<Columna gap={70}>
						<Texto en={en('centro')} tam={60} peso={800} color={C.gris}>
							{'un centro de datos de IA'}
						</Texto>
						<Fila gap={50}>
							<Icono trazos={ICONOS.servidor} en={en('centro')} tam={230} />
							<Texto en={en('la misma', 2)} tam={130}>
								{'='}
							</Texto>
							<Icono trazos={ICONOS.ciudad} en={en('ciudad')} tam={230} />
						</Fila>
						<Texto en={en('gasta')} tam={80}>
							{'gasta la misma\n*electricidad* que\nuna *ciudad entera*'}
						</Texto>
					</Columna>
				</E>

				<E k="red" golpes={[en('llena')]}>
					<Columna gap={60}>
						<Icono trazos={ICONOS.torre} en={en('y en muchas')} tam={240} enciendeEn={en('la red')} />
						<Texto en={en('Estados', 1)} tam={58} peso={800}>
							{'en muchas partes de *EE.\u00a0UU.*'}
						</Texto>
						<Medidor en={en('la red')} llenaEn={en('llena')} etiqueta="la red eléctrica" />
						<Texto en={en('llena')} tam={96}>
							{'ya está *llena*'}
						</Texto>
					</Columna>
				</E>

				<E k="dondeSale">
					<Columna gap={110}>
						<Icono trazos={ICONOS.enchufe} en={en('De dónde')} tam={300} />
						<Texto en={en('De dónde')} tam={92}>
							{'¿de dónde está\nsaliendo la *energía*?'}
						</Texto>
					</Columna>
				</E>

				{/* Insignia que enumera las opciones: 1 solar y eólica, 2 gas, 3 nuclear */}
				<Escena desde={ESCENAS.solar} hasta={ESCENAS.brutal}>
					<div style={{position: 'absolute', top: 0}}>
						{frame < ESCENAS.gas ? (
							<Insignia numero={1} etiqueta="solar y eólica" en={en('Tanto')} puntos={{total: 3, activo: 1}} />
						) : frame < ESCENAS.nuclear ? (
							<Insignia numero={2} etiqueta="gas" en={en('Las turbinas')} puntos={{total: 3, activo: 2}} />
						) : (
							<Insignia numero={3} etiqueta="nuclear" en={en('Queda')} puntos={{total: 3, activo: 3}} />
						)}
					</div>
				</Escena>

				<E k="solar">
					<Columna gap={100} style={{marginTop: 120}}>
						<Fila gap={70}>
							<Icono trazos={ICONOS.sol} en={en('solar')} tam={240} />
							<Icono trazos={ICONOS.molino} en={en('eólica')} tam={240} />
						</Fila>
						<Columna gap={20}>
							<Texto en={en('no son')} tam={60} peso={800} color={C.gris}>
								{'no son'}
							</Texto>
							<Tachado texto="constantes" en={en('no son')} tachaEn={en('constantes') + 4} tam={104} />
						</Columna>
					</Columna>
				</E>

				<E k="gas">
					<Columna gap={100} style={{marginTop: 120}}>
						<Icono trazos={ICONOS.llama} en={en('turbinas')} tam={290} />
						<Texto en={en('vendidas')} tam={92}>
							{'turbinas *vendidas*\npor años'}
						</Texto>
					</Columna>
				</E>

				<E k="nuclear">
					<Columna gap={100} style={{marginTop: 120}}>
						<Icono trazos={ICONOS.atomo} en={en('Queda')} tam={300} />
						<Texto en={en('Queda')} tam={100}>
							{'queda la\n*nuclear*'}
						</Texto>
					</Columna>
				</E>

				<E k="brutal" golpes={[en('brutal')]}>
					<Columna gap={110}>
						<Icono trazos={ICONOS.alerta} en={en('pero la de')} tam={290} />
						<Texto en={en('pero la de')} tam={92}>
							{'pero tienen un\nproblema *brutal*'}
						</Texto>
					</Columna>
				</E>

				<E k="plantas">
					<Columna gap={90}>
						<Fila gap={60}>
							<Icono trazos={ICONOS.planta} en={en('dos', 1)} tam={250} />
							<Icono trazos={ICONOS.planta} en={en('dos', 1) + 6} tam={250} />
						</Fila>
						<Texto en={en('Y las últimas')} tam={80}>
							{'las últimas\n*dos plantas* de\nEE.\u00a0UU.'}
						</Texto>
						<Texto en={en('costaron')} tam={60} peso={800} color={C.gris}>
							{'costaron…'}
						</Texto>
					</Columna>
				</E>

				<E k="costo" golpes={[en('35.000') + 22]}>
					<Columna gap={30}>
						<Texto en={en('alrededor')} tam={60} peso={800} color={C.gris}>
							{'alrededor de'}
						</Texto>
						<Cifra valor={35000} miles antes="$" en={en('35.000')} tam={190} dur={26} />
						<Texto en={en('millones', 1)} tam={84}>
							{'millones de dólares'}
						</Texto>
					</Columna>
				</E>

				<E k="tarde" golpes={[en('siete') + 22]}>
					<Fila gap={40} style={{alignItems: 'flex-start'}}>
						<Columna gap={20} style={{width: 410}}>
							<Cifra valor={2} antes="×" en={en('doble')} tam={230} dur={14} />
							<Texto en={en('doble')} tam={54} peso={800}>
								{'más del *doble*\nde lo planeado'}
							</Texto>
						</Columna>
						<Columna gap={20} style={{width: 410}}>
							<Cifra valor={7} en={en('siete')} tam={230} dur={14} />
							<Texto en={en('siete')} tam={54} peso={800}>
								{'años\n*tarde*'}
							</Texto>
						</Columna>
					</Fila>
				</E>

				<E k="reactores">
					<Columna gap={100}>
						<Icono trazos={ICONOS.modulo} en={en('La solución para')} enciendeEn={en('reactores')} tam={300} />
						<Columna gap={14}>
							<Texto en={en('La solución para')} tam={64} peso={800} color={C.gris}>
								{'la solución:'}
							</Texto>
							<Texto en={en('reactores')} tam={100}>
								{'*reactores*\n*modulares*'}
							</Texto>
						</Columna>
					</Columna>
				</E>

				<E k="serie">
					<Columna gap={70}>
						<Cuadricula cantidad={8} columnas={4} en={en('Fabricarlos')} paso={3} tam={150} gap={40} pieza={() => <ModuloMini />} />
						<Texto en={en('Fabricarlos')} tam={84}>
							{'fabricarlos\n*en serie*'}
						</Texto>
						<Texto en={en('armarlos')} tam={60} peso={800}>
							{'y armarlos *donde*\n*se necesiten*'}
						</Texto>
					</Columna>
				</E>

				<E k="chat">
					<Columna gap={60}>
						<Fila gap={30}>
							<Texto en={en('Le pregunté')} tam={64}>
								{'le pregunté a'}
							</Texto>
						</Fila>
						<LogoInvora en={en('Invora', 2)} tam={80} />
						<ChatInvora
							en={en('Le pregunté')}
							pregunta="¿qué empresa tiene todo esto junto?"
							escribeDesde={en('qué empresa')}
							escribeHasta={finDe('junto')}
							respondeEn={finDe('junto') + 3}
						/>
					</Columna>
				</E>

				<E k="xenergy" golpes={[en('X-energy')]}>
					<Columna gap={80}>
						<Logo {...LOGOS.xenergy} en={en('X-energy')} />
						<Icono trazos={ICONOS.pastilla} en={en('hace su')} enciendeEn={en('combustible')} tam={230} />
						<Texto en={en('hace su')} tam={86}>
							{'hace su propio\n*combustible*'}
						</Texto>
					</Columna>
				</E>

				<E k="licencia" golpes={[en('50') + 16]}>
					<Columna gap={50}>
						<Icono trazos={ICONOS.licencia} en={en('Tiene la primera')} enciendeEn={en('licencia')} tam={220} />
						<Texto en={en('Tiene la primera')} tam={70}>
							{'la primera *licencia*\nde fabricación nuclear'}
						</Texto>
						<Texto en={en('que otorga')} tam={46} peso={800} color={C.gris}>
							{'que otorga EE.\u00a0UU.\nen los últimos'}
						</Texto>
						<Fila gap={30}>
							<Cifra valor={50} en={en('50')} tam={220} dur={16} />
							<Texto en={en('50')} tam={90}>
								{'años'}
							</Texto>
						</Fila>
					</Columna>
				</E>

				<E k="plata" golpes={[en('500') + 22]}>
					<Columna gap={40}>
						<Texto en={en('y acaba')} tam={60} peso={800} color={C.gris}>
							{'acaba de recibir'}
						</Texto>
						<Cifra valor={500} antes="$" en={en('500')} tam={250} />
						<Texto en={en('millones', 2)} tam={76}>
							{'millones de dólares'}
						</Texto>
						<Fila gap={30} style={{marginTop: 30}}>
							<Logo {...LOGOS.amazon} en={en('Amazon', 2)} alto={LOGOS.amazon.alto * 0.75} />
							<TarjetaNombre nombre="Ken Griffin" en={en('Ken')} tam={46} />
						</Fila>
					</Columna>
				</E>

				<E k="objetivo" golpes={[en('hoy')]}>
					<Columna gap={60}>
						<Texto en={en('Y el precio')} tam={72}>
							{'el *precio objetivo*\nde los analistas'}
						</Texto>
						<GraficaBrecha en={en('Y el precio')} objetivoEn={en('muy por encima')} brechaEn={en('hoy')} />
						<Texto en={en('muy por encima')} tam={60} peso={800}>
							{'muy *por encima* de hoy'}
						</Texto>
					</Columna>
				</E>

				<E k="ojo">
					<Columna gap={50}>
						<Icono trazos={ICONOS.ojo} en={en('Ojo')} tam={180} />
						<Texto en={en('Ojo')} tam={100}>
							{'*ojo*'}
						</Texto>
						<Texto en={en('una brecha')} tam={64} peso={800}>
							{'una brecha así'}
						</Texto>
						<div style={{position: 'relative', height: 220, width: 860, display: 'flex', justifyContent: 'center'}}>
							{frame < en('Existe') ? (
								<Tachado texto="es un regalo" en={en('una brecha')} tachaEn={en('no es')} caeEn={finDe('regalo') + 4} tam={92} />
							) : (
								<Texto en={en('Existe')} tam={84}>
									{'existe por\n*alguna razón*'}
								</Texto>
							)}
						</div>
					</Columna>
				</E>

				<E k="comenta">
					<Columna gap={50}>
						<Texto en={en('Comenta')} tam={104}>
							{'comenta *energía*'}
						</Texto>
						<Teclas palabra="ENERGÍA" en={en('energía', 4)} paso={2} tam={104} />
						<Comentario en={en('energía', 4) + 6} texto="ENERGÍA" enviaEn={en('energía', 4) + 16} />
						<Notificacion en={en('te mando')} titulo="INVORA" texto={'te mando qué compraron *Thiel y Soros*'} />
					</Columna>
				</E>

				<E k="contratos" golpes={[en('tres') + 14]}>
					<Fila gap={40} style={{alignItems: 'flex-start'}}>
						<Columna gap={40} style={{width: 410}}>
							<Texto en={en('Por un lado')} tam={48} peso={800} color={C.gris}>
								{'por un lado'}
							</Texto>
							<Icono trazos={ICONOS.contrato} en={en('contratos')} tam={220} />
							<Texto en={en('contratos')} tam={64}>
								{'los\n*contratos*'}
							</Texto>
						</Columna>
						<Columna gap={40} style={{width: 410}}>
							<Texto en={en('por el otro')} tam={48} peso={800} color={C.gris}>
								{'por el otro'}
							</Texto>
							<div style={{height: 220, display: 'flex', alignItems: 'center'}}>
								<Cifra valor={3} en={en('tres')} tam={240} dur={12} />
							</div>
							<Texto en={en('riesgos')} tam={56}>
								{'*riesgos*\ndetrás de\nla brecha'}
							</Texto>
						</Columna>
					</Fila>
				</E>

				<E k="gringos" golpes={[en('Aquí todavía')]}>
					<SiNo si={en('gringos')} no={en('Aquí todavía')} etiquetaSi="los gringos" subSi="hace años" etiquetaNo="aquí todavía no" />
				</E>

				<E k="cierre" salida={false}>
					<Columna gap={50}>
						<Texto en={en('Por esto')} tam={84}>
							{'por esto armé'}
						</Texto>
						<LogoInvora en={en('Invora', 3)} tam={100} />
						<Texto en={en('Soy Miguel')} tam={80} style={{marginTop: 20}}>
							{'soy *Miguel*'}
						</Texto>
						<div style={{marginTop: 30}}>
							<Insignia numero={8} etiqueta="mañana: día 8" en={en('mañana')} />
						</div>
					</Columna>
				</E>
			</AbsoluteFill>
		</Dinamico.Provider>
	);
};
