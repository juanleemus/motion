// Intro de plan v (7 s a 30 fps; el último segundo es negro total), estilo "title card" cinematográfico. Momentos en fotogramas.
export const FPS_PLANV = 30;
export const DURACION_PLANV = 210;
export const NEGRO_FINAL = 180; // desde aquí, pantalla negra

// Los tres hosts aparecen uno tras otro.
export const NOMBRES = ['Ary', 'Juan', 'Matthew'];
export const T_NOMBRES = [4, 30, 56]; // entra cada nombre
export const DUR_NOMBRE = 22; // cuánto se queda cada uno antes de irse

export const T_PLANV = {
	brillo: 62, // el brillo bermellón sube desde abajo
	logo: 84, // el isotipo se dibuja en el centro
	arma: 104, // el isotipo se corre y entra "plan v"
	etiqueta: 118, // "podcast"
	sale: 166, // todo se desenfoca y se va (el logo armado queda ~2 s)
	brillo2: 156, // segundo brillo que acompaña la salida
};

export const COLORES = {
	bermellon: '#F2381F',
	negro: '#111111',
	papel: '#EDEDEA',
	sombra: '#6E1A0F',
};
