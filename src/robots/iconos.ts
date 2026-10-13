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
	periodico: [
		{d: 'M24 12 h62 a6 6 0 0 1 6 6 v62 a10 10 0 0 1 -10 10 H18 a10 10 0 0 1 -10 -10 V34 h16Z', relleno: 'a'},
		{d: 'M24 34 V80 a6 6 0 0 1 -12 0'},
		{d: 'M34 24 h46 v16 h-46Z', relleno: 'b'},
		{d: 'M34 52 h46 M34 64 h46 M34 76 h30'},
	],
	documento: [
		{d: 'M26 6 h36 l20 20 v60 a8 8 0 0 1 -8 8 h-48 a8 8 0 0 1 -8 -8 v-72 a8 8 0 0 1 8 -8Z', relleno: 'a'},
		{d: 'M62 6 v20 h20', relleno: 'b'},
		{d: 'M32 46 h36 M32 59 h36 M32 72 h22'},
	],
	embudo: [
		{d: 'M8 12 h84 l-32 38 v28 l-20 12 v-40Z', relleno: 'a'},
		{d: 'M20 26 h60', relleno: null},
	],
	chip: [
		{d: 'M28 24 h44 a6 6 0 0 1 6 6 v40 a6 6 0 0 1 -6 6 h-44 a6 6 0 0 1 -6 -6 v-40 a6 6 0 0 1 6 -6Z', relleno: 'a'},
		{d: 'M38 38 h24 v24 h-24Z', relleno: 'b'},
		{d: 'M36 24 V10 M50 24 V10 M64 24 V10 M36 76 V90 M50 76 V90 M64 76 V90 M22 38 H8 M22 62 H8 M78 38 H92 M78 62 H92'},
	],
	diana: [
		{d: circulo(46, 54, 38), relleno: 'a'},
		{d: circulo(46, 54, 24), relleno: 'b'},
		{d: circulo(46, 54, 10), relleno: 'a'},
		{d: 'M46 54 L86 14 M74 12 h14 v14'},
	],
	edificio: [
		{d: 'M14 84 V36 L50 12 L86 36 V84Z', relleno: 'a'},
		{d: 'M30 46 V74 M50 46 V74 M70 46 V74'},
		{d: 'M6 88 H94'},
	],
	politico: [
		{d: 'M16 90c0-20 15-33 34-33s34 13 34 33Z', relleno: 'a'},
		{d: circulo(50, 30, 18), relleno: 'b'},
		{d: 'M50 58 l-6 8 l6 20 l6 -20Z', relleno: 'b'},
	],
	mano: [
		{
			d: 'M34 92 C26 84 16 70 11 60 c-3 -6 3 -11 9 -6 l10 9 V26 a6 6 0 0 1 12 0 v22 V16 a6 6 0 0 1 12 0 v32 V20 a6 6 0 0 1 12 0 v30 V32 a6 6 0 0 1 12 0 v32 c0 16 -10 28 -24 28Z',
			relleno: 'a',
		},
	],
};
