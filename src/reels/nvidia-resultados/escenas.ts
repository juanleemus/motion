import {DURACION, en} from './tiempos.ts';

// Inicio de cada sección: la primera palabra de su frase (3 fotogramas antes).
export const ESCENAS = {
	pregunta: 0,
	ventas: en('Vamos con') - 3,
	datos: en('De esos') - 3,
	accion: en('Por acción') - 3,
	proyeccion: en('Para el próximo') - 3,
	jensen: en('Y todo esto') - 3,
	recompra: en('Hoy también') - 3,
	miedo: en('Entonces') - 3,
	tras: en('Tras el cierre') - 3,
	apertura: en('Esta mañana') - 3,
	cierre: en('Esto es información') - 3,
	fin: DURACION,
};
