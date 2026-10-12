import {DURACION, en} from './tiempos.ts';

// Inicio de cada escena: la primera palabra de su frase (3 fotogramas antes).
export const ESCENAS = {
	portada: 0,
	ceo: en('CEO') - 3,
	plata: en('10 millones') - 3,
	pelosi: en('Nancy') - 3,
	ackman: en('Bill') - 3,
	feo: en('Alguien') - 3,
	dia5: en('Día 5') - 3,
	miedo: en('A qué le') - 3,
	carros: en('A los carros') - 3,
	waymo: en('Waymo de Google') - 3,
	tesla: en('Tesla') - 3,
	pregunta: en('Y la pregunta') - 3,
	chat: en('Entonces') - 3,
	unaODos: en('El miedo supone') - 3,
	flotas: en('Pero y si') - 3,
	apps: en('Diez apps') - 3,
	cerca: en('el carro', 2) - 3,
	esaApp: en('Y esa app') - 3,
	ojo: en('Ojo') - 3,
	apostando: en('Pero ahora') - 3,
	comenta: en('Comenta') - 3,
	gringos: en('gringos') - 3,
	cierre: en('Por eso') - 3,
	fin: DURACION,
};
