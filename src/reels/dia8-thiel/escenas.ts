import {DURACION, en} from './tiempos.ts';

// Inicio de cada escena: la primera palabra de su frase (3 fotogramas antes).
export const ESCENAS = {
	portada: 0,
	plata: en('Y de repente') - 3,
	fundador: en('Cuando') - 3,
	mirar: en('Hay que mirar') - 3,
	dia8: en('día 8') - 3,
	chat: en('Le pedí') - 3,
	electricidad: en('La electricidad') - 3,
	producir: en('Producir') - 3,
	mover: en('Moverla') - 3,
	gastar: en('Y gastarla') - 3,
	chips: en('O sea') - 3,
	ojo: en('Ojo') - 3,
	dinero: en('Pero sí') - 3,
	trimestre: en('Los movimientos') - 3,
	comenta: en('Comenta') - 3,
	todos: en('Thiel', 6) - 3,
	gringos: en('Esto los gringos') - 3,
	cierre: en('Por eso') - 3,
	fin: DURACION,
};
