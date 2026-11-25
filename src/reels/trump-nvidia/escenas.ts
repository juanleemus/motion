import {DURACION, en} from './tiempos.ts';

export const ESCENAS = {
	gancho: 0,
	convencio: en('Justo después') - 3,
	cnbc: en('Según CNBC', 1) - 3,
	transa: en('Y aquí viene') - 3,
	legal: en('Comprar y vender') - 3,
	razones: en('Ahora') - 3,
	semana: en('En una semana') - 3,
	miedo: en('El miedo está') - 3,
	vix: en('Y el VIX') - 3,
	historia: en('Qué nos dice') - 3,
	abril: en('La última vez') - 3,
	poder: en('Por eso') - 3,
	app: en('En Invora') - 3,
	comenta: en('Comenta') - 3,
	cierre: en('Esto es información') - 3,
	fin: DURACION,
};
