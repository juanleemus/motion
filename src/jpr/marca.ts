// Identidad de Juan Pablo Ramos P. (docs/branding-juan-pablo/): colores, fuentes y medidas del reel.
import {staticFile} from 'remotion';
import {loadFont} from '@remotion/fonts';

export const COLOR = {
	medianoche: '#0A1F44', // base y fondos (50 %)
	blanco: '#FFFFFF', // textos y espacios limpios (25 %)
	lima: '#C8F542', // acento, palabras clave y botones (15 %)
	electrico: '#2F5FFF', // formas, líneas y detalles (10 %)
	lima35: 'rgba(200,245,66,0.35)',
} as const;

export const FUENTE = 'Poppins';
export const FUENTE_CUERPO = 'Open Sans'; // solo textos de más de 8 palabras en tarjetas o gráficos

export const TAM = {
	subtitulo: 64, // Poppins Bold 60–66
	titular: 120, // Poppins Black 110–130
	cursiva: 56, // Poppins Medium Italic 54–58
	pastilla: 56,
} as const;

export const SOMBRA_TEXTO = '0 2px 12px rgba(10,31,68,0.55)';
export const SOMBRA_CAPTURA = '0 30px 60px rgba(0,0,0,0.45)';

export const LIENZO = {ancho: 1080, alto: 1920} as const;
// Zona segura (Instagram / TikTok): todo lo importante va aquí adentro.
export const SEGURA = {x0: 70, x1: 930, y0: 300, y1: 1520} as const;
// Plano S: el apoyo ocupa el 48 % de arriba.
export const UNION_S = 920;
// Altura (centro de la línea) del subtítulo según el plano.
export const Y_SUB = {A: 1185, S: 962} as const;

let cargadas = false;
export const cargarFuentes = () => {
	if (cargadas) return;
	cargadas = true;
	const p = (archivo: string) => staticFile(`jpr/fuentes/${archivo}.woff2`);
	loadFont({family: FUENTE, url: p('poppins-latin-400-normal'), weight: '400'});
	loadFont({family: FUENTE, url: p('poppins-latin-500-italic'), weight: '500', style: 'italic'});
	loadFont({family: FUENTE, url: p('poppins-latin-700-normal'), weight: '700'});
	loadFont({family: FUENTE, url: p('poppins-latin-900-normal'), weight: '900'});
	loadFont({family: FUENTE_CUERPO, url: p('open-sans-latin-400-normal'), weight: '400'});
	loadFont({family: FUENTE_CUERPO, url: p('open-sans-latin-600-normal'), weight: '600'});
};
