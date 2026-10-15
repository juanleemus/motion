// Reel JPR · "Competir no es una opción". Cada corte, bloque y animación entra en su palabra del audio guía.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Modo, Plano} from './fondos';
import {Subtitulo, Titular} from './texto';
import {Alerta, Barra, Nodos, Pastillas, Recuadro, Resaltador} from './graficos';
import {Icono3D, Sello} from './medios';
import {ESCENAS, escena} from './escenas';
import {Y_SUB} from './marca';
import {LOGOS, LOGOS_GANCHO} from './kit';
import {en, finDe} from './tiempos';

export type PropsReel = {transparente?: boolean; criticos?: boolean};

// Apoyo visual de cada escena (coordenadas del lienzo 1080×1920) y altura de sus subtítulos en el plano B.
const APOYOS: Record<string, {nodo: React.ReactNode; ySub?: number}> = {
	gancho: {
		nodo: (
			<Nodos
				desde={0}
				centro={{x: 540, y: 610, r: 100, glifo: 'mundo'}}
				r={68}
				satelites={[
					[300, 400],
					[780, 400],
					[845, 620],
					[750, 820],
					[330, 820],
					[235, 620],
				].map(([x, y], i) => ({x, y, logo: LOGOS_GANCHO[i]}))}
			/>
		),
	},
	sobrevivir: {
		nodo: (
			<>
				<Sello desde={escena('sobrevivir').desde} x={150} y={370} />
				<Titular desde={en('sobrevivir')} y={760} texto="SOBREVIVIR" tam={112} modo="lima" />
			</>
		),
		ySub: 1010,
	},
	alianzas: {
		nodo: (
			<Nodos
				desde={escena('alianzas').desde}
				centro={{x: 540, y: 600, r: 80, texto: 'con'}}
				r={92}
				satelites={[
					{x: 260, y: 410, texto: 'Oreo', logo: LOGOS.oreo, desde: en('Oreo')},
					{x: 820, y: 410, texto: 'Coca-Cola', logo: LOGOS.cocacola, desde: en('Coca-Cola')},
					{x: 260, y: 790, texto: 'Omega', logo: LOGOS.omega, desde: en('Omega')},
					{x: 820, y: 790, texto: 'Snoop', logo: LOGOS.snoop, desde: en('Snoop')},
				]}
			/>
		),
	},
	costo: {
		nodo: (
			<>
				<Barra desde={en('El costo')} hasta={finDe('las nubes')} x={540} y={1275} />
				<Alerta desde={en('nubes')} x={820} y={1275} />
			</>
		),
	},
	anuncios: {
		nodo: (
			<>
				<Icono3D desde={escena('anuncios').desde} nombre="megafono" x={540} y={600} tam={300} />
				<Titular desde={en('anuncios')} y={1000} texto="ANUNCIOS" tono="claro" />
				<Recuadro desde={en('anuncios')} x={180} y={918} ancho={720} alto={164} />
			</>
		),
		ySub: 1230,
	},
	solo: {nodo: <Icono3D desde={escena('solo').desde} nombre="tienda" x={540} y={580} tam={320} />},
	afin: {
		nodo: (
			<Pastillas
				x={540}
				y={400}
				items={[
					{texto: 'buscar', desde: en('buscar')},
					{texto: 'una marca', desde: en('una marca que sea')},
					{texto: 'afín', desde: en('afín')},
				]}
			/>
		),
		ySub: 1010,
	},
	cobranding: {
		nodo: (
			<>
				<Icono3D desde={escena('cobranding').desde} nombre="union" x={540} y={480} tam={280} />
				<Titular desde={en('cobranding')} y={790} texto="COBRANDING" tono="claro" tam={110} />
			</>
		),
	},
	ganando: {
		nodo: (
			<>
				<Titular desde={en('ganando')} y={420} texto="GANANDO" tono="claro" />
				<Nodos
					desde={escena('ganando').desde}
					centro={{x: 540, y: 720, r: 100, glifo: 'union'}}
					r={80}
					idaYVuelta
					satelites={[
						{x: 240, y: 720, glifo: 'persona'},
						{x: 840, y: 720, glifo: 'persona'},
					]}
				/>
			</>
		),
		ySub: 1050,
	},
	pauta: {
		nodo: (
			<>
				<Icono3D desde={escena('pauta').desde} nombre="billetes" x={540} y={450} tam={260} />
				<Resaltador desde={en('pauta')} x={215} y={706} ancho={650} alto={112} />
				<Titular desde={en('en pauta')} y={762} texto="EN PAUTA" tono="claro" modo="fijo" />
			</>
		),
	},
	cierre: {nodo: <Sello desde={escena('cierre').desde} x={150} y={370} />},
};

export const ReelJPR: React.FC<PropsReel> = ({transparente = false, criticos = false}) => {
	const frame = useCurrentFrame();
	const e = ESCENAS.find((x) => frame >= x.desde && frame < x.hasta) ?? ESCENAS[ESCENAS.length - 1];
	const apoyo = APOYOS[e.id];
	const zoom = (e.zooms ?? []).some(([a, z]) => frame >= a && frame < z);
	const ySub = e.plano === 'B' ? (apoyo?.ySub ?? 1100) : Y_SUB[e.plano];
	const tono = e.plano === 'B' && e.fondo === 'claro' ? 'claro' : 'oscuro';
	return (
		<Modo.Provider value={{transparente, criticos}}>
			<AbsoluteFill style={{background: transparente || criticos ? 'transparent' : '#000'}}>
				{/* corte seco: solo se dibuja la escena activa */}
				<Plano tipo={e.plano} fondo={e.fondo} zoom={zoom}>
					{e.plano !== 'A' ? apoyo?.nodo : null}
				</Plano>
				{e.plano === 'A' ? apoyo?.nodo : null}
				<Subtitulo bloques={e.bloques} y={ySub} tono={tono} />
			</AbsoluteFill>
		</Modo.Provider>
	);
};
