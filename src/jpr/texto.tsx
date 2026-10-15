// Subtítulos por bloques, titulares y llamado a la acción.
// Marcas dentro del texto de un bloque:  [palabra] = entrada en color · {palabra} = énfasis lima fijo.
import React from 'react';
import {interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {COLOR, FUENTE, LIENZO, SOMBRA_TEXTO, TAM} from './marca';
import {textoPlano, type Bloque} from './bloques.ts';

export type {Bloque};

export type Tono = 'oscuro' | 'claro'; // claro = texto medianoche sobre fondo blanco

const sube = (frame: number, desde: number, dur: number, px: number) => {
	const p = interpolate(frame, [desde, desde + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return {opacity: desde <= 0 ? 1 : p, transform: `translateY(${desde <= 0 ? 0 : (1 - p) * px}px)`};
};

// Entrada en color: eléctrico → lima → blanco (o medianoche) en 10 fotogramas.
export const colorEntrada = (frame: number, desde: number, final: string) =>
	interpolateColors(frame - desde, [0, 5, 10], [COLOR.electrico, COLOR.lima, final]);


const Partes: React.FC<{t: string; desde: number; tono: Tono}> = ({t, desde, tono}) => {
	const frame = useCurrentFrame();
	const base = tono === 'claro' ? COLOR.medianoche : COLOR.blanco;
	const trozos = t.split(/(\[[^\]]+\]|\{[^}]+\})/).filter(Boolean);
	return (
		<>
			{trozos.map((s, i) => {
				if (s.startsWith('['))
					return (
						<span key={i} style={{color: colorEntrada(frame, desde, base)}}>
							{s.slice(1, -1)}
						</span>
					);
				if (s.startsWith('{')) {
					const e = interpolate(frame - desde, [0, 5], [1.15, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					return (
						<span key={i} style={{color: COLOR.lima, display: 'inline-block', transform: `scale(${e})`}}>
							{s.slice(1, -1)}
						</span>
					);
				}
				return <span key={i}>{s}</span>;
			})}
		</>
	);
};

const linea = (y: number, alto: number): React.CSSProperties => ({
	position: 'absolute',
	left: 0,
	width: LIENZO.ancho,
	top: y - alto / 2,
	height: alto,
	lineHeight: `${alto}px`,
	textAlign: 'center',
	whiteSpace: 'pre',
	fontFamily: FUENTE,
});

// El bloque cambia en seco en su palabra; no hay animación de salida.
export const Subtitulo: React.FC<{bloques: Bloque[]; y: number; tono?: Tono}> = ({bloques, y, tono = 'oscuro'}) => {
	const frame = useCurrentFrame();
	const activo = [...bloques].reverse().find((b) => b.f <= frame);
	if (!activo) return null;
	if (activo.cta) return <LlamadoAccion desde={activo.f} y={y} texto={textoPlano(activo.t)} />;
	const sombra = tono === 'claro' ? 'none' : SOMBRA_TEXTO;
	const color = tono === 'claro' ? COLOR.medianoche : COLOR.blanco;
	const fc = activo.cursiva ? Math.max(activo.f + 4, activo.cursiva.f) : 0;
	return (
		<>
			<div style={{...linea(y, 86), ...sube(frame, activo.f, 3, 8), fontWeight: 700, fontSize: TAM.subtitulo, color, textShadow: sombra}}>
				<Partes t={activo.t} desde={activo.f} tono={tono} />
			</div>
			{activo.cursiva && frame >= fc ? (
				<div
					style={{
						...linea(y + 74, 76),
						...sube(frame, fc, 4, 10),
						fontWeight: 500,
						fontStyle: 'italic',
						fontSize: TAM.cursiva,
						color,
						textShadow: sombra,
					}}
				>
					<Partes t={activo.cursiva.t} desde={fc} tono={tono} />
				</div>
			) : null}
		</>
	);
};

// Palabra clave o titular de un apoyo B en Poppins Black. color: 'entrada' (eléctrico→lima→base) o fijo.
export const Titular: React.FC<{
	desde: number;
	y: number;
	texto: string;
	tono?: Tono;
	tam?: number;
	modo?: 'entrada' | 'lima' | 'fijo';
}> = ({desde, y, texto, tono = 'oscuro', tam = TAM.titular, modo = 'entrada'}) => {
	const frame = useCurrentFrame();
	if (frame < desde) return null;
	const base = tono === 'claro' ? COLOR.medianoche : COLOR.blanco;
	const color = modo === 'entrada' ? colorEntrada(frame, desde, base) : modo === 'lima' ? COLOR.lima : base;
	const e = interpolate(frame - desde, [0, 5], [1.15, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<div
			style={{
				...linea(y, tam * 1.1),
				...sube(frame, desde, 3, 8),
				fontWeight: 900,
				fontSize: tam,
				letterSpacing: -1,
				color,
				textShadow: tono === 'claro' ? 'none' : SOMBRA_TEXTO,
			}}
		>
			<span style={{display: 'inline-block', transform: `scale(${modo === 'lima' ? e : 1})`}}>{texto}</span>
		</div>
	);
};

// Llamado a la acción: botón lima con la palabra en MAYÚSCULAS (entra con escala 1,15→1 y late suave).
export const LlamadoAccion: React.FC<{desde: number; y: number; texto: string}> = ({desde, y, texto}) => {
	const frame = useCurrentFrame();
	if (frame < desde) return null;
	const t = frame - desde;
	const e = interpolate(t, [0, 5], [1.15, 1], {extrapolateRight: 'clamp'}) * (1 + 0.025 * Math.sin(Math.max(0, t - 8) / 5));
	const anillo = interpolate(t % 30, [0, 30], [0, 1]);
	return (
		<div style={{position: 'absolute', left: 0, width: LIENZO.ancho, top: y - 60, height: 120, display: 'flex', justifyContent: 'center'}}>
			<div style={{position: 'relative', transform: `scale(${e})`}}>
				<div
					style={{
						position: 'absolute',
						inset: -6 - anillo * 22,
						borderRadius: 999,
						border: `4px solid ${COLOR.lima}`,
						opacity: (1 - anillo) * 0.7,
					}}
				/>
				<div
					style={{
						height: 120,
						padding: '0 64px',
						borderRadius: 999,
						background: COLOR.lima,
						color: COLOR.medianoche,
						fontFamily: FUENTE,
						fontWeight: 900,
						fontSize: 76,
						lineHeight: '120px',
						boxShadow: '0 12px 40px rgba(10,31,68,0.45)',
					}}
				>
					{texto}
				</div>
			</div>
		</div>
	);
};
