import {DURACION, en} from './tiempos.ts';

// Inicio de cada escena (un objeto por idea, como el guion audiovisual).
export const ESCENAS = {
	torre: 0,
	calendario: en('antes') - 3,
	precio: en('Según', 1) - 3,
	billetes: en('Vendió') - 3,
	grafica: en('pero ojo') - 3,
	bloomberg: en('Por eso') - 3,
	latido: en('El primer día') - 3,
	hoy: en('Nadie') - 3,
	invora: en('En Invora') - 3,
	comenta: en('Comenta') - 3,
	cierre: en('Esto es información') - 3,
	fin: DURACION,
};
