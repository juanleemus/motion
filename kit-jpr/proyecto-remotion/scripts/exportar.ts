// Exporta los datos del reel (escenas, subtítulos, efectos y formato de cada fotograma) a JSON
// para los scripts de sonido, SRT, hoja de montaje y revisión.
// Uso: npx tsx scripts/exportar.ts salida.json
import fs from 'fs';
import {cuentaCifra} from '../src/jpr/ui';
import {DURACION, EFECTOS, ESCENAS, FPS, formatoEn, K, NOMBRE, SUBTITULOS, TICS_CIFRA} from '../src/reels/contenido5/datos';

const tics: number[] = [];
let prev = 0;
for (let f = 0; f <= 20; f++) {
  const v = cuentaCifra(f, TICS_CIFRA.valor);
  if (v !== prev) tics.push((TICS_CIFRA.desde + f) / FPS);
  prev = v;
}
const formatos = Array.from({length: DURACION}, (_, f) => formatoEn(f)).join('');
fs.writeFileSync(process.argv[2], JSON.stringify({
  nombre: NOMBRE, fps: FPS, duracion: DURACION, K, escenas: ESCENAS,
  subtitulos: SUBTITULOS.map((s) => ({desde: s.desde, hasta: s.hasta, texto: s.texto})),
  efectos: [...EFECTOS, ...tics.map((t) => ({t, tipo: 'tic'}))], formatos,
}, null, 1));
console.log('exportado', ESCENAS.length, 'escenas,', SUBTITULOS.length, 'subtítulos,', EFECTOS.length + tics.length, 'efectos');
