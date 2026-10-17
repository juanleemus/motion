import {DURACION, en} from './tiempos.ts';

// Inicio de cada escena: la primera palabra de su frase (3 fotogramas antes).
export const ESCENAS = {
	portada: 0,
	cadena: 90, // la portada queda fija los primeros 3 s
	meta: en('Meta es una') - 3,
	barata: en('Hay otra') - 3,
	perdiendo: en('Todo el mundo') - 3,
	dia12: en('Día 12') - 3,
	torta: en('La IA es') - 3,
	chat: en('Le pedí') - 3,
	cuatro: en('Amazon') - 3,
	numeroUno: en('Y la número') - 3,
	energia: en('En energía') - 3,
	chips: en('En chips') - 3,
	nube: en('En nube') - 3,
	modelo: en('Modelo') - 3,
	apps: en('En apps') - 3,
	veces: en('unas 17') - 3,
	caida: en('Entonces') - 3,
	plana: en('Porque desde') - 3,
	ojo: en('Ojo') - 3,
	titular: en('Pero cuando') - 3,
	pasado: en('la caída') - 3,
	comenta: en('Comenta') - 3,
	gringos: en('Esto los gringos') - 3,
	cierre: en('Por eso') - 3,
	fin: DURACION,
};
