// Íconos de línea nuevos del Día 11 (caja 100×100). relleno: 'a' azul tech, 'b' azul oscuro.
import type {Trazo} from '../robots/ui';

const circulo = (cx: number, cy: number, r: number) =>
	`M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const cuadro = (x: number, y: number, w: number, h: number) => `M${x} ${y} h${w} v${h} h${-w}Z`;

export const ICONOS11: Record<string, Trazo[]> = {
	edificio: [
		{d: 'M22 92 V20 a4 4 0 0 1 4 -4 h48 a4 4 0 0 1 4 4 V92Z', relleno: 'a'},
		{d: cuadro(32, 28, 12, 12), relleno: 'b'},
		{d: cuadro(56, 28, 12, 12), relleno: 'b'},
		{d: cuadro(32, 50, 12, 12), relleno: 'b'},
		{d: cuadro(56, 50, 12, 12), relleno: 'b'},
		{d: 'M42 92 V74 h16 V92', relleno: 'b'},
		{d: 'M10 92 H90'},
	],
	gota: [
		{d: 'M50 6 C50 6 16 46 16 64 a34 34 0 0 0 68 0 C84 46 50 6 50 6Z', relleno: 'a'},
		{d: 'M32 64 a18 18 0 0 0 14 18'},
	],
	lupa: [
		{d: circulo(42, 42, 30), relleno: 'a'},
		{d: 'M64 64 L90 90'},
	],
	adn: [
		{d: 'M32 6 C32 30 68 30 68 50 C68 70 32 70 32 94'},
		{d: 'M68 6 C68 30 32 30 32 50 C32 70 68 70 68 94'},
		{d: 'M38 16 H62 M44 28 H56 M44 72 H56 M38 84 H62'},
		{d: circulo(50, 39, 6), relleno: 'a'},
		{d: circulo(50, 61, 6), relleno: 'a'},
		{d: circulo(32, 6, 5), relleno: 'b'},
		{d: circulo(68, 94, 5), relleno: 'b'},
	],
	huella: [
		{d: circulo(50, 50, 44), relleno: 'a'},
		{d: 'M28 70 C22 56 24 38 36 30 C48 22 64 26 70 38'},
		{d: 'M38 80 C32 68 32 52 40 45 C48 38 60 42 62 52 C64 62 62 70 64 80'},
		{d: 'M50 84 C46 74 46 62 50 56 C53 54 55 58 55 63 C55 70 56 76 58 82'},
		{d: 'M74 48 C76 58 75 66 72 74'},
	],
	chip: [
		{d: 'M26 22 h48 a4 4 0 0 1 4 4 v48 a4 4 0 0 1 -4 4 h-48 a4 4 0 0 1 -4 -4 v-48 a4 4 0 0 1 4 -4Z', relleno: 'a'},
		{d: 'M36 22 V8 M50 22 V8 M64 22 V8 M36 78 V92 M50 78 V92 M64 78 V92'},
		{d: 'M22 36 H8 M22 50 H8 M22 64 H8 M78 36 H92 M78 50 H92 M78 64 H92'},
	],
};
