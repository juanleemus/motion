// Reel "contenido5-jpr": Meta bloquea la pauta que manda tráfico a TikTok.
// Todos los tiempos salen de las palabras (palabras.ts); si cambia el audio, se regenera ese archivo y todo se resincroniza.
import {PALABRAS} from './palabras';

export const NOMBRE = 'contenido5-jpr';
export const FPS = 25;
export const DURACION = 1223; // 48,92 s, igual al video base
export const s2f = (s: number) => Math.round(s * FPS);
export const w = (i: number) => s2f(PALABRAS[i].t0);
export const wFin = (i: number) => s2f(PALABRAS[i].t1);

// ---------------------------------------------------------------- subtítulos
// [primera palabra, última palabra, palabra de acento, tipo de acento]
type Bloque = [number, number, number?, ('color' | 'lora')?];
const BLOQUES: Bloque[] = [
  [0, 2, 2, 'color'], [3, 4], [5, 6], [7, 9], [10, 11, 11, 'color'], [12, 13, 12, 'lora'],
  [14, 15], [16, 17], [18, 19], [20, 21, 20, 'color'], [22, 24, 24, 'lora'],
  [25, 26, 26, 'color'], [27, 28], [29, 30], [31, 32], [33, 35], [36, 37], [38, 40], [41, 42, 42, 'lora'],
  [43, 45, 45, 'color'], [46, 47, 47, 'lora'],
  [48, 50], [51, 52, 52, 'color'], [53, 54], [55, 57, 56, 'color'], [58, 58], [59, 59], [60, 61],
  [62, 64, 64, 'color'], [65, 67], [68, 69, 69, 'lora'],
  [70, 71, 71, 'color'], [72, 74], [75, 76, 76, 'lora'],
  [77, 78], [79, 80, 80, 'color'], [81, 82, 82, 'color'], [83, 85], [86, 87], [88, 89], [90, 92], [93, 94, 94, 'color'],
  [95, 97], [98, 100], [101, 102], [103, 105, 105, 'color'], [106, 107, 107, 'lora'],
  [108, 110], [111, 113, 111, 'color'], [114, 115], [116, 118], [119, 119], [120, 122], [123, 124, 124, 'color'], [125, 125, 125, 'lora'],
  [126, 127, 127, 'color'], [128, 129], [130, 132, 132, 'color'], [133, 134], [135, 136, 136, 'lora'],
];

// Se escriben con mayúscula: marcas, personas y países. Todo lo demás en minúscula y sin puntuación.
const PROPIOS = new Set(['Facebook', 'Instagram', 'Meta', 'TikTok', 'ByteDance', 'Estados', 'Unidos']);
export const limpia = (p: string) => {
  const s = p.replace(/[.,:;!?¿¡…"]/g, '');
  return PROPIOS.has(s) ? s : s.toLowerCase();
};

export type SubBloque = {desde: number; hasta: number; palabras: {texto: string; acento?: 'color' | 'lora'}[]; texto: string};
export const SUBTITULOS: SubBloque[] = BLOQUES.map(([a, b, ac, tipo], k) => {
  const palabras = [];
  for (let i = a; i <= b; i++) palabras.push({texto: limpia(PALABRAS[i].w), acento: i === ac ? tipo : undefined});
  const sig = BLOQUES[k + 1];
  // se cambia en seco por el siguiente; en silencios de más de 0,6 s no hay subtítulo
  const finVoz = PALABRAS[b].t1;
  const hasta = !sig ? DURACION : PALABRAS[sig[0]].t0 - finVoz > 0.6 ? s2f(finVoz + 0.12) : w(sig[0]);
  return {desde: w(a), hasta, palabras, texto: palabras.map((p) => p.texto).join(' ')};
});

// ---------------------------------------------------------------- escenas
export type Formato = 'A' | 'B' | 'C' | 'D';
export type Escena = {id: string; formato: Formato; desde: number; hasta: number; frase: string; animacion: string; recurso: string};

// Momentos clave (fotogramas). Las escenas y los efectos de sonido usan estos mismos valores.
export const K = {
  // B1: Facebook / Instagram → revisar campañas hoy
  b1: w(4) - 9, logoFb: w(4), o: w(5), logoIg: w(6), chipRevisar: w(9), chipHoy: w(12),
  // C1: Meta empieza a bloquear cuentas
  destello1: w(14) - 3, c1: w(14), logoMeta1: w(15), chipBloquear: w(20), chipAviso: w(22), c1Fin: w(25),
  // B2: el puente Meta → TikTok se cerró
  b2: w(28) - 9, logoMeta2: w(28), lineaPuente: w(29), logoTiktok1: w(37), chipTodos: w(39), puente: w(45), cerro: w(47),
  // C2: Meta vs ByteDance, 7 mercados, Estados Unidos
  destello2: w(48) - 7, c2: w(48) - 4, logoMeta3: w(48), guerra: w(52), logoByte: w(54), cifra7: w(56), mercados: w(57), chipEEUU: w(60), c2Fin: w(62),
  // B3: la prohibición no es solo para ellos: marcas y creadores
  b3: w(71) - 9, prohibicion: w(71), ellos: w(76), chipMarca: w(80), chipCreador: w(82), b3Fin: w(83) + 4,
  // C3: tu anuncio → TikTok, bloqueado
  c3: w(83) - 2, chipAnuncio: w(85), lineaTrafico: w(86), logoTiktok2: w(89), bloqueo: w(94), c3Fin: w(95),
  destello3: w(95) - 3,
  // B4: alimentar a la competencia se acabó
  b4: w(100) - 9, logoMeta4: w(100), barra: w(102), barraLlena: w(107), b4Fin: w(108) + 2,
  // B5: media buyer, agencia, cambien los enlaces hoy
  b5: w(114) - 9, chipBuyer: w(114), chipAgencia: w(119), chipEnlaces: w(122), b5Fin: w(126) - 4,
  // Cierre: CTA "sígueme" y firma JPR
  cta: w(127), firma: DURACION - 25,
};
export const ESCRIBE_ENLACES = 16; // fotogramas que tarda en escribirse "cambien los enlaces hoy"
export const TEXTO_ENLACES = 'cambien los enlaces hoy';

const seg = (f: number) => f / FPS;
const frase = (a: number, b: number) => PALABRAS.slice(a, b + 1).map((p) => p.w).join(' ');

export const ESCENAS: Escena[] = [
  {id: 'A1', formato: 'A', desde: 0, hasta: K.b1, frase: frase(0, 2), animacion: 'Gancho a cámara: subtítulo grande, "anuncios" en lima', recurso: '—'},
  {id: 'B1', formato: 'B', desde: K.b1, hasta: K.c1, frase: frase(3, 13), animacion: 'Split con whoosh; logos de Facebook e Instagram en su palabra; chips "revisar tus campañas" y "hoy mismo"', recurso: 'logos facebook, instagram'},
  {id: 'C1', formato: 'C', desde: K.c1, hasta: K.c1Fin, frase: frase(14, 24), animacion: 'Destello; logo de Meta grande; chips con candado "bloquear cuentas" y alerta "sin previo aviso"', recurso: 'logo meta'},
  {id: 'A2', formato: 'A', desde: K.c1Fin, hasta: K.b2, frase: frase(25, 27), animacion: 'A cámara; "pauta" en lima', recurso: '—'},
  {id: 'B2', formato: 'B', desde: K.b2, hasta: K.c2, frase: frase(28, 47), animacion: 'Diagrama: Meta → línea que se dibuja → TikTok; chip "la estrategia de todos"; la línea se pone lima en "puente" y se rompe en "cerró"', recurso: 'logos meta, tiktok'},
  {id: 'C2', formato: 'C', desde: K.c2, hasta: K.c2Fin, frase: frase(48, 61), animacion: 'Destello; Meta vs ByteDance con "guerra" gigante y marcador; cifra 7 que cuenta + "mercados clave"; chip "Estados Unidos"', recurso: 'logos meta, bytedance'},
  {id: 'A3', formato: 'A', desde: K.c2Fin, hasta: K.b3, frase: frase(62, 70), animacion: 'A cámara; "problema" en lima y "reportes" en Lora Italic', recurso: '—'},
  {id: 'B3', formato: 'B', desde: K.b3, hasta: K.b3Fin, frase: frase(71, 82), animacion: '"prohibición" con marcador lima; ByteDance en gris ("ellos"); chips "marca" y "creador"', recurso: 'logo bytedance'},
  {id: 'C3', formato: 'C', desde: K.c3, hasta: K.c3Fin, frase: frase(83, 94), animacion: 'Chip "tu anuncio" → línea de tráfico → TikTok; en "bloquear" la línea se corta y sale el ícono de bloqueo', recurso: 'logo tiktok'},
  {id: 'A4', formato: 'A', desde: K.c3Fin, hasta: K.b4, frase: frase(95, 99), animacion: 'Destello; a cámara', recurso: '—'},
  {id: 'B4', formato: 'B', desde: K.b4, hasta: K.b4Fin, frase: frase(100, 107), animacion: 'Logo de Meta; barra "alimentar a su competencia" que se llena y cambia a lima con alerta en "acabó"', recurso: 'logo meta'},
  {id: 'A5', formato: 'A', desde: K.b4Fin, hasta: K.b5, frase: frase(108, 113), animacion: 'A cámara; "urgente" en lima', recurso: '—'},
  {id: 'B5', formato: 'B', desde: K.b5, hasta: K.b5Fin, frase: frase(114, 125), animacion: 'Chips apilados "media buyer", "agencia" y "cambien los enlaces hoy" (se escribe solo, "hoy" en lima)', recurso: '—'},
  {id: 'A6', formato: 'A', desde: K.b5Fin, hasta: K.firma, frase: frase(126, 134), animacion: 'CTA: pastilla lima "SÍGUEME" con clic; "crisis" en lima', recurso: '—'},
  {id: 'C4', formato: 'C', desde: K.firma, hasta: DURACION, frase: frase(135, 136), animacion: 'Firma JPR con raya lima que se dibuja', recurso: '—'},
];

// Formato visible en un fotograma (para ubicar y colorear los subtítulos).
export const formatoEn = (f: number): Formato => {
  if (f >= K.c3 && f < K.c3Fin) return 'C';
  const e = ESCENAS.find((x) => f >= x.desde && f < x.hasta);
  return e ? e.formato : 'A';
};
export const posicionSub = (f: number) => {
  const fm = formatoEn(f);
  return fm === 'B' ? {y: 1040, superficie: 'video' as const} : fm === 'A' ? {y: 1180, superficie: 'video' as const} : {y: 1400, superficie: 'blanco' as const};
};

// ---------------------------------------------------------------- efectos de sonido (atados a cada animación)
export type Efecto = {t: number; tipo: 'whoosh' | 'pop' | 'tic' | 'clic' | 'tecleo' | 'trazo' | 'destello'; dur?: number; tono?: number};
export const EFECTOS: Efecto[] = [
  {t: seg(K.b1), tipo: 'whoosh'}, {t: seg(K.logoFb), tipo: 'pop'}, {t: seg(K.logoIg), tipo: 'pop', tono: 1.08},
  {t: seg(K.chipRevisar), tipo: 'pop', tono: 0.9}, {t: seg(K.chipHoy), tipo: 'pop', tono: 0.95},
  {t: seg(K.destello1), tipo: 'destello'}, {t: seg(K.logoMeta1), tipo: 'pop'},
  {t: seg(K.chipBloquear), tipo: 'pop', tono: 0.9}, {t: seg(K.chipAviso), tipo: 'pop', tono: 0.95},
  {t: seg(K.b2), tipo: 'whoosh'}, {t: seg(K.logoMeta2), tipo: 'pop'},
  {t: seg(K.lineaPuente), tipo: 'trazo', dur: seg(K.logoTiktok1 - K.lineaPuente)}, {t: seg(K.logoTiktok1), tipo: 'pop', tono: 1.08},
  {t: seg(K.chipTodos), tipo: 'pop', tono: 0.9}, {t: seg(K.puente), tipo: 'trazo', dur: 0.3}, {t: seg(K.cerro), tipo: 'clic'},
  {t: seg(K.destello2), tipo: 'destello'}, {t: seg(K.logoMeta3), tipo: 'pop'}, {t: seg(K.guerra), tipo: 'trazo', dur: 0.32},
  {t: seg(K.logoByte), tipo: 'pop', tono: 1.08}, {t: seg(K.mercados), tipo: 'pop', tono: 0.85}, {t: seg(K.chipEEUU), tipo: 'pop', tono: 0.9},
  {t: seg(K.b3), tipo: 'whoosh'}, {t: seg(K.prohibicion), tipo: 'trazo', dur: 0.32}, {t: seg(K.ellos), tipo: 'pop', tono: 0.85},
  {t: seg(K.chipMarca), tipo: 'pop', tono: 0.9}, {t: seg(K.chipCreador), tipo: 'pop', tono: 0.95},
  {t: seg(K.c3), tipo: 'whoosh', tono: 0.8}, {t: seg(K.chipAnuncio), tipo: 'pop', tono: 0.9},
  {t: seg(K.lineaTrafico), tipo: 'trazo', dur: seg(K.logoTiktok2 - K.lineaTrafico)}, {t: seg(K.logoTiktok2), tipo: 'pop', tono: 1.08}, {t: seg(K.bloqueo), tipo: 'clic'},
  {t: seg(K.destello3), tipo: 'destello'},
  {t: seg(K.b4), tipo: 'whoosh'}, {t: seg(K.logoMeta4), tipo: 'pop'},
  {t: seg(K.barra), tipo: 'trazo', dur: seg(K.barraLlena - K.barra)}, {t: seg(K.barraLlena), tipo: 'pop', tono: 0.85},
  {t: seg(K.b5), tipo: 'whoosh'}, {t: seg(K.chipBuyer), tipo: 'pop', tono: 0.9}, {t: seg(K.chipAgencia), tipo: 'pop', tono: 0.95},
  {t: seg(K.chipEnlaces), tipo: 'pop', tono: 0.9}, {t: seg(K.chipEnlaces + 4), tipo: 'tecleo', dur: seg(ESCRIBE_ENLACES)},
  {t: seg(K.cta), tipo: 'pop'}, {t: seg(K.cta + 10), tipo: 'clic'},
  {t: seg(K.firma), tipo: 'whoosh', tono: 0.8}, {t: seg(K.firma + 6), tipo: 'trazo', dur: 0.4},
];
// Tics de la cifra que cuenta (uno por cada número que cambia).
export const TICS_CIFRA = {desde: K.cifra7, valor: 7};
