// Renderiza fotogramas sueltos de las capas (PNG con transparencia) para las hojas de revisión.
// Uso: node scripts/fotos.mjs carpeta-salida reel f1 f2 f3 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'path'; import fs from 'fs';
const browserExecutable = process.env.REMOTION_BROWSER || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const [dir, reel, ...frames] = process.argv.slice(2);
fs.mkdirSync(dir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
for (const capa of ['motion', 'subtitulos']) {
  const composition = await selectComposition({serveUrl, id: `${reel}-${capa}`, browserExecutable});
  for (const f of frames) {
    await renderStill({composition, serveUrl, frame: Number(f), output: path.join(dir, `${capa}-${f}.png`), imageFormat: 'png', browserExecutable});
  }
}
console.log('listo', frames.length, 'fotogramas');
