// Composición de prueba: todas las piezas de src/jpr/ por estaciones de 2 s, antes de montar el reel.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Modo, Plano} from './fondos';
import {Subtitulo, Titular} from './texto';
import {Alerta, Barra, Nodos, Pastillas, Recuadro, Resaltador} from './graficos';
import {Captura, Icono3D, Sello} from './medios';
import {COLOR, FUENTE_CUERPO, Y_SUB} from './marca';

export const PASO_PRUEBA = 60;
const ESTACIONES = ['Plano S + subtítulo', 'Barra, alerta, recuadro, resaltador', 'Pastillas', 'Nodos', 'Íconos, sello y captura', 'Plano A + llamado a la acción'];
export const DURACION_PRUEBA = ESTACIONES.length * PASO_PRUEBA;

const Etiqueta: React.FC<{t: string; claro?: boolean}> = ({t, claro}) => (
	<div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', fontFamily: FUENTE_CUERPO, fontWeight: 600, fontSize: 30, color: claro ? COLOR.medianoche : 'rgba(255,255,255,0.7)'}}>
		PRUEBA · {t}
	</div>
);

export const PruebaJPR: React.FC = () => {
	const frame = useCurrentFrame();
	const i = Math.min(ESTACIONES.length - 1, Math.floor(frame / PASO_PRUEBA));
	const d = i * PASO_PRUEBA; // inicio de la estación
	const contenido = [
		<>
			<Plano tipo="S" fondo="oscuro">
				<Titular desde={d + 2} y={600} texto="PALABRA" />
			</Plano>
			<Subtitulo
				y={Y_SUB.S}
				bloques={[
					{f: d, t: 'con [color]'},
					{f: d + 18, t: 'y {énfasis}'},
					{f: d + 34, t: 'bloque', cursiva: {t: 'y segunda voz', f: d + 34}},
				]}
			/>
		</>,
		<Plano tipo="B" fondo="oscuro">
			<Subtitulo y={1100} bloques={[{f: d, t: 'la barra se llena'}]} />
			<Barra desde={d} hasta={d + 40} x={540} y={1190} />
			<Alerta desde={d + 30} x={820} y={1190} />
			<Titular desde={d + 2} y={600} texto="RECUADRO" modo="fijo" />
			<Recuadro desde={d + 10} x={170} y={520} ancho={740} alto={160} />
			<Resaltador desde={d + 20} x={260} y={780} ancho={560} alto={96} />
			<Titular desde={d + 2} y={828} texto="resaltado" tam={90} modo="fijo" />
		</Plano>,
		<Plano tipo="B" fondo="oscuro">
			<Pastillas x={540} y={460} items={['una', 'pastilla', 'por palabra'].map((t, k) => ({texto: t, desde: d + 4 + k * 12}))} />
		</Plano>,
		<Plano tipo="B" fondo="oscuro">
			<Nodos
				desde={d + 2}
				centro={{x: 540, y: 820, r: 100, glifo: 'union'}}
				satelites={[
					{x: 260, y: 520, texto: 'logo'},
					{x: 820, y: 520, texto: 'logo'},
					{x: 260, y: 1120, glifo: 'persona'},
					{x: 820, y: 1120, glifo: 'tienda'},
				]}
			/>
		</Plano>,
		<Plano tipo="B" fondo="claro">
			<Sello desde={d + 2} x={150} y={370} />
			<Icono3D desde={d + 4} nombre="megafono" x={330} y={620} tam={240} />
			<Icono3D desde={d + 10} nombre="billetes" x={750} y={620} tam={240} />
			<Captura desde={d} hasta={d + PASO_PRUEBA} x={140} y={900} ancho={800} alto={500}>
				<AbsoluteFill style={{background: COLOR.medianoche, padding: 40, display: 'flex', flexDirection: 'column', gap: 24}}>
					{[0.9, 0.6, 0.75, 0.4].map((w, k) => (
						<div key={k} style={{height: 40, width: `${w * 100}%`, borderRadius: 10, background: k === 1 ? COLOR.electrico : 'rgba(255,255,255,0.25)'}} />
					))}
				</AbsoluteFill>
			</Captura>
		</Plano>,
		<>
			<Plano tipo="A" zoom={frame - d > 30} />
			<Sello desde={d + 2} x={150} y={370} />
			<Subtitulo y={Y_SUB.A} bloques={[{f: d, t: 'Si quieres'}, {f: d + 20, t: 'SÍGUEME', cta: true}]} />
		</>,
	][i];
	return (
		<Modo.Provider value={{transparente: false, criticos: false}}>
			<AbsoluteFill style={{background: '#000'}}>
				{contenido}
				<Etiqueta t={ESTACIONES[i]} claro={i === 4} />
			</AbsoluteFill>
		</Modo.Provider>
	);
};
