// "NVIDIA resultados" — Escuela Invora. Columna que se llena por secciones sobre un video de apoyo
// oscurecido; cada cifra entra y cuenta en la palabra exacta de la voz editada.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, Cifra, Dinamico, Escena, FUENTE, Fondo, LogoInvora, Texto} from '../../robots/ui';
import {Tachado} from '../../robots/piezas';
import {
	BarrasComparadas,
	BotonSeguir,
	EtiquetaSeccion,
	FilaCifra,
	FondoSeccion,
	FranjaDato,
	LogoChico,
	Pildora,
	SeccionColumna,
	TarjetaClara,
	TarjetaVacia,
	TituloSeccion,
} from '../../robots/columna';
import {ICONOS as I} from '../../robots/iconos';
import {en} from './tiempos';
import {ESCENAS} from './escenas';
import {FONDOS} from './fondos';
import {LOGOS} from './logos';

const orden = Object.keys(ESCENAS) as (keyof typeof ESCENAS)[];
const hasta = (k: keyof typeof ESCENAS) => ESCENAS[orden[orden.indexOf(k) + 1]];
const S: React.FC<{k: keyof typeof ESCENAS; gap?: number; children: React.ReactNode}> = ({k, gap, children}) => (
	<SeccionColumna desde={ESCENAS[k]} hasta={hasta(k)} gap={gap}>
		{children}
	</SeccionColumna>
);
const FOTOS = 'apoyo-nvidia-resultados/fotos';

// Cifra con su unidad chica debajo (para "22.100 millones").
const CifraUnidad: React.FC<{valor: number; en: number; unidad: string; tam?: number}> = ({valor, en, unidad, tam = 96}) => (
	<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4}}>
		<Cifra valor={valor} en={en} miles tam={tam} dur={16} />
		<div style={{fontFamily: FUENTE, fontWeight: 800, fontSize: 24, letterSpacing: '0.22em', color: C.gris, textTransform: 'uppercase'}}>{unidad}</div>
	</div>
);

export const ReelNvidiaResultados: React.FC = () => (
	<Dinamico.Provider value>
		<AbsoluteFill style={{fontFamily: FUENTE}}>
			<Fondo />
			<FondoSeccion tramos={FONDOS} />

			{/* ---------- Pregunta (portada: el primer fotograma ya es un titular legible) ---------- */}
			<S k="pregunta">
				<EtiquetaSeccion texto="Resultados de NVIDIA" en={-12} />
				<TituloSeccion texto={'¿por qué tanto\n*miedo* a NVIDIA?'} en={-12} sinEntrada tam={92} />
				<div style={{display: 'flex', alignItems: 'center', gap: 28}}>
					<LogoChico {...LOGOS.nvidia} en={en('NVIDIA', 1)} />
					<Pildora en={en('presentar')} texto="presentó *resultados*" icono={I.documento} giro={-2} tam={40} />
				</div>
				<Pildora en={en('le ganó')} texto="le ganó a *todo lo esperado*" icono={I.sube} tipo="acento" giro={2} tam={48} />
			</S>

			{/* ---------- Ventas del trimestre ---------- */}
			<S k="ventas">
				<EtiquetaSeccion texto="Vamos con los números" en={en('Vamos con')} />
				<TituloSeccion texto={'en *3 meses*\nvendió'} icono={I.calendario} en={en('En tres meses')} tam={86} />
				<FranjaDato
					en={en('115.800')}
					dato={<Cifra valor={115800} en={en('115.800')} miles tam={108} dur={20} />}
					etiquetas={['millones', 'de dólares']}
				/>
				<BarrasComparadas
					en={en('Se esperaban', 1)}
					titulo="Ventas · millones de dólares"
					barras={[
						{etiqueta: 'vendió', valor: 115800, texto: '115.800', en: en('Se esperaban', 1)},
						{etiqueta: 'se esperaban', valor: 109000, texto: '109.000', en: en('109.000'), tono: 'gris'},
					]}
				/>
				<Pildora en={en('más del doble')} texto="más del *doble* que hace un año" icono={I.sube} tipo="acento" giro={-2} tam={46} />
			</S>

			{/* ---------- Centros de datos ---------- */}
			<S k="datos">
				<EtiquetaSeccion texto="De esos" en={en('De esos')} />
				<FranjaDato
					en={en('107.000')}
					dato={<Cifra valor={107000} en={en('107.000')} miles tam={108} dur={20} />}
					etiquetas={['millones', 'de dólares']}
				/>
				<TituloSeccion texto={'salieron de\n*centros de datos*'} icono={I.servidor} en={en('salieron')} tam={66} />
				<TarjetaClara en={en('los chips')} icono={I.chip} texto="los chips para la *inteligencia artificial*" />
			</S>

			{/* ---------- Ganancia por acción y margen ---------- */}
			<S k="accion">
				<EtiquetaSeccion texto="Por acción" en={en('Por acción')} />
				<FilaCifra en={en('ganó', 2)} etiqueta="Ganó por acción" cifra={<Cifra valor={2.68} decimales={2} despues=" US$" en={en('2.68')} tam={92} dur={16} />} />
				<FilaCifra
					en={en('Se esperaban', 2)}
					etiqueta="Se esperaban"
					cifra={<Cifra valor={2.48} decimales={2} despues=" US$" en={en('2.48')} tam={92} dur={16} color={C.gris} />}
				/>
				<BarrasComparadas
					en={en('Y de cada')}
					titulo="De cada 100 dólares que vende"
					max={100}
					barras={[
						{etiqueta: 'vende', valor: 100, texto: '100 US$', en: en('100'), tono: 'gris'},
						{etiqueta: 'le quedan casi', valor: 75, texto: '75 US$', en: en('75')},
					]}
				/>
				<Pildora en={en('fabricar')} texto="después de *fabricar*" icono={I.chip} tipo="aviso" giro={-2} tam={44} />
			</S>

			{/* ---------- Proyección del próximo trimestre ---------- */}
			<S k="proyeccion">
				<EtiquetaSeccion texto="Próximo trimestre" en={en('Para el próximo')} />
				<TituloSeccion texto="*proyecta*" logo={LOGOS.nvidia} en={en('NVIDIA proyecta')} tam={92} />
				<FranjaDato
					en={en('130.000')}
					dato={<Cifra valor={130000} en={en('130.000')} miles tam={108} dur={20} />}
					etiquetas={['millones', 'de dólares']}
				/>
				<Pildora en={en('margen')} texto="con un margen de *± 3 %*" icono={I.grafica} tipo="aviso" giro={-2} tam={46} />
				<BarrasComparadas
					en={en('El mercado espera')}
					titulo="Próximo trimestre · millones de dólares"
					barras={[
						{etiqueta: 'NVIDIA proyecta', valor: 130000, texto: '130.000', en: en('El mercado espera')},
						{etiqueta: 'el mercado espera', valor: 125000, texto: '125.000', en: en('125.000'), tono: 'gris'},
					]}
				/>
			</S>

			{/* ---------- Sin Jensen Huang ---------- */}
			<S k="jensen">
				<EtiquetaSeccion texto="Y todo esto" en={en('Y todo esto')} />
				<TituloSeccion texto={'en sus *primeros*\nresultados'} en={en('primeros')} tam={92} />
				<div style={{display: 'flex', alignItems: 'center', gap: 34}}>
					<TarjetaVacia en={en('primeros')} llenaEn={en('Jensen')} nombre="Jensen Huang" ancho={300} foto={`${FOTOS}/jensen-huang.jpg`} />
					<Pildora en={en('sin Jensen')} texto="*sin* él como CEO" icono={I.alerta} giro={2} tam={46} />
				</div>
			</S>

			{/* ---------- Recompra de acciones ---------- */}
			<S k="recompra">
				<EtiquetaSeccion texto="Hoy también circula" en={en('Hoy también')} />
				<TituloSeccion texto={'una *recompra*\nde acciones'} icono={I.documento} en={en('recompra')} tam={84} />
				<FranjaDato
					en={en('150.000')}
					dato={<Cifra valor={150000} en={en('150.000')} miles tam={108} dur={20} />}
					etiquetas={['millones', 'de dólares']}
				/>
				<div style={{whiteSpace: 'nowrap', paddingLeft: 12}}>
					<Tachado texto="es nueva" en={en('esa compra')} tachaEn={en('no es nueva')} tam={70} />
				</div>
				<Pildora en={en('aprobó')} texto="aprobada en *septiembre*" icono={I.calendario} giro={-2} tam={46} />
				<FilaCifra en={en('Este trimestre')} etiqueta="Ya gastaron este trimestre" cifra={<CifraUnidad valor={22100} en={en('22.100')} unidad="millones US$" />} />
			</S>

			{/* ---------- ¿Por qué el miedo? ---------- */}
			<S k="miedo">
				<EtiquetaSeccion texto="Entonces" en={en('Entonces')} />
				<TituloSeccion texto={'¿por qué\nel *miedo*?'} icono={I.alerta} en={en('Entonces')} tam={104} />
				<FranjaDato
					en={en('cerró')}
					icono={I.baja}
					dato={<Cifra valor={155} despues=" US$" en={en('155')} tam={104} dur={14} />}
					etiquetas={['cierre de ayer']}
				/>
				<FilaCifra en={en('35')} etiqueta="Por debajo de su récord" cifra={<Cifra valor={35} antes="−" despues=" %" en={en('35')} tam={100} dur={14} color={C.rojo} />} />
				<Pildora en={en('y su cierre')} texto="su cierre más bajo" icono={I.baja} tipo="negativo" giro={-2} tam={48} />
				<Pildora en={en('julio')} texto="desde *julio de 2025*" icono={I.calendario} giro={2} tam={48} />
			</S>

			{/* ---------- Tras el cierre ---------- */}
			<S k="tras">
				<EtiquetaSeccion texto="Tras el cierre" en={en('Tras el cierre')} />
				<TituloSeccion texto={'la acción\n*subía*'} icono={I.sube} en={en('subía')} tam={100} />
				<FilaCifra
					en={en('entre un')}
					etiqueta="Entre"
					cifra={
						<div style={{display: 'flex', alignItems: 'baseline', gap: 20}}>
							<Cifra valor={2} antes="+" despues=" %" en={en('2')} tam={96} dur={8} />
							<span style={{fontFamily: FUENTE, fontWeight: 800, fontSize: 44, color: C.gris}}>y</span>
							<Cifra valor={4} antes="+" despues=" %" en={en('4')} tam={96} dur={8} />
						</div>
					}
				/>
			</S>

			{/* ---------- Apertura de hoy ---------- */}
			<S k="apertura">
				<EtiquetaSeccion texto="Esta mañana" en={en('Esta mañana')} />
				<FranjaDato
					en={en('la apertura')}
					icono={I.reloj}
					dato={<Cifra valor={9} despues=":30" en={en('9')} tam={112} dur={8} />}
					etiquetas={['apertura del mercado', 'hora Colombia']}
				/>
				<TituloSeccion texto={'¿el miedo estaba\njustificado o era\nexagerado?'} en={en('dirá')} tam={76} />
				<div style={{display: 'flex', gap: 30, marginTop: 6}}>
					<Pildora en={en('justificado')} texto="justificado" icono={I.alerta} tipo="negativo" giro={-2} tam={50} />
					<Pildora en={en('exagerado')} texto="exagerado" icono={I.sube} tipo="acento" giro={2} tam={50} />
				</div>
			</S>

			{/* ---------- Aviso y "sigue a Invora": fondo clásico ---------- */}
			<Escena desde={ESCENAS.cierre} hasta={ESCENAS.fin} salida={false}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 64}}>
					<Texto en={en('Esto es información')} tam={64} peso={800}>
						{'esto es *información*,\nno recomendaciones'}
					</Texto>
					<BotonSeguir en={en('Sigue')} sigueEn={en('Invora') + 6} />
					<LogoInvora en={en('Invora')} tam={120} />
					<Texto en={en('para entender')} tam={80}>
						{'para entender\nqué pasa\ncon *tu plata*'}
					</Texto>
				</div>
			</Escena>
		</AbsoluteFill>
	</Dinamico.Provider>
);
