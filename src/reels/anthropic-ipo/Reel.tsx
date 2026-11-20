// "Anthropic IPO" — Escuela Invora. Adaptación del guion audiovisual: un objeto gráfico por idea
// (torre del Nasdaq, etiqueta de precio, lluvia de billetes, gráfica, latido, fichas) y subtítulos
// grandes con la palabra clave en caja azul. Todo entra en la palabra exacta de la voz editada.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, Cifra, Dinamico, Escena, FUENTE, Fondo, LogoInvora, Texto} from '../../robots/ui';
import {Comentario, Tachado, Teclas} from '../../robots/piezas';
import {
	BarrasComparadas,
	BotonSeguir,
	Calendario,
	EtiquetaSeccion,
	FilaCifra,
	FondoSeccion,
	FranjaDato,
	LogoChico,
	Pildora,
	SeccionColumna,
	TarjetaClara,
} from '../../robots/columna';
import {EtiquetaPrecio, FichaInvora, Foco, GraficaPrecio, Latido, LluviaBilletes, Subtitulos, TitularMedio, TorreNasdaq} from '../../robots/objetos';
import {ICONOS as I} from '../../robots/iconos';
import {en, PALABRAS} from './tiempos';
import {ESCENAS} from './escenas';
import {FONDOS} from './fondos';
import {LOGOS} from './logos';

const orden = Object.keys(ESCENAS) as (keyof typeof ESCENAS)[];
const hasta = (k: keyof typeof ESCENAS) => ESCENAS[orden[orden.indexOf(k) + 1]];
const S: React.FC<{k: keyof typeof ESCENAS; gap?: number; children: React.ReactNode}> = ({k, gap = 30, children}) => (
	<SeccionColumna desde={ESCENAS[k]} hasta={hasta(k)} gap={gap}>
		{children}
	</SeccionColumna>
);
const Fila: React.FC<{gap?: number; children: React.ReactNode}> = ({gap = 22, children}) => (
	<div style={{display: 'flex', alignItems: 'center', gap}}>{children}</div>
);

// Palabras clave que van en caja azul en los subtítulos (y "no" en caja roja).
const CLAVES = ['Anthropic', 'Claude', 'Nasdaq', 'ANT', 'hoy', '83', '70', '78', '980', '81', 'historia', '110', '33', 'apertura', '97', 'trampa', 'debut', 'emoción', 'mañana', 'otro', 'Invora', 'IPO', 'NVIDIA', 'AMD', 'Micron', 'información'];

export const ReelAnthropicIpo: React.FC = () => (
	<Dinamico.Provider value>
		<AbsoluteFill style={{fontFamily: FUENTE}}>
			<Fondo />
			<FondoSeccion tramos={FONDOS} />
			{/* foco y lluvia de billetes de la oferta */}
			<FocoEntre desde={ESCENAS.billetes} hasta={ESCENAS.grafica} />
			<LluviaBilletes en={en('levantó')} hasta={ESCENAS.grafica} texto="ANT" />

			{/* ---------- 1. Torre del Nasdaq (portada: el primer fotograma ya es un titular) ---------- */}
			<S k="torre" gap={24}>
				<EtiquetaSeccion texto="Jueves 19 de nov · Nasdaq" en={-12} />
				<Texto en={-12} sinEntrada tam={84} style={{textAlign: 'left'}}>
					{'Anthropic\n*salió a bolsa*'}
				</Texto>
				<Fila>
					<LogoChico {...LOGOS.anthropic} en={en('Anthropic')} />
					<LogoChico {...LOGOS.claude} en={en('Claude')} />
				</Fila>
				<div style={{width: 860, height: 600, position: 'relative'}}>
					<div style={{position: 'absolute', left: 0, top: 0, transform: 'scale(0.8)', transformOrigin: '0 0', marginLeft: 86}}>
						<TorreNasdaq en={en('debutó')} chipEn={en('ticker')} antEn={en('ANT')} logo={LOGOS.nasdaq.archivo} />
					</div>
				</div>
			</S>

			{/* ---------- 2. Calendario: antes de comprar hoy ---------- */}
			<S k="calendario" gap={40}>
				<EtiquetaSeccion texto="El día del debut" en={en('antes')} />
				<Calendario ancho={420} alto={480} dias={[{dia: 'Jueves', num: '19', en: en('antes'), nota: 'noviembre', icono: I.calendario}]} />
				<Pildora en={en('mira')} texto="antes de comprar, *mira esto*" icono={I.lupa} tipo="acento" giro={-2} tam={48} />
			</S>

			{/* ---------- 3. Precio de salida: sello 83 $ sobre el rango 70–78 $ ---------- */}
			<S k="precio" gap={30}>
				<Fila>
					<EtiquetaSeccion texto="Según" en={en('Según', 1)} tam={30} />
					<LogoChico {...LOGOS.cnbc} en={en('CNBC')} />
					<LogoChico {...LOGOS.yahoo} en={en('Yahoo', 1)} />
				</Fila>
				<div style={{marginLeft: 60, marginTop: 120}}>
					<EtiquetaPrecio en={en('fijó')} selloEn={en('83', 1)} rangoEn={en('rango')} tachaEn={en('78')} sello="83 $" rango="70–78 $" />
				</div>
				<Pildora en={en('por encima', 1)} texto="*por encima* del rango" icono={I.sube} tipo="acento" giro={-2} tam={50} />
			</S>

			{/* ---------- 4. La oferta: acciones y dinero levantado ---------- */}
			<S k="billetes" gap={30}>
				<EtiquetaSeccion texto="La oferta" en={en('Vendió')} />
				<FranjaDato en={en('980')} dato={<Cifra valor={980} en={en('980')} tam={112} dur={18} />} etiquetas={['millones', 'de acciones']} />
				<FranjaDato
					en={en('levantó')}
					dato={<Cifra valor={81000} antes="≈" en={en('81')} miles tam={112} dur={20} />}
					etiquetas={['millones', 'de dólares']}
				/>
				<TarjetaClara en={en('es la salida')} icono={I.trofeo} texto="la salida a bolsa *más grande de la historia*" tam={50} />
				<SegunMedios en={en('Según medios')} />
			</S>

			{/* ---------- 5. La gráfica: 83 → 110 (+33 %) → 97 ---------- */}
			<S k="grafica" gap={24}>
				<Fila>
					<EtiquetaSeccion texto="Pero ojo" en={en('pero ojo')} />
					<LogoChico {...LOGOS.yahoo} en={en('Yahoo', 2)} />
				</Fila>
				<GraficaPrecio
					en={en('pero ojo')}
					min={70}
					max={122}
					alto={560}
					base={{valor: 83, texto: ''}}
					puntos={[
						{valor: 83, en: en('pero ojo') + 4, etiqueta: '83 $', detalle: 'oferta', tono: 'gris'},
						{valor: 110, en: en('110'), etiqueta: '110 $', detalle: 'apertura'},
						{valor: 97, en: en('97'), etiqueta: '97 $', detalle: '1.ª media hora', tono: 'rojo'},
					]}
					extra={
						<div style={{position: 'absolute', left: 470, top: 110}}>
							<Pildora en={en('33')} texto="+33 %" icono={I.sube} tipo="acento" giro={-4} tam={56} />
						</div>
					}
				/>
				<BarrasComparadas
					en={en('pagó')}
					titulo="Precio por acción"
					max={110}
					barras={[
						{etiqueta: 'quien compró en la apertura', valor: 110, texto: '110 $', en: en('pagó')},
						{etiqueta: 'quien entró en la oferta', valor: 83, texto: '83 $', en: en('oferta'), tono: 'gris'},
					]}
				/>
			</S>

			{/* ---------- 6. La advertencia de Bloomberg Línea ---------- */}
			<S k="bloomberg" gap={40}>
				<Fila>
					<EtiquetaSeccion texto="La advertencia" en={en('Por eso')} />
					<LogoChico {...LOGOS.bloomberg} en={en('Bloomberg')} />
				</Fila>
				<TitularMedio en={en('trampa')} medio="Bloomberg Línea" texto="la *trampa* de las grandes salidas a bolsa para quienes compran *después del debut*" />
				<Pildora en={en('debut')} texto="comprar *después del debut*" icono={I.alerta} tipo="aviso" giro={-2} tam={48} />
			</S>

			{/* ---------- 7. Día 1: manda la emoción ---------- */}
			<S k="latido" gap={50}>
				<div style={{height: 40}} />
				<Latido en={en('El primer día')} etiqueta="Día 1" />
				<Texto en={en('manda')} tam={96} style={{textAlign: 'left'}}>
					{'manda la *emoción*'}
				</Texto>
				<div style={{paddingLeft: 10}}>
					<Tachado texto="no los números" en={en('no los números')} tachaEn={en('números', 1)} tam={72} />
				</div>
			</S>

			{/* ---------- 8. Lo que sí sabes: el precio de salida era 83 ---------- */}
			<S k="hoy" gap={34}>
				<EtiquetaSeccion texto="Esto sí lo sabes" en={en('pero esto')} />
				<Pildora en={en('Nadie')} texto="nadie sabe qué hará *mañana*" icono={I.alerta} tipo="aviso" giro={-2} tam={46} />
				<FilaCifra en={en('El precio')} etiqueta="Precio de salida" cifra={<Cifra valor={83} despues=" $" en={en('83', 2)} tam={110} dur={12} />} />
				<FilaCifra
					en={en('el que ves')}
					etiqueta="Precio de hoy"
					cifra={<div style={{fontFamily: FUENTE, fontWeight: 900, fontSize: 110, lineHeight: 1, color: C.azul, textShadow: `0 0 40px ${C.brillo}`, opacity: 1}}>otro</div>}
				/>
			</S>

			{/* ---------- 9. En Invora: los números, no qué comprar (fondo clásico) ---------- */}
			<Escena desde={ESCENAS.invora} hasta={ESCENAS.comenta}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60}}>
					<LogoInvora en={en('En Invora')} tam={110} />
					<Tachado texto="qué comprar" en={en('no te decimos')} tachaEn={en('comprar')} tam={84} />
					<Texto en={en('te mostramos')} tam={92}>
						{'te mostramos\nlos *números*'}
					</Texto>
				</div>
			</Escena>

			{/* ---------- 10. Comenta IPO y recibe las fichas (fondo clásico) ---------- */}
			<Escena desde={ESCENAS.comenta} hasta={ESCENAS.cierre}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44, marginTop: -60}}>
					<Texto en={en('Comenta')} tam={64} peso={800}>
						{'comenta'}
					</Texto>
					<Teclas palabra="IPO" en={en('IPO')} paso={4} tam={150} />
					<Comentario en={en('IPO') + 6} texto="IPO" enviaEn={en('te mandamos')} />
					<div style={{display: 'flex', gap: 37}}>
						<FichaInvora en={en('NVIDIA')} logo={LOGOS.nvidia} ticker="NVDA" nombre="NVIDIA" />
						<FichaInvora en={en('AMD')} logo={LOGOS.amd} ticker="AMD" nombre="AMD" />
						<FichaInvora en={en('Micron')} logo={LOGOS.micron} ticker="MU" nombre="Micron" />
					</div>
					<Pildora en={en('Tres acciones')} texto="ligadas a la *inteligencia artificial*" icono={I.chip} tipo="acento" giro={-2} tam={42} />
				</div>
			</Escena>

			{/* ---------- 11. Aviso y "sigue a Invora" (fondo clásico) ---------- */}
			<Escena desde={ESCENAS.cierre} hasta={ESCENAS.fin} salida={false}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 70}}>
					<Texto en={en('Esto es información')} tam={70} peso={800}>
						{'esto es *información*,\nno recomendación'}
					</Texto>
					<BotonSeguir en={en('Sigue')} sigueEn={en('Invora', 2) + 6} />
					<LogoInvora en={en('Invora', 2)} tam={120} />
				</div>
			</Escena>

			{/* ---------- Subtítulos grandes (no van donde la pantalla ya dice lo mismo) ---------- */}
			<Subtitulos
				palabras={PALABRAS}
				claves={CLAVES}
				negativas={['no']}
				y={1330}
				ocultar={[[ESCENAS.invora, ESCENAS.fin]]}
			/>
		</AbsoluteFill>
	</Dinamico.Provider>
);

// Foco de luz solo durante la escena de la oferta.
const FocoEntre: React.FC<{desde: number; hasta: number}> = ({desde, hasta}) => {
	const frame = useCurrentFrame();
	return frame >= desde && frame < hasta + 8 ? <Foco en={desde} /> : null;
};

// Fuente chica bajo la tarjeta: aparece cuando la voz dice "según medios".
const SegunMedios: React.FC<{en: number}> = ({en: f}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{fontFamily: FUENTE, fontWeight: 800, fontSize: 26, letterSpacing: '0.22em', color: C.gris, textTransform: 'uppercase', opacity: frame >= f ? 1 : 0}}>
			según medios
		</div>
	);
};
