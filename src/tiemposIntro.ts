// Momentos de la intro "Día X de 12" (fotogramas a 30 fps).
export const TOTAL_DIAS = 12;
export const DURACION_INTRO = 135; // 4,5 s
export const T_INTRO = {
	insignia: 0, // 0,0 s
	dibujo: 12, // 0,4 s
	enciende: 39, // 1,3 s
	escuela: 51, // 1,7 s
	invora: 60, // 2,0 s
	baja: 117, // 3,9 s
};

// Versión corta de 2,5 s: mismos pasos y movimientos, más seguidos.
export const DURACION_INTRO_CORTA = 75; // 2,5 s
export const T_INTRO_CORTA: typeof T_INTRO = {
	insignia: 0, // 0,0 s
	dibujo: 7, // 0,23 s
	enciende: 24, // 0,8 s
	escuela: 33, // 1,1 s
	invora: 38, // 1,27 s
	baja: 62, // 2,07 s (llega al 35 % justo al final)
};
