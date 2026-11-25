// "Trump y NVIDIA" — Escuela Invora. Estilo de la referencia (escenas centradas a pantalla completa sobre fondo
// oscuro, un objeto por idea, subtítulos pequeños abajo), sin la persona que habla, con los valores de Invora.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, Dinamico, FUENTE, Fondo, LogoInvora, Texto} from '../../robots/ui';
import {Comentario, Teclas} from '../../robots/piezas';
import {BotonSeguir, IconoMini, LogoChico, Pildora} from '../../robots/columna';
import {FichaPct, PanelTrading, TitularMedio} from '../../robots/objetos';
import {Avatar, Balanza, CelularInvora, Contador, MedidorMiedo, PuntosHistoria, Razones, TermometroVIX} from '../../robots/finanzas';
import {ICONOS as I} from '../../robots/iconos';
import {en, PALABRAS} from './tiempos';
import {ESCENAS} from './escenas';

type K = keyof typeof ESCENAS;
const orden = Object.keys(ESCENAS) as K[];
const hasta = (k: K) => ESCENAS[orden[orden.indexOf(k) + 1]];
const F = 'apoyo-trump-nvidia/fotos';

// Escena centrada en la zona útil (y 280–1380); sale con desvanecido y desenfoque de 0,2 s.
const E: React.FC<{k: K; gap?: number; children: React.ReactNode}> = ({k, gap = 40, children}) => {
	const frame = useCurrentFrame();
	const d = ESCENAS[k], h = hasta(k);
	if (frame < d || frame >= h) return null;
	const s = k === 'cierre' ? 0 : interpolate(frame, [h - 6, h], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: 1 - s, filter: s > 0 ? `blur(${s * 14}px)` : undefined}}>
			<div style={{position: 'absolute', left: 70, width: 940, top: 270, height: 1110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap}}>{children}</div>
		</AbsoluteFill>
	);
};
const Fila: React.FC<{gap?: number; children: React.ReactNode}> = ({gap = 30, children}) => <div style={{display: 'flex', alignItems: 'center', gap}}>{children}</div>;
// Detalle que cambia según la razón que se nombra
const Detalle: React.FC<{tramos: [number, number, string][]}> = ({tramos}) => {
	const frame = useCurrentFrame();
	const t = tramos.find(([a, b]) => frame >= a && frame < b);
	if (!t) return <div style={{height: 120}} />;
	const r = Math.min(1, (frame - t[0]) / 6);
	return (
		<div style={{height: 120, display: 'flex', alignItems: 'center', opacity: r, transform: `translateY(${(1 - r) * 20}px)`}}>
			<Texto en={t[0]} tam={46} peso={800} ancho={900} sinEntrada>
				{t[2]}
			</Texto>
		</div>
	);
};

export const ReelTrumpNvidia: React.FC = () => (
	<Dinamico.Provider value>
		<AbsoluteFill style={{fontFamily: FUENTE}}>
			<Fondo />

			{/* 1. Gancho (portada legible desde el primer fotograma) */}
			<E k="gancho" gap={34}>
				<Texto en={-12} sinEntrada tam={92}>
					{'Trump *compró la caída*\nde NVIDIA'}
				</Texto>
				<Fila gap={40}>
					<Avatar en={-6} foto={`${F}/trump.jpg`} nombre="Trump" tam={200} />
					<LogoChico archivo="nvidia.svg" alto={60} en={en('NVIDIA', 1)} />
				</Fila>
				<PanelTrading en={en('Antes de opinar')} ticker="NVDA · esquema" puntos={[10, 6, -8, -14, -6, 4]} ultimo="compra" tono="azul" ancho={820} alto={360} />
				<Pildora en={en('miremos')} texto="antes de opinar: *los datos*" icono={I.lupa} tipo="acento" giro={-2} tam={44} />
			</E>

			{/* 2. Trump convenció a la junta de traer de vuelta a Jensen Huang */}
			<E k="convencio" gap={40}>
				<Texto en={en('Justo después')} tam={70}>
					{'NVIDIA *se desplomó*…'}
				</Texto>
				<Fila gap={60}>
					<Avatar en={en('Trump dijo')} foto={`${F}/trump.jpg`} nombre="Trump" sub="convenció a la junta" tam={230} />
					<svg width={120} height={60} viewBox="0 0 120 60" style={{opacity: useCurrentFrame() >= en('traer de vuelta') ? 1 : 0.15}}>
						<path d="M5 30 H100 M80 10 L105 30 L80 50" stroke={C.azul} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					<Avatar en={en('Jensen')} foto={`${F}/jensen-huang.jpg`} nombre="Jensen Huang" sub="vuelve como CEO" tam={230} />
				</Fila>
			</E>

			{/* 3. CNBC: la junta lo aprobó, la acción se disparó */}
			<E k="cnbc" gap={40}>
				<TitularMedio en={en('Según CNBC', 1)} medio="CNBC" logo={{archivo: 'cnbc.png', alto: 56}} texto="la junta de NVIDIA aprobó el regreso de *Jensen Huang*" tam={50} />
				<PanelTrading en={en('la acción se disparó')} ticker="NVDA · esquema" puntos={[-6, -8, -7, 4, 12]} ultimo="se disparó" tono="azul" ancho={820} alto={340} />
				<Pildora en={en('uno de sus mejores')} texto="uno de sus *mejores días en meses*" icono={I.sube} tipo="acento" giro={-2} tam={42} />
			</E>

			{/* 4. 103 operaciones por hasta 97,5 millones */}
			<E k="transa" gap={46}>
				<Texto en={en('Y aquí viene')} tam={64} peso={800}>
					{'y aquí viene lo *interesante*'}
				</Texto>
				<Fila gap={24}>
					<LogoChico archivo="cnbc.png" alto={50} en={en('Según CNBC', 2)} />
					<Pildora en={en('segundo mandato')} texto="2.º mandato de Trump" icono={I.capitolio} giro={-2} tam={40} />
				</Fila>
				<Contador en={en('103')} valor={103} etiqueta="operaciones con acciones de NVIDIA" tam={200} />
				<Contador en={en('97.5')} valor={97.5} decimales={1} antes="hasta " despues=" M US$" etiqueta="compras y ventas" tam={110} />
				<Pildora en={en('declaraciones')} texto="declaraciones financieras *públicas*" icono={I.documento} tipo="aviso" giro={-2} tam={42} />
			</E>

			{/* 5. No es ilegal por sí solo; el conflicto de interés es un debate abierto */}
			<E k="legal" gap={30}>
				<Texto en={en('Comprar y vender')} tam={66}>
					{'comprar y vender\n*no es ilegal* por sí solo'}
				</Texto>
				<Balanza en={en('Comprar y vender')} izq="SU PORTAFOLIO" der="EL PAÍS" centro="debate abierto" centroEn={en('debate')} />
			</E>

			{/* 6. Por qué cayó el mercado: tres razones */}
			<E k="razones" gap={40}>
				<Texto en={en('Ahora')} tam={76}>
					{'¿por qué *cayó*\nel mercado?'}
				</Texto>
				<Razones
					items={[
						{en: en('Primero'), num: '01', titulo: 'caos en NVIDIA', logo: 'nvidia.svg'},
						{en: en('Anthropic'), num: '02', titulo: 'salida a bolsa', logo: 'anthropic.svg'},
						{en: en('tercero'), num: '03', titulo: 'la Fed', logo: 'reserva-federal.svg'},
					]}
				/>
				<Detalle
					tramos={[
						[en('Primero'), en('Anthropic'), 'salida de Jensen Huang como CEO\ny una investigación de la *SEC*'],
						[en('Anthropic'), en('tercero'), 'abrió cerca de *111 $* y devolvió\nbuena parte de lo ganado'],
						[en('tercero'), en('Los inversionistas'), 'dejó ver una subida de tasas\n*mayor en diciembre*'],
					]}
				/>
				<Pildora en={en('Los inversionistas')} texto="vendieron *todo a la vez*" icono={I.baja} tipo="negativo" giro={-2} tam={48} />
			</E>

			{/* 7. En una semana */}
			<E k="semana" gap={44}>
				<Texto en={en('En una semana')} tam={76}>
					{'en *una semana*'}
				</Texto>
				<Fila gap={26}>
					<FichaPct en={en('tecnología')} cuentaEn={en('10%')} nombre="TECNOLOGÍA" logo={{archivo: 'tecnologia.svg'}} valor={10} signo="≈ −" tono="rojo" tam={74} />
					<FichaPct en={en('El oro')} cuentaEn={en('9%', 1)} nombre="ORO" logo={{archivo: 'oro.svg'}} valor={9} signo="≈ −" tono="rojo" tam={74} />
					<FichaPct en={en('Bitcoin')} cuentaEn={en('14%')} nombre="BITCOIN" logo={{archivo: 'bitcoin.svg'}} valor={14} signo="≈ −" tono="rojo" tam={74} />
				</Fila>
			</E>

			{/* 8. Índice de miedo y codicia de CNN */}
			<E k="miedo" gap={30}>
				<Texto en={en('El miedo está')} tam={70}>
					{'el miedo está en\n*niveles extremos*'}
				</Texto>
				<MedidorMiedo en={en('El índice')} valor={14} bajaEn={en('cayó a 14')} titulo="Miedo y codicia · CNN" />
				<Pildora en={en('más bajo desde')} texto="el más bajo *desde marzo*" icono={I.calendario} tipo="negativo" giro={-2} tam={44} />
			</E>

			{/* 9. El VIX */}
			<E k="vix" gap={20}>
				<Texto en={en('Y el VIX')} tam={70}>
					{'VIX · el *índice del miedo*'}
				</Texto>
				<TermometroVIX
					en={en('Y el VIX')}
					pasos={[
						{valor: 40, en: en('40'), etiqueta: 'el viernes'},
						{valor: 36, en: en('36'), etiqueta: 'cierre'},
					]}
				/>
				<Pildora en={en('Por encima de 35')} texto="más de 35 = *pánico intenso*" icono={I.alerta} tipo="negativo" giro={-2} tam={44} />
			</E>

			{/* 10. Qué dice la historia */}
			<E k="historia" gap={34}>
				<Texto en={en('Qué nos dice')} tam={70}>
					{'¿qué dice la *historia*?'}
				</Texto>
				<Pildora en={en('Según datos')} texto="VIX sobre 35 desde 2007: *11 veces*" icono={I.calendario} tipo="aviso" giro={-1} tam={42} />
				<PuntosHistoria en={en('11 veces')} total={11} arriba={9} colorEn={en('9', 2)} abajoEn={en('en 2')} />
				<Texto en={en('Un año más tarde')} tam={44} peso={800}>
					{'un año después el S&P estaba\n*más alto en 9* · más bajo en 2'}
				</Texto>
				<Fila gap={20}>
					<Pildora en={en('la investigación')} texto="investigación de la SEC" icono={I.lupa} tipo="negativo" giro={-2} tam={36} />
					<Pildora en={en('una subida', 2)} texto="tasas más altas" icono={I.alerta} tipo="negativo" giro={2} tam={36} />
				</Fila>
			</E>

			{/* 11. Abril de 2025 */}
			<E k="abril" gap={34}>
				<Texto en={en('La última vez')} tam={70}>
					{'la última vez:\n*abril de 2025*'}
				</Texto>
				<Fila gap={30}>
					<Pildora en={en('aranceles', 1)} texto="los aranceles *hundieron el mercado*" icono={I.baja} tipo="negativo" giro={-2} tam={38} />
				</Fila>
				<Contador en={en('52')} valor={52} antes="VIX " etiqueta="niveles de 52" tam={150} color={C.rojo} />
				<Fila gap={30}>
					<Avatar en={en('pausó')} foto={`${F}/trump.jpg`} nombre="Trump" sub="pausó los aranceles" tam={170} />
					<FichaPct en={en('las acciones subieron')} cuentaEn={en('9%', 3)} nombre="EN UN DÍA" logo={{archivo: 'acciones.svg'}} valor={9} signo="+" tono="azul" tam={74} />
				</Fila>
			</E>

			{/* 12. Qué compran las figuras con poder */}
			<E k="poder" gap={40}>
				<Texto en={en('Por eso')} tam={72}>
					{'saber qué compran\nlas figuras con *poder*'}
				</Texto>
				<Pildora en={en('es un dato más')} texto="es *un dato más*" icono={I.grafica} tipo="acento" giro={-2} tam={46} />
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
					<Pildora en={en('No es una recomendación')} texto="no es recomendación" icono={I.alerta} tipo="negativo" giro={-2} tam={40} />
					<Pildora en={en('es información pública')} texto="es *información pública*" icono={I.documento} tipo="aviso" giro={2} tam={40} />
				</div>
			</E>

			{/* 13. En Invora puedes ver qué compran */}
			<E k="app" gap={20}>
				<CelularInvora
					en={en('En Invora')}
					filas={[
						{en: en('compra Trump'), titulo: 'Trump', sub: 'sus compras', foto: `${F}/trump.jpg`},
						{en: en('congresistas'), titulo: 'Congresistas', sub: 'EE. UU.'},
						{en: en('directivos'), titulo: 'Directivos', sub: 'de las empresas'},
						{en: en('fondos'), titulo: 'Fondos', sub: 'de inversión'},
					]}
				/>
			</E>

			{/* 14. Comenta TRUMP */}
			<E k="comenta" gap={40}>
				<Texto en={en('Comenta')} tam={64} peso={800}>
					{'comenta'}
				</Texto>
				<Teclas palabra="TRUMP" en={en('Trump', 6)} paso={3} tam={140} />
				<Comentario en={en('Trump', 6) + 6} texto="TRUMP" enviaEn={en('te enviamos')} />
			</E>

			{/* 15. Cierre */}
			<E k="cierre" gap={70}>
				<Texto en={en('Esto es información')} tam={70} peso={800}>
					{'esto es *información*,\nno recomendaciones'}
				</Texto>
				<BotonSeguir en={en('Sigue')} sigueEn={en('Invora', 2) + 6} />
				<LogoInvora en={en('Esto es información') + 10} tam={120} />
			</E>

		</AbsoluteFill>
	</Dinamico.Provider>
);

export const IconoTrump = IconoMini;
