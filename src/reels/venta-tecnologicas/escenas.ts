import {DURACION, en} from './tiempos.ts';

// Una idea por escena, como el guion audiovisual. Las marcadas con * van en pantalla dividida.
export const ESCENAS = {
	gancho: 0, // *
	viernes: en('Primero') - 3,
	racha: en('Fue su') - 3,
	cnbc: en('Y según CNBC') - 3, // *
	chips: en('Quién cayó') - 3,
	cadena: en('No cayó') - 3,
	giro: en('Y hoy el giro') - 3, // *
	nvidia30: en('Y después de la apertura') - 3, // *
	suben: en('Según Yahoo') - 3,
	ojo: en('Pero ojo') - 3,
	volatilidad: en('Después de movimientos') - 3,
	bloomberg: en('Según Bloomberg') - 3, // *
	fed: en('Y según 24/7') - 3, // *
	hacemos: en('Entonces') - 3, // *
	datos: en('Porque cuando') - 3,
	metodo: en('Nadie sabe') - 3,
	invora: en('En Invora') - 3,
	comenta: en('Comenta') - 3,
	cierre: en('Esto es información') - 3,
	fin: DURACION,
};
