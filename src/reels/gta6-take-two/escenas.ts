import {DURACION, en} from './tiempos.ts';

// Inicio de cada escena (un objeto por idea, como el guion audiovisual).
// pregunta, potencial y numeros van en pantalla dividida (video o foto arriba, gráficos abajo).
export const ESCENAS = {
	pregunta: 0,
	potencial: en('Según') - 3,
	precios: en('Los precios') - 3,
	recta: en('Y ojo') - 3,
	numeros: en('Un videojuego') - 3,
	invora: en('En Invora') - 3,
	comenta: en('Comenta') - 3,
	cierre: en('Esto es información') - 3,
	fin: DURACION,
};
