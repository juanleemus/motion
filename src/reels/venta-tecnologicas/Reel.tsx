// "Venta masiva de tecnológicas" — Escuela Invora. Adaptación del guion audiovisual (actualizado 23 nov):
// caja fija arriba, fichas de porcentaje (rojo si cae, azul si sube), un objeto por idea, pantalla dividida
// con material de apoyo arriba en varias escenas y subtítulos grandes con la palabra clave en caja.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, Cifra, Dinamico, FUENTE, Fondo, LogoInvora, Texto} from '../../robots/ui';
import {Comentario, Tachado, Teclas} from '../../robots/piezas';
import {BotonSeguir, EtiquetaSeccion, FilaCifra, IconoMini, LogoChico, Pildora, SeccionColumna, TarjetaClara} from '../../robots/columna';
import {BarrasCaida, FichaInvora, FichaPct, MiguelRecortado, PalabraGrande, PanelTrading, PistaBroll, Subtitulos, TituloHook, TitularMedio, VelasRojas, Volatilidad} from '../../robots/objetos';
import {BROLL} from './broll';
import {ICONOS as I} from '../../robots/iconos';
import {en, PALABRAS} from './tiempos';
import {ESCENAS} from './escenas';
import {LOGOS} from './logos';

type K = keyof typeof ESCENAS;
const orden = Object.keys(ESCENAS) as K[];
const hasta = (k: K) => ESCENAS[orden[orden.indexOf(k) + 1]];
const A = 'apoyo-venta-tecnologicas';

// Todos los gráficos van en la mitad de arriba (y 250–940): el 45 % inferior es del presentador.
const ESC = 0.82;
const Arriba: React.FC<{k: K; gap?: number; centro?: boolean; children: React.ReactNode}> = ({k, gap = 28, centro, children}) => {
	const solo = React.useContext(Solo);
	if (solo && solo !== k) return null;
	return (
		<AbsoluteFill style={{transform: `scale(${ESC})`, transformOrigin: '70px 250px'}}>
			<SeccionColumna desde={ESCENAS[k]} hasta={hasta(k)} gap={gap} top={250}>
				{centro ? <div style={{width: 860, display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>{children}</div> : children}
			</SeccionColumna>
		</AbsoluteFill>
	);
};
const S: React.FC<{k: K; gap?: number; children: React.ReactNode}> = ({k, gap, children}) => <Arriba k={k} gap={gap}>{children}</Arriba>;
const D: React.FC<{k: K; tramos?: unknown; gap?: number; children: React.ReactNode}> = ({k, gap, children}) => <Arriba k={k} gap={gap}>{children}</Arriba>;
export const Solo = React.createContext<K | null>(null);
const Fila: React.FC<{gap?: number; children: React.ReactNode}> = ({gap = 22, children}) => (
	<div style={{display: 'flex', alignItems: 'center', gap, flexWrap: 'wrap'}}>{children}</div>
);
// Nombre de medio sin logo disponible (Invezz, MarketWatch)
const Medio: React.FC<{en: number; nombre: string}> = ({en: f, nombre}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{background: C.blanco, borderRadius: 18, padding: '12px 22px', fontFamily: FUENTE, fontWeight: 900, fontSize: 34, color: C.tinta, opacity: frame >= f ? 1 : 0, transform: `scale(${frame >= f ? 1 : 0.6})`, boxShadow: `0 0 30px ${C.brillo}`}}>
			{nombre}
		</div>
	);
};
// Tarjeta de "qué mirar" (ícono + texto)
const Mirar: React.FC<{en: number; icono: (typeof I)[string]; texto: string}> = ({en: f, icono, texto}) => {
	const frame = useCurrentFrame();
	const r = Math.min(1, Math.max(0, (frame - f) / 8));
	return (
		<div style={{width: 262, height: 220, borderRadius: 28, background: C.blanco, boxShadow: `0 18px 44px rgba(0,0,0,0.6), 0 0 34px rgba(42,157,255,0.4)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, opacity: r, transform: `translateY(${(1 - r) * 50}px) scale(${0.7 + 0.3 * r})`, fontFamily: FUENTE, textAlign: 'center'}}>
			<div style={{width: 100, height: 100, borderRadius: 50, background: C.tinta, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<IconoMini trazos={icono} en={f + 2} tam={62} />
			</div>
			<div style={{fontWeight: 900, fontSize: 32, color: C.tinta, lineHeight: 1.1, padding: '0 10px'}}>{texto}</div>
		</div>
	);
};

const CLAVES = ['viernes', 'Nasdaq', '5%', 'hoy', '30%', 'NVIDIA', '5.28%', '10%', '3.70%', 'séptima', '2020', 'corrección', 'año', 'chips', 'Micron', 'AMD', 'TSMC', 'ASML', '13.89%', '13.25%', '9.48%', '6.63%', 'cadena', 'giro', 'Jensen', 'Huang', 'CEO', '6%', 'Anthropic', 'cierre', 'semana', 'volatilidad', 'rebote', 'Yardeni', 'Reserva', 'Federal', 'datos', 'analistas', 'directivos', 'método', 'Invora', 'información'];
const PROPIOS = ['Nasdaq', 'NVIDIA', 'Dow', 'CNBC', 'Micron', 'AMD', 'TSMC', 'ASML', 'Taiwán', 'Jensen', 'Huang', 'CEO', 'Yahoo', 'Finance', 'Invezz', 'Anthropic', 'Market', 'Watch', 'Bloomberg', 'Ed', 'Yardeni', 'Wall', 'Street', 'Reserva', 'Federal', 'Invora'];
const PCT: Record<string, string> = {'5%': '5 %', '30%': '30 %', '5.28%': '5,28 %', '10%': '10 %', '3.70%': '3,70 %', '13.89%': '13,89 %', '13.25%': '13,25 %', '9.48%': '9,48 %', '6.63%': '6,63 %', '6%': '6 %', 'S&P': 'S&P'};

// Capas para el editor: "broll" (fondo), "graficos", "titulo" y "subtitulos" (transparentes) y "preview" (todo junto,
// con el video del presentador en su lugar). "solo" deja una sola escena de gráficos (una capa por gráfico).
export type Capa = 'preview' | 'fondo' | 'broll' | 'graficos' | 'titulo' | 'subtitulos' | 'miguel';
const Graficos: React.FC = () => (
	<>
			{/* ---------- 1. Gancho: el viernes cae, hoy NVIDIA sube (portada) ---------- */}
			<D k="gancho" tramos={[{desde: -12, src: `${A}/wall-street.mp4`, inicio: 30, etiqueta: 'Wall Street'}]}>
				<div style={{display: 'flex', gap: 30, alignItems: 'flex-end'}}>
					<FichaPct en={en('5%', 1)} nombre="Nasdaq" logo={LOGOS.nasdaq} valor={5} signo="−" tono="rojo" tam={72} />
					<FichaPct en={en('30%', 1)} nombre="NVIDIA" logo={LOGOS.nvidia} valor={30} signo="≈ +" tono="azul" tam={86} />
				</div>
				<Texto en={en('Qué está pasando')} tam={70} style={{textAlign: 'left'}}>
					{'¿qué está *pasando*?'}
				</Texto>
			</D>

			{/* ---------- 2. El viernes: Nasdaq y S&P 500 ---------- */}
			<S k="viernes" gap={28}>
				<EtiquetaSeccion texto="Primero · el viernes" en={en('Primero')} />
				<PanelTrading en={en('El Nasdaq perdió')} ticker="NASDAQ · 1 SEMANA · %" puntos={[0, -1.5, -2.8, -4.7, -10]} ultimo="≈ −10 %" alto={380} />
				<FilaCifra en={en('5.28%')} etiqueta="Nasdaq · el viernes" cifra={<Cifra valor={5.28} decimales={2} antes="−" despues=" %" en={en('5.28%')} tam={84} dur={14} color={C.rojo} />} />
				<FilaCifra en={en('El S&P 500')} etiqueta="S&P 500 · el viernes" cifra={<Cifra valor={3.7} decimales={2} antes="−" despues=" %" en={en('3.70%')} tam={84} dur={14} color={C.rojo} />} />
			</S>

			{/* ---------- 3. Siete sesiones en rojo ---------- */}
			<S k="racha" gap={30}>
				<Texto en={en('Fue su')} tam={72} style={{textAlign: 'left'}}>
					{'*7 sesiones* seguidas\nen rojo'}
				</Texto>
				<VelasRojas en={en('séptima')} paso={4} />
				<Pildora en={en('La peor racha')} texto="la peor racha *desde 2020*" icono={I.alerta} tipo="negativo" giro={-2} tam={46} />
			</S>

			{/* ---------- 4. CNBC: corrección y el Nasdaq borra el año (pantalla dividida) ---------- */}
			<D k="cnbc" tramos={[{desde: ESCENAS.cnbc, src: `${A}/periodico.mp4`}]}>
				<TitularMedio en={en('Y según CNBC')} medio="CNBC" logo={LOGOS.cnbc} texto="el S&P 500 y el Dow cerraron la semana en *corrección*" tam={46} />
				<Pildora en={en('borró')} texto="el Nasdaq *borró lo ganado en el año*" icono={I.baja} tipo="negativo" giro={-2} tam={38} />
			</D>

			{/* ---------- 5. Quién cayó más: los chips ---------- */}
			<S k="chips" gap={30}>
				<Texto en={en('Quién cayó')} tam={66} style={{textAlign: 'left'}}>
					{'¿quién cayó más?\nlos *chips*'}
				</Texto>
				<BarrasCaida
					max={13.89}
					barras={[
						{logo: LOGOS.micron, nombre: 'Micron', valor: 13.89, en: en('Micron')},
						{logo: LOGOS.amd, nombre: 'AMD', valor: 13.25, en: en('AMD', 1)},
						{logo: LOGOS.tsmc, nombre: 'TSMC', sub: 'Taiwán · fabrica los chips', valor: 9.48, en: en('9.48%')},
						{logo: LOGOS.asml, nombre: 'ASML', sub: 'Países Bajos · empresa holandesa', valor: 6.63, en: en('6.63%')},
					]}
				/>
			</S>

			{/* ---------- 6. Cayó toda la cadena de la IA ---------- */}
			<S k="cadena" gap={40}>
				<div style={{paddingLeft: 10, marginTop: 60}}>
					<Tachado texto="solo una empresa" en={en('No cayó')} tachaEn={en('solo una')} tam={70} />
				</div>
				<Texto en={en('cayó toda')} tam={86} style={{textAlign: 'left'}}>
					{'cayó toda la cadena\nde la *inteligencia*\n*artificial*'}
				</Texto>
			</S>

			{/* ---------- 7. El giro: regreso de Jensen Huang (pantalla dividida) ---------- */}
			<D k="giro" tramos={[{desde: ESCENAS.giro, src: `${A}/fotos/jensen-huang.jpg`, etiqueta: 'Jensen Huang'}]}>
				<EtiquetaSeccion texto="Hoy · el giro" en={en('Y hoy el giro')} />
				<TitularMedio en={en('la junta')} medio="CNBC" logo={LOGOS.cnbc} texto="la junta de NVIDIA aprobó el regreso de *Jensen Huang* como CEO" tam={44} />
			</D>

			{/* ---------- 8. NVIDIA ≈ +30 % (pantalla dividida) ---------- */}
			<D k="nvidia30" tramos={[{desde: ESCENAS.nvidia30, src: `${A}/cotizaciones.mp4`}]} gap={34}>
				<Pildora en={en('Y después de la apertura')} texto="después de la *apertura*" icono={I.reloj} tipo="acento" giro={-2} tam={44} />
				<FichaPct en={en('la acción llegó')} cuentaEn={en('30%', 2)} nombre="NVIDIA" logo={LOGOS.nvidia} valor={30} signo="≈ +" tono="azul" tam={110} />
			</D>

			{/* ---------- 9. También suben: Nasdaq y Anthropic ---------- */}
			<S k="suben" gap={30}>
				<EtiquetaSeccion texto="También suben" en={en('Según Yahoo')} />
				<Fila>
					<LogoChico {...LOGOS.yahoo} en={en('Yahoo')} />
					<Medio en={en('Invezz')} nombre="Invezz" />
				</Fila>
				<FichaPct en={en('el Nasdaq subió')} cuentaEn={en('6%')} nombre="Nasdaq" logo={LOGOS.nasdaq} valor={6} signo="≈ +" tono="azul" tam={64} />
				<Fila gap={26}>
					<LogoChico {...LOGOS.anthropic} en={en('Anthropic')} />
					<Pildora en={en('también está subiendo')} texto="también *sube*" icono={I.sube} tipo="acento" giro={-2} tam={44} />
				</Fila>
				<Fila>
					<LogoChico {...LOGOS.cnbc} alto={52} en={en('CNBC', 3)} />
					<Medio en={en('MarketWatch')} nombre="MarketWatch" />
				</Fila>
			</S>

			{/* ---------- 10. Pero ojo con dos cosas ---------- */}
			<S k="ojo" gap={34}>
				<EtiquetaSeccion texto="Pero ojo con dos cosas" en={en('Pero ojo')} />
				<TarjetaClara en={en('Son cifras')} icono={I.reloj} texto="*1.* cifras en plena sesión: pueden cambiar hasta el cierre" tam={46} />
				<TarjetaClara en={en('Que una acción')} icono={I.alerta} texto="*2.* subir 30 % en un día no borra la caída de la semana" tam={46} />
				<Pildora en={en('tampoco')} texto="ni te dice *qué viene*" icono={I.lupa} tipo="aviso" giro={-2} tam={46} />
			</S>

			{/* ---------- 11. Más volatilidad: rebote o caída fuerte ---------- */}
			<S k="volatilidad" gap={30}>
				<Texto en={en('Después de movimientos')} tam={76} style={{textAlign: 'left'}}>
					{'lo normal: más\n*volatilidad*'}
				</Texto>
				<Volatilidad en={en('Después de movimientos')} reboteEn={en('rebote')} caidaEn={en('caída fuerte')} />
			</S>

			{/* ---------- 12. Bloomberg: Ed Yardeni (pantalla dividida) ---------- */}
			<D k="bloomberg" tramos={[{desde: ESCENAS.bloomberg, src: `${A}/wall-street.mp4`, inicio: 120}]}>
				<TitularMedio en={en('Según Bloomberg')} medio="Bloomberg" logo={LOGOS.bloomberg} texto="Ed Yardeni bajó su objetivo del *S&P 500* para fin de año" tam={46} />
			</D>

			{/* ---------- 13. 24/7 Wall St: la Fed (pantalla dividida) ---------- */}
			<D k="fed" tramos={[{desde: ESCENAS.fed, src: `${A}/capitolio.mp4`}]}>
				<TitularMedio en={en('Y según 24/7')} medio="24/7 Wall St" texto="esta caída podría frenar las subidas de tasas de la *Reserva Federal*" tam={46} />
			</D>

			{/* ---------- 14. ¿Qué hacemos? (pantalla dividida: analista → directivos) ---------- */}
			<D
				k="hacemos"
				tramos={[
					{desde: ESCENAS.hacemos, src: `${A}/analista.mp4`},
					{desde: en('directivos'), src: `${A}/directivos.mp4`, etiqueta: 'directivos'},
				]}
			>
				<Texto en={en('Mirar los datos')} tam={60} style={{textAlign: 'left'}}>
					{'mirar los *datos* con calma'}
				</Texto>
				<div style={{display: 'flex', gap: 37}}>
					<Mirar en={en('Qué empresas')} icono={I.baja} texto="qué cayó más" />
					<Mirar en={en('Qué proyectan')} icono={I.persona} texto="analistas" />
					<Mirar en={en('directivos')} icono={I.empresa} texto="directivos" />
				</div>
			</D>

			{/* ---------- 15. No en los titulares: en los datos ---------- */}
			<S k="datos" gap={40}>
				<Pildora en={en('Porque cuando')} texto="todos venden · todos compran" icono={I.alerta} tipo="aviso" giro={-2} tam={46} />
				<div style={{paddingLeft: 10, marginTop: 20}}>
					<Tachado texto="en los titulares" en={en('no se ve')} tachaEn={en('titulares')} tam={74} />
				</div>
				<Texto en={en('se ve en los datos')} tam={104} style={{textAlign: 'left'}}>
					{'se ve en\nlos *datos*'}
				</Texto>
			</S>

			{/* ---------- 16. Método: Miguel se acerca y la palabra MÉTODO enorme encima (como "PACIENCIA") ---------- */}
			<PalabraGrande texto="método" en={en('método')} hasta={ESCENAS.invora} />

			{/* ---------- 17. En Invora (fondo clásico) ---------- */}
			<Arriba k="invora" centro gap={30}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60}}>
					<LogoInvora en={en('En Invora')} tam={110} />
					<Tachado texto="qué comprar" en={en('no te decimos')} tachaEn={en('comprar')} tam={84} />
					<Texto en={en('te mostramos')} tam={92}>
						{'te mostramos\nlos *números*'}
					</Texto>
				</div>
			</Arriba>

			{/* ---------- 18. Comenta CAÍDA (fondo clásico) ---------- */}
			<Arriba k="comenta" centro gap={30}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
					<Texto en={en('Comenta')} tam={64} peso={800}>
						{'comenta'}
					</Texto>
					<Teclas palabra="CAÍDA" en={en('caída', 4)} paso={3} tam={140} />
					<Comentario en={en('caída', 4) + 6} texto="CAÍDA" enviaEn={en('te enviamos')} />
					<div style={{display: 'flex', gap: 37}}>
						<FichaInvora en={en('NVIDIA', 4)} logo={LOGOS.nvidia} ticker="NVDA" nombre="NVIDIA" />
						<FichaInvora en={en('AMD', 2)} logo={LOGOS.amd} ticker="AMD" nombre="AMD" />
						<FichaInvora en={en('Micron', 2)} logo={LOGOS.micron} ticker="MU" nombre="Micron" />
					</div>
				</div>
			</Arriba>

			{/* ---------- 19. Aviso y "sigue a Invora" (fondo clásico) ---------- */}
			<Arriba k="cierre" centro gap={30}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 70}}>
					<Texto en={en('Esto es información')} tam={70} peso={800}>
						{'esto es *información*,\nno recomendaciones'}
					</Texto>
					<BotonSeguir en={en('Sigue')} sigueEn={en('Invora', 2) + 6} />
					<LogoInvora en={en('Invora', 2)} tam={120} />
				</div>
			</Arriba>

	</>
);
const Titulo: React.FC = () => (
	<TituloHook texto="La bolsa da un giro" hasta={ESCENAS.metodo} icono={<IconoMini trazos={I.grafica} en={-20} tam={64} />} />
);
const Subs: React.FC = () => (
	<Subtitulos palabras={PALABRAS} claves={CLAVES} negativas={['no']} y={905} max={5} tam={44} caja ocultar={[[ESCENAS.invora, ESCENAS.fin]]} reemplazos={PCT} propios={PROPIOS} />
);
const Broll: React.FC = () => (
	<>
		<Fondo />
		<PistaBroll clips={BROLL} fin={ESCENAS.metodo} oscurecer={0.75} />
	</>
);

export const ReelVentaTecnologicas: React.FC<{capa?: Capa; solo?: K | null}> = ({capa = 'preview', solo = null}) => (
	<Dinamico.Provider value>
		<Solo.Provider value={solo}>
			<AbsoluteFill style={{fontFamily: FUENTE}}>
				{capa === 'preview' || capa === 'fondo' || capa === 'broll' ? <Broll /> : null}
				{capa === 'preview' || capa === 'miguel' ? <MiguelRecortado src={`${A}/miguel-transparente.webm`} cerca={[[ESCENAS.metodo, ESCENAS.invora]]} /> : null}
				{capa === 'preview' || capa === 'fondo' || capa === 'graficos' ? <Graficos /> : null}
				{capa === 'preview' || capa === 'fondo' || capa === 'titulo' ? <Titulo /> : null}
				{capa === 'preview' || capa === 'fondo' || capa === 'subtitulos' ? <Subs /> : null}
			</AbsoluteFill>
		</Solo.Provider>
	</Dinamico.Provider>
);
