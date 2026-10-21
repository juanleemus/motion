// Capa de gráficos SIN fondo (PNG con transparencia, cuadro por cuadro) para montar el video final con Juan Pablo.
// Es material de trabajo interno: no es un entregable (ESTILO.md §0).
//   npx tsx scripts/capa-graficos.ts <nombre> <carpeta-salida>
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderFrames, selectComposition} from '@remotion/renderer';
import {ReelJson} from '../src/jpr/plan';
import {navegadorLocal} from './navegador.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [nombre, salida] = process.argv.slice(2);
const reel: ReelJson = JSON.parse(fs.readFileSync(path.join(raiz, '..', '04-reels', nombre, 'escenas.json'), 'utf8'));
reel.nombre = nombre;
reel.sinFondo = true;
fs.mkdirSync(salida, {recursive: true});
const navegador = navegadorLocal();
const serveUrl = await bundle({entryPoint: path.join(raiz, 'src', 'index.ts'), publicDir: path.join(raiz, 'public')});
const inputProps = {reel};
const composition = await selectComposition({serveUrl, id: 'Reel', inputProps, browserExecutable: navegador});
await renderFrames({
  serveUrl, composition, inputProps, imageFormat: 'png', outputDir: salida,
  concurrency: os.cpus().length, browserExecutable: navegador,
  onStart: () => {}, onFrameUpdate: (n) => { if (n % 500 === 0) console.log(n); },
});
console.log('listo');
