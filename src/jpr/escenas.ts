// Plan aprobado: cortes de plano, bloques de subtítulo y acercamientos, cada uno atado a su palabra.
// Marcas: [palabra] = entrada en color · {palabra} = énfasis lima fijo · cursiva = segunda voz.
import {DURACION, en} from './tiempos.ts';
import type {Bloque} from './bloques.ts';
export type TipoPlano = 'A' | 'S' | 'B';
export type TipoFondo = 'claro' | 'oscuro';

export type Escena = {
	id: string;
	plano: TipoPlano;
	fondo?: TipoFondo;
	desde: number;
	bloques: Bloque[];
	zooms?: [number, number][]; // acercamiento de golpe del 12 %: [entra, sale]
};

const b = (f: number, t: string, cursiva?: [string, number]): Bloque => ({f, t, cursiva: cursiva && {t: cursiva[0], f: cursiva[1]}});

const lista: Omit<Escena, 'hasta'>[] = [
	{
		id: 'gancho',
		plano: 'S',
		fondo: 'oscuro',
		desde: 0,
		bloques: [b(0, 'Las marcas'), b(en('más grandes'), 'más [grandes]'), b(en('del mundo'), 'del mundo'), b(en('acaban'), 'acaban de'), b(en('darse cuenta'), 'darse cuenta')],
	},
	{
		id: 'competir',
		plano: 'A',
		desde: en('que competir'),
		bloques: [
			b(en('que competir'), 'que [competir]'),
			b(en('no es una'), 'no es'),
			b(en('una opción'), 'una opción,'),
			b(en('y además'), 'y además'),
			b(en('que esto'), 'que esto'),
			b(en('les está'), 'les está'),
			b(en('saliendo'), 'saliendo'),
			b(en('muy caro'), '{muy caro.}'),
		],
		zooms: [
			[en('que competir'), en('no es una')],
			[en('muy caro'), en('Ahora')],
		],
	},
	{
		id: 'sobrevivir',
		plano: 'B',
		fondo: 'oscuro',
		desde: en('Ahora'),
		bloques: [
			b(en('Ahora'), 'Ahora,'),
			b(en('esto es lo'), 'esto es'),
			b(en('lo que van'), 'lo que van'),
			b(en('a hacer para'), 'a hacer', ['para sobrevivir', en('para sobrevivir')]),
			b(en('en el mercado'), 'en el mercado:'),
		],
	},
	{
		id: 'alianzas',
		plano: 'S',
		fondo: 'claro',
		desde: en('Oreo'),
		bloques: [
			b(en('Oreo'), 'Oreo con'),
			b(en('Coca-Cola'), 'Coca-Cola,'),
			b(en('u Omega'), 'u Omega'),
			b(en('con Snoop'), 'con Snoop,', ['no es casualidad.', en('no es casualidad')]),
		],
	},
	{
		id: 'costo',
		plano: 'A',
		desde: en('El costo'),
		bloques: [
			b(en('El costo'), 'El [costo]'),
			b(en('de adquirir'), 'de adquirir'),
			b(en('un nuevo'), 'un nuevo'),
			b(en('cliente'), 'cliente'),
			b(en('está por'), 'está por'),
			b(en('las nubes'), 'las [nubes],'),
		],
		zooms: [[en('las nubes'), en('en vez de', 1)]],
	},
	{
		id: 'anuncios',
		plano: 'B',
		fondo: 'claro',
		desde: en('en vez de', 1),
		bloques: [
			b(en('en vez de', 1), 'en vez de'),
			b(en('pagarle'), 'pagarle más'),
			b(en('a las plataformas'), 'a las'),
			b(en('plataformas'), '[plataformas]'),
			b(en('de anuncios'), 'de anuncios,'),
		],
	},
	{
		id: 'intercambiar',
		plano: 'A',
		desde: en('las marcas empezaron'),
		bloques: [
			b(en('las marcas empezaron'), 'las marcas'),
			b(en('empezaron'), 'empezaron a'),
			b(en('intercambiar'), '{intercambiar}'),
			b(en('audiencia', 1), '{audiencia.}'),
		],
		zooms: [[en('intercambiar'), en('audiencia', 1)]],
	},
	{
		id: 'solo',
		plano: 'S',
		fondo: 'claro',
		desde: en('Así que'),
		bloques: [
			b(en('Así que'), 'Así que'),
			b(en('si tu negocio'), 'si tu negocio'),
			b(en('está buscando'), 'está buscando'),
			b(en('crecer solo'), 'crecer [solo],'),
			b(en('no es que'), 'no es que'),
		],
	},
	{
		id: 'vecino',
		plano: 'A',
		desde: en('estés perdiendo'),
		bloques: [
			b(en('estés perdiendo'), 'estés perdiendo'),
			b(en('plata'), 'plata,'),
			b(en('pero podrías'), 'pero podrías'),
			b(en('ganar más'), '[ganar más]'),
			b(en('con la audiencia'), 'con la'),
			b(en('audiencia', 2), 'audiencia', ['de tu vecino.', en('de tu vecino')]),
		],
		zooms: [[en('ganar más'), en('con la audiencia')]],
	},
	{
		id: 'afin',
		plano: 'B',
		fondo: 'oscuro',
		desde: en('Puedes buscar'),
		bloques: [
			b(en('Puedes buscar'), 'Puedes buscar'),
			b(en('una marca que sea'), 'una marca'),
			b(en('que sea afín'), 'que sea'),
			b(en('afín'), '[afín]'),
			b(en('a la tuya'), 'a la tuya'),
		],
	},
	{
		id: 'cobranding',
		plano: 'S',
		fondo: 'claro',
		desde: en('o con la que'),
		bloques: [b(en('o con la que'), 'o con la'), b(en('que puedas'), 'que puedas'), b(en('hacer un'), 'hacer un'), b(en('cobranding'), '[cobranding],')],
	},
	{
		id: 'colaboren',
		plano: 'A',
		desde: en('en vez de', 2),
		bloques: [
			b(en('en vez de', 2), 'en vez de'),
			b(en('competir', 2), 'competir,'),
			b(en('colaboren'), '{colaboren,}'),
			b(en('puede ser'), 'puede ser'),
			b(en('mucho más'), 'mucho más', ['eficiente,', en('eficiente')]),
		],
		zooms: [[en('colaboren'), en('puede ser')]],
	},
	{
		id: 'ganando',
		plano: 'B',
		fondo: 'claro',
		desde: en('ambos'),
		bloques: [
			b(en('ambos'), 'ambos'),
			b(en('salen ganando'), 'salen [ganando],'),
			b(en('las audiencias'), 'las audiencias'),
			b(en('del otro'), 'del otro'),
			b(en('se llevan'), 'se llevan', ['un buen producto', en('un buen producto')]),
		],
	},
	{
		id: 'estrategia',
		plano: 'A',
		desde: en('y tener'),
		bloques: [b(en('y tener'), 'y tener'), b(en('una buena'), 'una buena'), b(en('estrategia'), '[estrategia]'), b(en('de marketing', 1), 'de marketing')],
	},
	{
		id: 'pauta',
		plano: 'S',
		fondo: 'claro',
		desde: en('que no te'),
		bloques: [
			b(en('que no te'), 'que no te'),
			b(en('puede costar'), 'puede costar'),
			b(en('más que lo'), 'más que'),
			b(en('lo que gastas'), 'lo que gastas'),
			b(en('en pauta'), 'en {pauta.}'),
		],
	},
	{
		id: 'cierre',
		plano: 'A',
		desde: en('Si quieres'),
		bloques: [
			b(en('Si quieres'), 'Si quieres'),
			b(en('más consejos'), 'más consejos'),
			b(en('de marketing', 2), 'de marketing,'),
			{f: en('sígueme'), t: 'SÍGUEME', cta: true},
		],
	},
];

export const ESCENAS: (Escena & {hasta: number})[] = lista.map((e, i) => ({...e, hasta: lista[i + 1]?.desde ?? DURACION}));
export const escena = (id: string) => {
	const e = ESCENAS.find((x) => x.id === id);
	if (!e) throw new Error(`No existe la escena ${id}`);
	return e;
};
