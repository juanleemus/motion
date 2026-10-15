// Bloques de subtítulo y su revisión (sin React, para poder usarlos desde los scripts).
export type Bloque = {
	f: number; // fotograma de entrada: en('frase', n)
	t: string; // [palabra] = entrada en color · {palabra} = énfasis lima fijo
	cursiva?: {t: string; f: number}; // segunda voz (remate o continuación), debajo
	cta?: boolean; // llamado a la acción
};

const MAX_CARACTERES = 18;
export const textoPlano = (t: string) => t.replace(/[[\]{}]/g, '');

// Ningún bloque pasa de 3 palabras ni de 18 caracteres por línea.
export const revisarBloques = (bloques: Bloque[]) => {
	const malos: string[] = [];
	for (const b of bloques) {
		for (const t of [b.t, b.cursiva?.t].filter(Boolean) as string[]) {
			const largo = textoPlano(t).length;
			const palabras = textoPlano(t).split(/\s+/).filter(Boolean).length;
			if (largo > MAX_CARACTERES || palabras > 3) malos.push(`"${textoPlano(t)}" (${largo} car., ${palabras} pal.)`);
		}
	}
	return malos;
};
