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
};
