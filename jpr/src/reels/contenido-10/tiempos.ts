// Tiempos del reel "contenido-10" (en segundos, sacados de la transcripción palabra por palabra).
// El audio dura 70,296 s → 2.109 fotogramas a 30 fps.
export const FPS = 30;
export const DURACION = 2109;
export const f = (s: number) => Math.round(s * FPS);

// Escenas: [inicio, fin) en segundos y su formato. Las frases del guion no se suben al repositorio.
export const ESCENAS = [
  {id: 'vacio', formato: 'A', desde: 0, hasta: 4.07},
  {id: 'amazon', formato: 'B', desde: 4.07, hasta: 8.6},
  {id: 'noticia', formato: 'D', desde: 8.6, hasta: 12.4},
  {id: 'cpc-baja', formato: 'C', desde: 12.4, hasta: 15.59},
  {id: 'optimizacion', formato: 'A', desde: 15.59, hasta: 18.88},
  {id: 'cuota', formato: 'B', desde: 18.88, hasta: 21.72},
  {id: 'no-era', formato: 'A', desde: 21.72, hasta: 24.14},
  {id: 'competencia', formato: 'C', desde: 24.14, hasta: 32.45},
  {id: 'gigantes', formato: 'C', desde: 32.45, hasta: 34.96},
  {id: 'trimestre', formato: 'C', desde: 34.96, hasta: 40.5},
  {id: 'microsoft', formato: 'C', desde: 40.5, hasta: 43.18},
  {id: 'no-depende', formato: 'A', desde: 43.18, hasta: 46.61},
  {id: 'quien-puja', formato: 'B', desde: 46.61, hasta: 48.74},
  {id: 'celebrar', formato: 'A', desde: 48.74, hasta: 51.75},
  {id: 'subastas', formato: 'D', desde: 51.75, hasta: 56.81},
  {id: 'al-lado', formato: 'B', desde: 56.81, hasta: 62.35},
  {id: 'guarda', formato: 'A', desde: 62.35, hasta: 65.56},
  {id: 'comparte', formato: 'A', desde: 65.56, hasta: 68.55},
  {id: 'sigueme', formato: 'B', desde: 68.55, hasta: 70.296},
] as const;

export const escena = (id: (typeof ESCENAS)[number]['id']) => {
  const e = ESCENAS.find((x) => x.id === id)!;
  const ini = f(e.desde);
  const fin = Math.min(DURACION, f(e.hasta));
  // `en(s)`: fotograma de una palabra, contado desde el inicio de la escena.
  return {ini, dur: fin - ini, en: (s: number) => f(s) - ini};
};
