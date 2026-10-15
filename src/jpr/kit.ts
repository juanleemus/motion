// Activos del kit del cliente. Lo que está en null todavía no lo han entregado:
// la pieza usa entonces su versión provisional (texto literal del guion o ícono plano de marca).
// Para usar el archivo real, se copia a public/jpr/... y se pone aquí la ruta.

// Clip de Juan Pablo a cámara (sin audio). null = el editor lo monta debajo del .mov transparente.
export const CLIP_PRESENTADOR: string | null = null;

// Símbolo JPR (va dentro del cuadro lima del Sello). Ej.: 'jpr/simbolo-jpr.png'
export const SIMBOLO_JPR: string | null = null;

// Logos de terceros, siempre oficiales (nunca redibujados). Ej.: 'jpr/logos/oreo.png'
// Los .svg son los logos oficiales en un solo color del paquete simple-icons (CC0): se pintan de blanco.
// Los .png del cliente se muestran con sus colores originales.
export const LOGOS: Record<'oreo' | 'cocacola' | 'omega' | 'snoop', string | null> = {
	oreo: null, // pendiente: no está en ningún paquete de logos; lo debe entregar el cliente
	cocacola: 'jpr/logos/cocacola.svg',
	omega: null, // pendiente
	snoop: null, // pendiente
};

// Marcas grandes del gancho ("las marcas más grandes del mundo").
export const LOGOS_GANCHO = ['nike', 'apple', 'mcdonalds', 'google', 'starbucks', 'samsung'].map((n) => `jpr/logos/${n}.svg`);

// Fondo claro entregado por el cliente (cuadrícula de equis).
export const FONDO_CLARO = 'jpr/fondo-cuadricula-x.jpg';

// Íconos 3D del kit. Ej.: 'jpr/iconos/megafono.png'
export const ICONOS_3D: Record<'megafono' | 'tienda' | 'union' | 'billetes', string | null> = {
	megafono: null,
	tienda: null,
	union: null,
	billetes: null,
};
