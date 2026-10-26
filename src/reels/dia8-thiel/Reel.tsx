// Día 8 · Thiel — Escuela Invora. Cada animación entra en la palabra exacta del audio guía.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, Cifra, Columna, Dinamico, Escena, Fila, FUENTE, Fondo, Icono, Insignia, Logo, LogoInvora, Texto} from '../../robots/ui';
import {ChatInvora, Comentario, Cuadricula, Notificacion, SiNo, Tachado, TarjetaNombre, Teclas} from '../../robots/piezas';
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

// Piezas en miniatura para las cuadrículas.
const EmpresaMini: React.FC = () => (
	<svg viewBox="0 0 100 100" width="100%" height="100%">
		<path d="M18 92 V18 h46 v74Z" fill={C.azul} stroke={C.blanco} strokeWidth={5} strokeLinejoin="round" />
		<path d="M64 92 V44 h20 v48Z" fill={C.azulOscuro} stroke={C.blanco} strokeWidth={5} strokeLinejoin="round" />
		<path d="M30 32 v1 M42 32 v1 M52 32 v1 M30 48 v1 M42 48 v1 M52 48 v1" stroke={C.tinta} strokeWidth={6} strokeLinecap="round" />
	</svg>
);
const PersonaMini: React.FC = () => (
	<svg viewBox="0 0 100 100" width="100%" height="100%">
		<path d="M16 92c0-20 15-33 34-33s34 13 34 33Z" fill={C.azul} stroke={C.blanco} strokeWidth={5} strokeLinejoin="round" />
		<circle cx={50} cy={30} r={18} fill={C.azulOscuro} stroke={C.blanco} strokeWidth={5} />
	</svg>
);

export const ReelDia8: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<Dinamico.Provider value>
			<AbsoluteFill style={{fontFamily: FUENTE}}>
				<Fondo />

				{/* Portada: el primer fotograma ya es un titular legible */}
				<E k="portada">
					<Columna gap={60}>
						<TarjetaNombre nombre="Peter Thiel" en={en('Thiel', 1)} tam={56} />
						<Texto en={0} sinEntrada tam={108}>
							{'*6 meses*\nsin comprar'}
						</Texto>
						<Tachado texto="ni una sola acción" en={en('una sola')} tachaEn={en('nada')} caeEn={finDe('nada') + 2} tam={68} />
					</Columna>
				</E>

				<E k="plata" golpes={[en('419') + 22]}>
					<Columna gap={30}>
						<Texto en={en('Y de repente')} tam={60} peso={800} color={C.gris}>
							{'y de repente mete'}
						</Texto>
						<Cifra valor={419} antes="$" en={en('419')} tam={240} />
						<Texto en={en('millones', 1)} tam={72}>
							{'millones de dólares'}
						</Texto>
						<div style={{marginTop: 30}}>
							<Cuadricula cantidad={8} columnas={4} en={en('ocho')} paso={2} tam={120} gap={30} pieza={() => <EmpresaMini />} />
						</div>
						<Texto en={en('ocho')} tam={80}>
							{'en *8 empresas*'}
						</Texto>
					</Columna>
				</E>

				<E k="fundador">
					<Columna gap={70}>
						<Texto en={en('Cuando')} tam={64} peso={800} color={C.gris}>
							{'el que fundó'}
						</Texto>
						<Fila gap={30}>
							<Logo {...LOGOS.paypal} en={en('PayPal')} />
							<Logo {...LOGOS.palantir} en={en('Palantir')} />
						</Fila>
						<Texto en={en('se despierta')} tam={96}>
							{'se *despierta*\nasí'}
						</Texto>
					</Columna>
				</E>

				<E k="mirar">
					<Columna gap={100}>
						<Icono trazos={ICONOS.lupa} en={en('Hay que mirar')} tam={290} />
						<Texto en={en('Hay que mirar')} tam={96}>
							{'hay que mirar\n*qué compró*'}
						</Texto>
					</Columna>
				</E>

				<E k="dia8">
					<Columna gap={125}>
						<Insignia numero={8} etiqueta="de 12" en={en('día 8')} />
						<Icono
							trazos={ICONOS.calendario}
							en={en('día 8') + 4}
							tam={260}
							extra={(dibujo) => (
								<g opacity={dibujo > 0.4 ? 1 : 0} fontFamily={FUENTE} textAnchor="middle" fill={C.blanco}>
									<text x={50} y={36} fontSize={12} fontWeight={800}>
										día
									</text>
									<text x={50} y={83} fontSize={42} fontWeight={900}>
										8
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

				<E k="chat" golpes={[en('es una sola')]}>
					<Columna gap={56}>
						<Texto en={en('Le pedí')} tam={64}>
							{'le pedí a'}
						</Texto>
						<LogoInvora en={en('Invora', 2)} tam={80} />
						<ChatInvora
							en={en('Le pedí')}
							pregunta="desármame el portafolio de Thiel"
							escribeDesde={en('que me desarmara')}
							escribeHasta={finDe('portafolio')}
							respondeEn={finDe('portafolio') + 3}
							respuesta="es *una sola máquina*"
							respuestaEn={en('es una sola')}
						/>
					</Columna>
				</E>

				<E k="electricidad">
					<Columna gap={110}>
						<Icono trazos={ICONOS.rayo} en={en('La electricidad')} tam={300} />
						<Texto en={en('La electricidad')} tam={100}>
							{'la *electricidad*\nde la IA'}
						</Texto>
					</Columna>
				</E>

				{/* Insignia que enumera la máquina: 1 producirla, 2 moverla, 3 gastarla */}
				<Escena desde={ESCENAS.producir} hasta={ESCENAS.chips}>
					<div style={{position: 'absolute', top: 0}}>
						{frame < ESCENAS.mover ? (
							<Insignia numero={1} etiqueta="producirla" en={en('Producir')} puntos={{total: 3, activo: 1}} />
						) : frame < ESCENAS.gastar ? (
							<Insignia numero={2} etiqueta="moverla" en={en('Moverla')} puntos={{total: 3, activo: 2}} />
						) : (
							<Insignia numero={3} etiqueta="gastarla" en={en('gastarla')} puntos={{total: 3, activo: 3}} />
						)}
					</div>
				</Escena>

				<E k="producir">
					<Columna gap={50} style={{marginTop: 120}}>
						<Texto en={en('Producir')} tam={80}>
							{'producir la *energía*'}
						</Texto>
						<Logo {...LOGOS.vistra} en={en('Vistra')} />
						<Logo {...LOGOS.vista} en={en('Vista Energy')} />
						<Logo {...LOGOS.xenergy} en={en('X-energy')} />
					</Columna>
				</E>

				<E k="mover" golpes={[en('cuatro') + 14]}>
					<Columna gap={50} style={{marginTop: 120}}>
						<Fila gap={30}>
							<Cifra valor={4} en={en('cuatro')} tam={200} dur={12} />
							<Texto en={en('empresas', 2)} tam={62} style={{textAlign: 'left'}}>
								{'empresas de\n*redes eléctricas*'}
							</Texto>
						</Fila>
						<Fila gap={30}>
							<Logo {...LOGOS.aep} en={en('American')} />
							<Logo {...LOGOS.dte} en={en('DTE')} />
						</Fila>
						<Fila gap={30}>
							<Logo {...LOGOS.firstenergy} en={en('FirstEnergy')} />
							<Logo {...LOGOS.cms} en={en('CMS')} />
						</Fila>
					</Columna>
				</E>

				<E k="gastar" golpes={[en('Amazon')]}>
					<Columna gap={50} style={{marginTop: 120}}>
						<Texto en={en('su posición')} tam={62} peso={800}>
							{'su posición *más grande*'}
						</Texto>
						<Logo {...LOGOS.amazon} en={en('Amazon')} />
						<Icono trazos={ICONOS.servidor} en={en('centros')} enciendeEn={en('absurdas')} tam={200} />
						<Texto en={en('consumen')} tam={66}>
							{'centros de datos que\nconsumen cantidades\n*absurdas* de luz'}
						</Texto>
					</Columna>
				</E>

				<E k="chips">
					<Columna gap={90} style={{alignItems: 'stretch', width: 860}}>
						<Fila gap={40} style={{justifyContent: 'flex-start', opacity: frame >= en('Thiel', 2) ? 0.45 : 1}}>
							<Icono trazos={ICONOS.chip} en={en('todo el mundo')} tam={190} encender={false} />
							<Texto en={en('todo el mundo')} tam={62} style={{textAlign: 'left'}}>
								{'todo el mundo:\nlos chips'}
							</Texto>
						</Fila>
						<Fila gap={40} style={{justifyContent: 'flex-start'}}>
							<Icono trazos={ICONOS.rayo} en={en('Thiel', 2)} enciendeEn={en('electricidad', 2)} tam={190} />
							<Texto en={en('Thiel', 2)} tam={62} style={{textAlign: 'left'}}>
								{'Thiel: la\n*electricidad* que\nprende esos chips'}
							</Texto>
						</Fila>
					</Columna>
				</E>

				<E k="ojo">
					<Columna gap={44}>
						<Icono trazos={ICONOS.ojo} en={en('Ojo')} tam={170} />
						<Texto en={en('Ojo')} tam={100}>
							{'*ojo*'}
						</Texto>
						<Texto en={en('que Thiel compre')} tam={56} peso={800}>
							{'que Thiel compre\nno significa que'}
						</Texto>
						<div style={{position: 'relative', height: 220, width: 860, display: 'flex', justifyContent: 'center'}}>
							{frame < en('Él tiene') ? (
								<Tachado
									texto="tú debas comprar"
									en={en('que tú')}
									tachaEn={en('comprar', 2) + 4}
									caeEn={finDe('comprar', 2) + 4}
									tam={86}
								/>
							) : (
								<Texto en={en('Él tiene')} tam={74}>
									{'él tiene otra *plata*\ny otro *horizonte*'}
								</Texto>
							)}
						</div>
					</Columna>
				</E>

				<E k="dinero">
					<Columna gap={100}>
						<Icono trazos={ICONOS.brujula} en={en('Pero sí')} enciendeEn={en('mirando')} tam={290} />
						<Texto en={en('Pero sí')} tam={80}>
							{'para dónde mira\nel *dinero grande*'}
						</Texto>
					</Columna>
				</E>

				<E k="trimestre">
					<Columna gap={100}>
						<Icono trazos={ICONOS.calendario} en={en('Los movimientos')} enciendeEn={en('trimestre')} tam={270} />
						<Texto en={en('Los movimientos')} tam={76}>
							{'los movimientos de\nThiel salen cada\n*trimestre*'}
						</Texto>
					</Columna>
				</E>

				<E k="comenta">
					<Columna gap={56}>
						<Texto en={en('Comenta')} tam={96}>
							{'comenta *Thiel*'}
						</Texto>
						<Teclas palabra="THIEL" en={en('Thiel', 5)} paso={3} tam={130} />
						<Comentario en={en('Thiel', 5) + 8} texto="THIEL" enviaEn={en('Thiel', 5) + 20} />
						<Notificacion en={en('acceso')} titulo="INVORA" texto={'te doy *acceso* apenas salgan'} />
					</Columna>
				</E>

				<E k="todos" golpes={[en('absolutamente', 2)]}>
					<Columna gap={60}>
						<Fila gap={16}>
							<TarjetaNombre nombre="Thiel" en={en('Thiel', 6)} tam={42} />
							<TarjetaNombre nombre="Buffett" en={en('Buffett')} tam={42} />
							<TarjetaNombre nombre="Gates" en={en('Gates')} tam={42} />
						</Fila>
						<Cuadricula cantidad={15} columnas={5} en={en('absolutamente', 2)} paso={1} tam={120} gap={34} pieza={() => <PersonaMini />} />
						<Texto en={en('absolutamente', 2)} tam={88}>
							{'absolutamente\n*todos*'}
						</Texto>
					</Columna>
				</E>

				<E k="gringos" golpes={[en('Aquí todavía')]}>
					<SiNo si={en('gringos')} no={en('Aquí todavía')} etiquetaSi="los gringos" subSi="hace años" etiquetaNo="aquí todavía no" />
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
							<Insignia numero={9} etiqueta="mañana: día 9" en={en('mañana')} />
						</div>
					</Columna>
				</E>
			</AbsoluteFill>
		</Dinamico.Provider>
	);
};
