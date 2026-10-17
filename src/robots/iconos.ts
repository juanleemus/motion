// Íconos de línea (caja 100×100). relleno: 'a' azul tech, 'b' azul oscuro.
import type {Trazo} from './ui';

const circulo = (cx: number, cy: number, r: number) =>
	`M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

export const ICONOS: Record<string, Trazo[]> = {
	persona: [
		{d: 'M16 90c0-20 15-33 34-33s34 13 34 33Z', relleno: 'a'},
		{d: circulo(50, 30, 18), relleno: 'b'},
	],
	alerta: [
		{d: 'M50 10 L93 86 H7 Z', relleno: 'a'},
		{d: 'M50 38 V62'},
		{d: 'M50 74 V75'},
	],
	fantasma: [
		{d: 'M22 90 V46 a28 28 0 0 1 56 0 V90 l-9.33 -8 -9.33 8 -9.33 -8 -9.33 8 -9.33 -8 -9.33 8Z', relleno: 'a'},
		{d: circulo(39, 46, 5), relleno: 'b'},
		{d: circulo(61, 46, 5), relleno: 'b'},
	],
	robotaxi: [
		{d: 'M10 70 V54 l11 -20 c2 -4 5 -6 10 -6 h38 c5 0 8 2 10 6 l11 20 v16 c0 3 -2 5 -5 5 H15 c-3 0 -5 -2 -5 -5Z', relleno: 'a'},
		{d: 'M25 50 l7 -13 h36 l7 13Z', relleno: 'b'},
		{d: circulo(28, 75, 9), relleno: 'b'},
		{d: circulo(72, 75, 9), relleno: 'b'},
		{d: 'M43 28 V19 h14 v9', relleno: 'b'},
		{d: 'M34 11 q16 -10 32 0'},
	],
	ojo: [
		{d: 'M6 50 Q50 8 94 50 Q50 92 6 50Z', relleno: 'a'},
		{d: circulo(50, 50, 14), relleno: 'b'},
	],
	ficha: [
		{d: circulo(50, 50, 40), relleno: 'a'},
		{d: circulo(50, 50, 22), relleno: 'b'},
		{d: 'M50 10 V24 M50 76 V90 M10 50 H24 M76 50 H90'},
	],
	telefono: [
		{d: 'M32 6 h36 a8 8 0 0 1 8 8 v72 a8 8 0 0 1 -8 8 h-36 a8 8 0 0 1 -8 -8 v-72 a8 8 0 0 1 8 -8Z', relleno: 'a'},
		{d: 'M50 26 a13 13 0 0 1 13 13 c0 10 -13 22 -13 22 s-13 -12 -13 -22 a13 13 0 0 1 13 -13Z', relleno: 'b'},
		{d: 'M43 82 h14'},
	],
	red: [
		{d: 'M50 50 L18 20 M50 50 L82 20 M50 50 L18 80 M50 50 L82 80'},
		{d: circulo(50, 50, 14), relleno: 'a'},
		{d: circulo(18, 20, 10), relleno: 'b'},
		{d: circulo(82, 20, 10), relleno: 'b'},
		{d: circulo(18, 80, 10), relleno: 'b'},
		{d: circulo(82, 80, 10), relleno: 'b'},
	],
	calendario: [
		{d: 'M14 20 h72 a8 8 0 0 1 8 8 v58 a8 8 0 0 1 -8 8 h-72 a8 8 0 0 1 -8 -8 v-58 a8 8 0 0 1 8 -8Z', relleno: 'a'},
		{d: 'M6 42 H94'},
		{d: 'M32 8 V28 M68 8 V28'},
	],
	chat: [
		{d: 'M14 16 h72 a8 8 0 0 1 8 8 v42 a8 8 0 0 1 -8 8 h-40 l-18 16 v-16 h-14 a8 8 0 0 1 -8 -8 v-42 a8 8 0 0 1 8 -8Z', relleno: 'a'},
		{d: 'M30 45 v1 M50 45 v1 M70 45 v1'},
	],
	cadena: [
		{d: 'M24 34 h18 a16 16 0 0 1 0 32 h-18 a16 16 0 0 1 0 -32Z', relleno: 'a'},
		{d: 'M24 44 h18 a6 6 0 0 1 0 12 h-18 a6 6 0 0 1 0 -12Z', relleno: 'b'},
		{d: 'M58 34 h18 a16 16 0 0 1 0 32 h-18 a16 16 0 0 1 0 -32Z', relleno: 'a'},
		{d: 'M58 44 h18 a6 6 0 0 1 0 12 h-18 a6 6 0 0 1 0 -12Z', relleno: 'b'},
	],
	etiqueta: [
		{d: 'M8 50 L36 20 H86 a6 6 0 0 1 6 6 V74 a6 6 0 0 1 -6 6 H36 Z', relleno: 'a'},
		{d: circulo(32, 50, 6), relleno: 'b'},
		{d: 'M52 42 H78 M52 58 H70'},
	],
	flechaAbajo: [
		{d: 'M38 8 H62 V54 H82 L50 92 L18 54 H38 Z', relleno: 'a'},
	],
	rayo: [
		{d: 'M58 6 L18 56 H46 L40 94 L82 40 H54 Z', relleno: 'a'},
	],
	chip: [
		{d: 'M32 24 h36 a8 8 0 0 1 8 8 v36 a8 8 0 0 1 -8 8 h-36 a8 8 0 0 1 -8 -8 v-36 a8 8 0 0 1 8 -8Z', relleno: 'a'},
		{d: 'M40 40 h20 v20 h-20Z', relleno: 'b'},
		{d: 'M38 24 V10 M50 24 V10 M62 24 V10 M38 76 V90 M50 76 V90 M62 76 V90 M24 38 H10 M24 50 H10 M24 62 H10 M76 38 H90 M76 50 H90 M76 62 H90'},
	],
	nube: [
		{d: 'M28 76 a18 18 0 0 1 -2 -36 a24 24 0 0 1 46 -6 a20 20 0 0 1 4 42 Z', relleno: 'a'},
	],
	lupa: [
		{d: 'M62 62 L88 88'},
		{d: circulo(42, 42, 27), relleno: 'a'},
		{d: circulo(42, 42, 15), relleno: 'b'},
	],
	torta: [
		{d: 'M14 60 h72 v26 a4 4 0 0 1 -4 4 h-64 a4 4 0 0 1 -4 -4Z', relleno: 'a'},
		{d: 'M22 38 h56 v22 h-56Z', relleno: 'b'},
		{d: 'M30 18 h40 v20 h-40Z', relleno: 'a'},
		{d: 'M50 18 V6'},
	],
};
