// Renderiza fotogramas sueltos con un solo empaquetado: node scripts/fotogramas.mjs carpeta f1 f2 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [carpeta, ...frames] = process.argv.slice(2);
fs.mkdirSync(carpeta, {recursive: true});
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: process.env.COMP ?? 'dia5-uber-escuela-invora', browserExecutable});
for (const f of frames.map(Number)) {
	await renderStill({serveUrl, composition, frame: f, output: path.join(carpeta, `f${String(f).padStart(4, '0')}.png`), browserExecutable, imageFormat: 'png'});
	process.stdout.write(f + ' ');
}
console.log();
