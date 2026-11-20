// "GTA 6 y Take-Two" — Escuela Invora. Adaptación del guion audiovisual: caja de titular fija arriba,
// un objeto por idea (rango de precios objetivo, "no es una línea recta", lo que importa) y subtítulos
// grandes con la palabra clave en caja azul. Datos, no hype: avisa el riesgo.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, Cifra, Dinamico, Escena, FUENTE, Fondo, LogoInvora, Texto} from '../../robots/ui';
import {Comentario, Tachado, Teclas} from '../../robots/piezas';
import {BotonSeguir, EtiquetaSeccion, FondoSeccion, FranjaDato, IconoMini, LogoChico, Pildora, SeccionColumna} from '../../robots/columna';
import {CajaTitular, FichaInvora, LineaNoRecta, RangoPrecios, Subtitulos} from '../../robots/objetos';
import {ICONOS as I} from '../../robots/iconos';
import {en, PALABRAS} from './tiempos';
import {ESCENAS} from './escenas';
import {FONDOS} from './fondos';
import {LOGOS} from './logos';

const orden = Object.keys(ESCENAS) as (keyof typeof ESCENAS)[];
const hasta = (k: keyof typeof ESCENAS) => ESCENAS[orden[orden.indexOf(k) + 1]];
// Las escenas con caja de titular empiezan más abajo (la caja ocupa y 270–370).
const S: React.FC<{k: keyof typeof ESCENAS; gap?: number; children: React.ReactNode}> = ({k, gap = 30, children}) => (
	<SeccionColumna desde={ESCENAS[k]} hasta={hasta(k)} gap={gap} top={420}>
		{children}
	</SeccionColumna>
);
const Fila: React.FC<{gap?: number; children: React.ReactNode}> = ({gap = 22, children}) => (
	<div style={{display: 'flex', alignItems: 'center', gap}}>{children}</div>
);

const CLAVES = ['GTA', '6', 'hoy', 'Take-Two', 'Rockstar', 'Bloomberg', '30', '280', '300', '170', '330', 'recta', 'caer', 'rumor', 'noticia', 'rico', 'números', 'analistas', 'directivos', 'Invora', 'información'];

// Tarjeta de "lo que importa" (ícono + palabra).
const Importa: React.FC<{en: number; icono: (typeof I)[string]; texto: string}> = ({en: f, icono, texto}) => {
	const frame = useCurrentFrame();
	const r = Math.min(1, Math.max(0, (frame - f) / 8));
	return (
		<div
			style={{
				width: 262,
				height: 250,
				borderRadius: 28,
				background: C.blanco,
				boxShadow: `0 18px 44px rgba(0,0,0,0.6), 0 0 34px rgba(42,157,255,0.4)`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 18,
				opacity: r,
				transform: `translateY(${(1 - r) * 50}px) scale(${0.7 + 0.3 * r})`,
				fontFamily: FUENTE,
			}}
		>
			<div style={{width: 110, height: 110, borderRadius: 55, background: C.tinta, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<IconoMini trazos={icono} en={f + 2} tam={70} />
			</div>
			<div style={{fontWeight: 900, fontSize: 40, color: C.tinta}}>{texto}</div>
		</div>
	);
};

export const ReelGta6TakeTwo: React.FC = () => (
	<Dinamico.Provider value>
		<AbsoluteFill style={{fontFamily: FUENTE}}>
			<Fondo />
			<FondoSeccion tramos={FONDOS} />

			{/* Caja de titular fija (como la referencia), hasta que empieza el llamado de Invora */}
			<CajaTitular texto="GTA 6 sale hoy" hasta={ESCENAS.invora} icono={<IconoMini trazos={I.control} en={-20} tam={76} trazo={C.tinta} />} />

			{/* ---------- 1. La pregunta: Take-Two, dueña de Rockstar ---------- */}
			<S k="pregunta" gap={36}>
				<Texto en={-12} sinEntrada tam={84} style={{textAlign: 'left'}}>
					{'¿qué pasa con\nla *acción*?'}
				</Texto>
				<Fila gap={40}>
					<LogoChico {...LOGOS.taketwo} en={en('Take-Two', 1)} caja={220} />
					<div style={{display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start'}}>
						<Pildora en={en('la empresa')} texto="dueña de" icono={I.empresa} giro={-2} tam={44} />
						<LogoChico {...LOGOS.rockstar} en={en('Rockstar')} />
					</div>
				</Fila>
			</S>

			{/* ---------- 2. Precios objetivo: banda 280–300 y rango 170–330 ---------- */}
			<S k="objetivo" gap={30}>
				<Fila>
					<EtiquetaSeccion texto="Según" en={en('Según')} tam={30} />
					<LogoChico {...LOGOS.bloomberg} en={en('Bloomberg')} />
				</Fila>
				<FranjaDato
					en={en('potencial')}
					icono={I.sube}
					dato={<Cifra valor={30} antes="≈" despues=" %" en={en('30')} tam={112} dur={14} />}
					etiquetas={['potencial de subida', 'lo que ve Wall Street']}
				/>
				<RangoPrecios
					en={en('Los precios')}
					min={150}
					max={350}
					banda={{de: 280, a: 300, enDe: en('280'), enA: en('300')}}
					rango={{de: 170, a: 330, enDe: en('170'), enA: en('330')}}
				/>
				<div style={{display: 'flex', gap: 26}}>
					<Pildora en={en('en su mayoría')} texto="la *mayoría*" icono={I.persona} giro={-2} tam={44} />
					<Pildora en={en('rango')} texto="*muy amplio*" icono={I.alerta} giro={2} tam={44} />
				</div>
			</S>

			{/* ---------- 3. No es una línea recta ---------- */}
			<S k="recta" gap={24}>
				<EtiquetaSeccion texto="Y ojo" en={en('Y ojo')} />
				<Texto en={en('esto no es')} tam={64} style={{textAlign: 'left'}}>
					{'no es una *línea recta*'}
				</Texto>
				<LineaNoRecta en={en('esto no es')} caidas={[en('caer'), en('vende')]} ancho={860} alto={270} />
				<Pildora en={en('confirmó')} texto="cayó al confirmar la fecha" icono={I.baja} tipo="negativo" giro={-2} tam={42} />
				<Pildora en={en('compra el rumor')} texto="se compra el rumor" icono={I.sube} tipo="acento" giro={-2} tam={42} />
				<Pildora en={en('vende')} texto="se vende la noticia" icono={I.baja} tipo="negativo" giro={2} tam={42} />
			</S>

			{/* ---------- 4. Lo que importa: los números ---------- */}
			<S k="numeros" gap={44}>
				<div style={{paddingLeft: 10, marginTop: 24}}>
					<Tachado texto="te hace rico" en={en('Un videojuego')} tachaEn={en('no te hace')} tam={80} />
				</div>
				<Texto en={en('lo que importa')} tam={80} style={{textAlign: 'left'}}>
					{'lo que importa:\nlos *números*'}
				</Texto>
				<div style={{display: 'flex', gap: 37}}>
					<Importa en={en('números', 1)} icono={I.grafica} texto="números" />
					<Importa en={en('analistas', 2)} icono={I.persona} texto="analistas" />
					<Importa en={en('directivos')} icono={I.empresa} texto="directivos" />
				</div>
			</S>

			{/* ---------- 5. En Invora (fondo clásico) ---------- */}
			<Escena desde={ESCENAS.invora} hasta={ESCENAS.comenta}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60}}>
					<LogoInvora en={en('En Invora')} tam={110} />
					<Tachado texto="qué comprar" en={en('no te decimos')} tachaEn={en('comprar')} tam={84} />
					<Texto en={en('te mostramos')} tam={92}>
						{'te mostramos\nlos *números*'}
					</Texto>
				</div>
			</Escena>

			{/* ---------- 6. Comenta GTA (fondo clásico) ---------- */}
			<Escena desde={ESCENAS.comenta} hasta={ESCENAS.cierre}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44}}>
					<Texto en={en('Comenta')} tam={64} peso={800}>
						{'comenta'}
					</Texto>
					<Teclas palabra="GTA" en={en('GTA', 2)} paso={4} tam={150} />
					<Comentario en={en('GTA', 2) + 6} texto="GTA" enviaEn={en('te enviamos')} />
					<FichaInvora en={en('ficha')} logo={{archivo: LOGOS.taketwo.archivo, alto: 80}} ticker="TTWO" nombre="Take-Two" />
				</div>
			</Escena>

			{/* ---------- 7. Aviso y "sigue a Invora" (fondo clásico) ---------- */}
			<Escena desde={ESCENAS.cierre} hasta={ESCENAS.fin} salida={false}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 70}}>
					<Texto en={en('Esto es información')} tam={70} peso={800}>
						{'esto es *información*,\nno recomendación'}
					</Texto>
					<BotonSeguir en={en('Sigue')} sigueEn={en('Invora', 2) + 6} />
					<LogoInvora en={en('Invora', 2)} tam={120} />
				</div>
			</Escena>

			<Subtitulos palabras={PALABRAS} claves={CLAVES} negativas={['no']} y={1340} ocultar={[[ESCENAS.invora, ESCENAS.fin]]} reemplazos={{'280': '280 $', '300': '300 $', '170': '170 $', '330': '330 $', '30%': '30 %'}} propios={['Take-Two', 'Rockstar', 'Bloomberg', 'Wall', 'Street', 'Invora']} />
		</AbsoluteFill>
	</Dinamico.Provider>
);
