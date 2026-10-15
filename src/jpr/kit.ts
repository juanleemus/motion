// Activos del kit del cliente. Lo que está en null todavía no lo han entregado:
// la pieza usa entonces su versión provisional (texto literal del guion o ícono plano de marca).
// Para usar el archivo real, se copia a public/jpr/... y se pone aquí la ruta.

// Clip de Juan Pablo a cámara (sin audio). null = el editor lo monta debajo del .mov transparente.
export const CLIP_PRESENTADOR: string | null = null;

// Símbolo JPR (va dentro del cuadro lima del Sello). Ej.: 'jpr/simbolo-jpr.png'
export const SIMBOLO_JPR: string | null = null;

// Logos de terceros, siempre del kit (nunca redibujados). Ej.: 'jpr/logos/oreo.png'
export const LOGOS: Record<'oreo' | 'cocacola' | 'omega' | 'snoop', string | null> = {
	oreo: null,
	cocacola: null,
	omega: null,
	snoop: null,
};

// Íconos 3D del kit. Ej.: 'jpr/iconos/megafono.png'
export const ICONOS_3D: Record<'megafono' | 'tienda' | 'union' | 'billetes', string | null> = {
	megafono: null,
	tienda: null,
	union: null,
	billetes: null,
};
