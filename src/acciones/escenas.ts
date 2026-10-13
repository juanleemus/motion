import {DURACION, en} from './tiempos.ts';

// Inicio de cada escena: la primera palabra de su frase (3 fotogramas antes).
export const ESCENAS = {
	portada: 0,
	formas: en('Estas son') - 3,
	reportes: en('Uno') - 3,
	frena: en('Busca') - 3,
	micron: en('Meses') - 3,
	memoria: en('Microsoft') - 3,
	directivos: en('Dos') - 3,
	plata: en('Pero con') - 3,
	conviccion: en('Plata propia') - 3,
	fondos: en('Tres') - 3,
	sector: en('Si gente') - 3,
	redes: en('Y cuatro') - 3,
	posts: en('Pero no leas') - 3,
	medidor: en('Si todo') - 3,
	mano: en('No lo hagas') - 3,
	invora: en('Invora') - 3,
	comenta: en('Comenta') - 3,
	cierre: en('Soy Miguel') - 3,
	fin: DURACION,
};
