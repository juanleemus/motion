// "La semana de la bolsa" — Escuela Invora. Columna que se llena por secciones sobre un video de apoyo
// oscurecido; cada pieza entra en la palabra exacta de la voz editada.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, Cifra, Dinamico, Escena, FUENTE, Fondo, LogoInvora, SOMBRA, Texto, aparece, useRebote} from '../../robots/ui';
import {Comentario} from '../../robots/piezas';
import {
	Calendario,
	EncuestaFinal,
	EtiquetaSeccion,
	FilaCifra,
	FondoSeccion,
	FranjaDato,
	LogoChico,
	BotonSeguir,
	PanelProbabilidad,
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
const FOTOS = 'apoyo-semana-bolsa/fotos';

export const ReelSemanaBolsa: React.FC = () => (
	<Dinamico.Provider value>
		<AbsoluteFill style={{fontFamily: FUENTE}}>
			<Fondo />
			<FondoSeccion tramos={FONDOS} />

			{/* ---------- Apertura: el primer fotograma ya es un titular legible ---------- */}
			<S k="apertura" gap={40}>
				<EtiquetaSeccion texto="Esta semana · 17 al 19 de nov" en={-12} tam={28} />
				<TituloSeccion texto={'la bolsa se la juega\nen *3 días seguidos*'} en={-12} sinEntrada tam={74} />
				<Calendario
					alto={360}
					dias={[
						{dia: 'Mar', num: '17', en: en('martes', 1), icono: I.chip},
						{dia: 'Mié', num: '18', en: en('miércoles', 1), icono: I.capitolio},
						{dia: 'Jue', num: '19', en: en('jueves', 1), icono: I.globo},
					]}
				/>
				<Pildora en={en('Te cuento')} texto="te cuento *qué mirar*" icono={I.lupa} tipo="acento" giro={-2} />
			</S>

			{/* ---------- Martes: NVIDIA ---------- */}
			<S k="nvidia">
				<EtiquetaSeccion texto="Hoy martes · después del cierre" en={en('Hoy martes')} tam={27} />
				<TituloSeccion texto={'*presenta*\nresultados'} logo={{...LOGOS.nvidia, alto: 44}} en={en('NVIDIA')} tam={84} />
				<TarjetaClara en={en('Es la empresa')} icono={I.chip} texto="fabrica los chips de la *inteligencia artificial*" />
				<div style={{display: 'flex', alignItems: 'center', gap: 34}}>
					<TarjetaVacia en={en('primera vez')} llenaEn={en('Jensen')} nombre="Jensen Huang" ancho={300} foto={`${FOTOS}/jensen-huang.jpg`} />
					<div style={{display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'flex-start'}}>
						<Pildora en={en('primera vez')} texto="1.ª vez" icono={I.alerta} giro={-2} tam={46} />
						<Pildora en={en('sin Jensen')} texto="*sin* él como CEO" giro={2} tam={42} />
					</div>
				</div>
			</S>

			{/* ---------- Martes: lo que espera el mercado ---------- */}
			<S k="opciones">
				<EtiquetaSeccion texto="Según las opciones" en={en('Según las opciones')} />
				<TituloSeccion texto={'el mercado espera\nun *movimiento*'} en={en('mercado', 1)} tam={78} />
				<FilaCifra
					en={en('entre el 7')}
					etiqueta="Movimiento esperado"
					cifra={
						<div style={{display: 'flex', alignItems: 'baseline'}}>
							<Cifra valor={7} en={en('7')} tam={118} dur={12} />
							<Cifra valor={10} en={en('10')} antes="–" despues="%" tam={118} dur={12} />
						</div>
					}
				/>
				<div style={{display: 'flex', gap: 30, marginTop: 10}}>
					<Pildora en={en('arriba')} texto="para arriba" icono={I.sube} tipo="acento" giro={-2} />
					<Pildora en={en('abajo')} texto="para abajo" icono={I.baja} tipo="negativo" giro={2} />
				</div>
			</S>

			{/* ---------- Miércoles: la Fed ---------- */}
			<S k="fed">
				<div style={{display: 'flex', alignItems: 'center', gap: 26}}>
					<EtiquetaSeccion texto="Mañana miércoles" en={en('Mañana')} />
					<LogoChico {...LOGOS.fed} en={en('la Reserva')} />
				</div>
				<TituloSeccion texto={'la *Reserva Federal*\npublica el acta'} en={en('la Reserva')} tam={74} />
				<TarjetaClara en={en('el acta')} icono={I.documento} texto="el acta de su *última reunión*" />
				<FranjaDato
					en={en('a las dos')}
					icono={I.reloj}
					dato={<Cifra valor={2} en={en('dos')} despues=":00" tam={112} dur={8} />}
					etiquetas={['de la tarde', 'hora Colombia']}
				/>
			</S>

			{/* ---------- Miércoles: lo que descuenta el mercado ---------- */}
			<S k="fedwatch">
				<div style={{display: 'flex', alignItems: 'center', gap: 26}}>
					<EtiquetaSeccion texto="Según" en={en('Según CME')} tam={30} />
					<LogoChico {...LOGOS.cme} en={en('CME')} />
					<EtiquetaSeccion texto="FedWatch" en={en('FedWatch')} tam={30} />
				</div>
				<TituloSeccion texto={'el mercado ve una\n*subida de tasas*'} en={en('el mercado', 1)} tam={76} />
				<PanelProbabilidad
					en={en('casi')}
					titulo="Lo que da por hecho el mercado"
					filas={[{etiqueta: 'subida de tasas', valor: 0.92, texto: 'casi segura', llenaEn: en('subida'), sentido: 'sube'}]}
				/>
				<Pildora en={en('el 9')} texto="9 dic: *subida casi segura*" icono={I.calendario} tipo="aviso" giro={-2} />
				<Pildora en={en('Cualquier')} texto="cualquier pista *mueve todo*" icono={I.alerta} tipo="acento" giro={2} tam={40} />
			</S>

			{/* ---------- Jueves: Trump, Xi y Putin ---------- */}
			<S k="jueves">
				<EtiquetaSeccion texto="El jueves · en China" en={en('Y el jueves')} />
				<TituloSeccion texto={'según la\n*Casa Blanca*'} icono={I.casa} en={en('según la Casa')} tam={72} />
				<div style={{display: 'flex', gap: 37}}>
					<TarjetaVacia en={en('Casa Blanca')} llenaEn={en('Trump')} nombre="Trump" sub="EE. UU." foto={`${FOTOS}/trump.jpg`} />
					<TarjetaVacia en={en('Casa Blanca') + 3} llenaEn={en('Xi')} nombre="Xi" sub="China" foto={`${FOTOS}/xi.jpg`} />
					<TarjetaVacia en={en('Casa Blanca') + 6} llenaEn={en('Putin')} nombre="Putin" sub="Rusia" foto={`${FOTOS}/putin.jpg`} />
				</div>
				<Pildora en={en('se reúnen')} texto="se reúnen *en China*" icono={I.ubicacion} tipo="acento" giro={-2} />
			</S>

			{/* ---------- Jueves: Irán y el petróleo ---------- */}
			<S k="iran">
				<EtiquetaSeccion texto="Se espera que hablen de" en={en('Se espera')} />
				<TituloSeccion texto="*Irán*" icono={I.ubicacion} en={en('Irán')} tam={150} />
				<TarjetaClara en={en('Y eso puede')} icono={I.gota} texto="y eso puede mover el *petróleo*" tam={58} />
				<div style={{display: 'flex', gap: 30, marginTop: 10}}>
					<Pildora en={en('petróleo')} texto="petróleo" icono={I.sube} tipo="acento" giro={-2} tam={56} />
					<Pildora en={en('petróleo') + 3} texto="petróleo" icono={I.baja} tipo="negativo" giro={2} tam={56} />
				</div>
			</S>

			{/* ---------- Cierre: qué día pasa cada cosa ---------- */}
			<S k="cierre">
				<EtiquetaSeccion texto="La semana, día por día" en={en('Nadie')} />
				<TituloSeccion texto={'nadie sabe cómo\nva a *reaccionar*'} icono={I.alerta} en={en('Nadie')} tam={70} />
				<Calendario
					alto={320}
					dias={[
						{dia: 'Mar', num: '17', en: en('qué día'), nota: 'NVIDIA'},
						{dia: 'Mié', num: '18', en: en('pasa', 1), nota: 'la Fed'},
						{dia: 'Jue', num: '19', en: en('cada cosa'), nota: 'China'},
					]}
				/>
				<Pildora en={en('evita')} texto="evita *enterarte tarde*" icono={I.reloj} tipo="aviso" giro={-2} />
			</S>

			{/* ---------- Encuesta: fondo clásico ---------- */}
			<S k="encuesta" gap={34}>
				<EtiquetaSeccion texto="Tu turno" en={en('Y tú')} />
				<Texto en={en('Y tú')} tam={96} style={{textAlign: 'left'}}>
					{'¿y tú *qué crees*?'}
				</Texto>
				<Texto en={en('La bolsa', 2)} tam={60} peso={800} style={{textAlign: 'left'}}>
					{'la bolsa esta semana…'}
				</Texto>
				<EncuestaFinal subeEn={en('sube')} caeEn={en('cae')} />
				<div style={{marginTop: 26}}>
					<Comentario en={en('Escríbelo')} texto="yo digo que…" enviaEn={en('comentarios') + 6} />
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 34, marginTop: 6}}>
					<LogoInvora en={en('Escríbelo')} tam={52} />
					<div style={{fontFamily: FUENTE, fontWeight: 800, fontSize: 36, color: C.blanco, textShadow: SOMBRA, opacity: aparece(useCurrentFrame(), en('comentarios'), 5)}}>
						escríbelo en <span style={{color: C.azul}}>comentarios</span>
					</div>
				</div>
			</S>

			{/* ---------- Sigue a Invora: fondo clásico ---------- */}
			<Escena desde={ESCENAS.sigue} hasta={ESCENAS.fin} salida={false}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 70}}>
					<BotonSeguir en={en('y sigue')} sigueEn={en('Invora') + 6} />
					<LogoInvora en={en('Invora')} tam={120} />
					<Texto en={en('para entender')} tam={80}>
						{'para entender\nqué pasa\ncon *tu plata*'}
					</Texto>
				</div>
			</Escena>
		</AbsoluteFill>
	</Dinamico.Provider>
);
