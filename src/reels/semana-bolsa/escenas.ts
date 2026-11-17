import {DURACION, en} from './tiempos.ts';

// Inicio de cada sección: la primera palabra de su frase (3 fotogramas antes).
export const ESCENAS = {
	apertura: 0,
	nvidia: en('Hoy martes') - 3,
	opciones: en('Según las opciones') - 3,
	fed: en('Mañana') - 3,
	fedwatch: en('Según CME') - 3,
	jueves: en('Y el jueves') - 3,
	iran: en('Se espera') - 3,
	cierre: en('Nadie') + 4, // un poco después: deja ver las píldoras del petróleo
	encuesta: en('Y tú') - 3,
	sigue: en('y sigue') - 3,
	fin: DURACION,
};
