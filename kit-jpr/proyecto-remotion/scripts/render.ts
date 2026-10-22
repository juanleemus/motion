// Render de un reel con UN solo comando, usando todos los núcleos del computador.
//   npm run reel -- <nombre>     → lee ../04-reels/<nombre>/escenas.json
//   npm run demo                  → lee demo/escenas.json
// Entrega en out/<nombre>/: <nombre>-motion.mp4 (con efectos), <nombre>-motion-mudo.mp4,
// <nombre>-efectos.wav y <nombre>-hoja-de-montaje.txt. Hojas de fotogramas para revisar en revision/<nombre>/.
// Nunca: subtítulos, capas transparentes ni el video de Juan Pablo.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {formato, planificar, Plan, ReelJson, resumenTramos} from '../src/jpr/plan';
import {navegadorLocal} from './navegador.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kit = path.resolve(raiz, '..');
const nombre = process.argv[2];
const sinHojas = process.argv.includes('--sin-hojas');
if (!nombre) {
  console.error('Uso: npm run reel -- <nombre>   (o npm run demo)');
  process.exit(1);
}
const esDemo = nombre === 'demo';
const carpetaReel = esDemo ? path.join(raiz, 'demo') : path.join(kit, '04-reels', nombre);
const archivo = path.join(carpetaReel, 'escenas.json');
if (!fs.existsSync(archivo)) {
  console.error(`No encuentro ${path.relative(kit, archivo)}`);
  process.exit(1);
}
const corre = (cmd: string, args: string[]) => execFileSync(cmd, args, {stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28}).toString();
const paso = (t: string) => console.log(`\n▸ ${t}`);

// 1. Material del kit a public/
paso('Preparando fondo, fuentes, logos y capturas');
corre('node', [path.join(raiz, 'scripts', 'preparar.mjs')]);

const reel: ReelJson = JSON.parse(fs.readFileSync(archivo, 'utf8'));
reel.nombre = nombre; // la carpeta manda

// 2. Logos: si falta alguno, se busca (Wikimedia → simple-icons) y se guarda en 03-logos/
const logos = new Set<string>();
for (const e of reel.escenas) {
  const d = e.datos ?? {};
  if (e.pieza === 'TarjetaLogo') (d.logos ?? []).forEach((l: any) => logos.add(typeof l === 'string' ? l : l.logo));
  if (e.pieza === 'IconoApp' && d.logo) logos.add(d.logo);
  if (e.pieza === 'Captura' && d.icono) logos.add(typeof d.icono === 'string' ? d.icono : d.icono.logo);
  if (e.pieza === 'Nodos') [d.centro, ...(d.nodos ?? [])].forEach((n: any) => n?.logo && logos.add(n.logo));
}
const faltan: string[] = [];
for (const l of logos) {
  if (fs.existsSync(path.join(kit, '03-logos', `${l}.png`))) continue;
  console.log(`  Falta el logo "${l}": lo busco…`);
  try {
    console.log(corre('node', [path.join(raiz, 'scripts', 'logo.mjs'), l]).trim());
  } catch {
    faltan.push(l);
  }
}
if (faltan.length) {
  console.error(`\nNo pude conseguir estos logos: ${faltan.join(', ')}. Súbelos a 03-logos/ como <nombre>.png y vuelve a correr.`);
  process.exit(1);
}
corre('node', [path.join(raiz, 'scripts', 'preparar.mjs')]);

// 3. Capturas: se mide su proporción para que el recuadro y el marcador caigan en su sitio
for (const e of reel.escenas) {
  if (e.pieza !== 'Captura' || !e.datos?.imagen) continue;
  const img = path.join(raiz, 'public', 'reels', nombre, e.datos.imagen);
  if (!fs.existsSync(img)) {
    console.error(`No encuentro la captura ${e.datos.imagen} en ${path.relative(kit, carpetaReel)}/`);
    process.exit(1);
  }
  if (!e.datos.aspecto) {
    const [w, h] = corre('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', img]).trim().split(',').map(Number);
    e.datos.aspecto = w / h;
  }
}

// 4. Plan y avisos de estilo
const plan: Plan = planificar(reel);
const seg = (f: number) => (f / plan.fps).toFixed(2).replace('.', ',');
paso(`Plan: ${plan.escenas.length} escenas · ${plan.fps} fps · ${plan.total} fotogramas (${seg(plan.total)} s)`);
if (plan.avisos.length) plan.avisos.forEach((a) => console.log(`  ⚠ ${a}`));
else console.log('  Sin avisos de estilo');

const out = path.join(raiz, 'out', nombre);
const trabajo = path.join(raiz, '.trabajo', nombre);
fs.mkdirSync(out, {recursive: true});
fs.mkdirSync(trabajo, {recursive: true});
fs.writeFileSync(path.join(trabajo, 'plan.json'), JSON.stringify(plan, null, 1));
const base = (s: string) => path.join(out, `${nombre}-${s}`);
const archivoMotion = esDemo ? path.join(out, 'demo.mp4') : base('motion.mp4');
const archivoMudo = base('motion-mudo.mp4');
const archivoEfectos = base('efectos.wav');
const archivoHoja = base('hoja-de-montaje.txt');
const archivoMusica = base('musica.wav');

// 5. Video mudo (H.264 normal, sin transparencia)
const nucleos = os.cpus().length;
paso(`Renderizando el motion con ${nucleos} núcleos`);
const navegador = navegadorLocal();
const bundleUrl = await bundle({entryPoint: path.join(raiz, 'src', 'index.ts'), publicDir: path.join(raiz, 'public')});
const inputProps = {reel};
const comp = await selectComposition({serveUrl: bundleUrl, id: 'Reel', inputProps, browserExecutable: navegador});
let ultimo = -1;
await renderMedia({
  serveUrl: bundleUrl,
  composition: comp,
  inputProps,
  codec: 'h264',
  crf: 18,
  pixelFormat: 'yuv420p',
  colorSpace: 'bt709',
  imageFormat: 'jpeg',
  jpegQuality: 95,
  muted: true,
  concurrency: nucleos,
  browserExecutable: navegador,
  outputLocation: archivoMudo,
  onProgress: ({progress}) => {
    const p = Math.floor(progress * 10);
    if (p !== ultimo) {
      ultimo = p;
      process.stdout.write(` ${p * 10}%`);
    }
  },
});
console.log('');

// 6. Efectos (ffmpeg): cada sonido en el fotograma de su animación
paso(`Mezclando ${plan.sonidos.length} efectos`);
const dur = plan.total / plan.fps;
const sonidos = plan.sonidos.filter((s) => s.frame < plan.total);
const args = ['-y', '-v', 'error', '-f', 'lavfi', '-t', dur.toFixed(6), '-i', 'anullsrc=r=48000:cl=stereo'];
const filtros: string[] = [];
sonidos.forEach((s, i) => {
  args.push('-i', path.join(raiz, 'public', 'sfx', `${s.tipo}.wav`));
  const ms = Math.round((s.frame / plan.fps) * 1000);
  filtros.push(`[${i + 1}:a]volume=${s.ganancia.toFixed(2)},adelay=${ms}|${ms}[s${i}]`);
});
filtros.push(`[0:a]${sonidos.map((_, i) => `[s${i}]`).join('')}amix=inputs=${sonidos.length + 1}:normalize=0:dropout_transition=0,atrim=0:${dur.toFixed(6)}[mezcla]`);
args.push('-filter_complex', filtros.join(';'), '-map', '[mezcla]', '-ar', '48000', '-c:a', 'pcm_s16le', archivoEfectos);
corre('ffmpeg', args);
const medida = (() => {
  // ffmpeg escribe la medición por stderr
  const r = execFileSync('sh', ['-c', `ffmpeg -hide_banner -nostats -i "${archivoEfectos}" -af ebur128=peak=true -f null - 2>&1 | tail -12`]).toString();
  const lufs = r.match(/I:\s+(-?[\d.]+) LUFS/)?.[1];
  const pico = r.match(/Peak:\s+(-?[\d.]+) dBFS/)?.[1];
  return {lufs, pico};
})();
console.log(`  Efectos: ${medida.lufs} LUFS integrados · pico ${medida.pico} dBFS`);

// 7. Música (si el reel la pide en escenas.json → "musica"), generada con código y atada a los mismos tiempos
let audioFinal = archivoEfectos;
let notaMusica = 'sin música';
if (plan.musica) {
  paso('Generando la música');
  const r = corre('python3', [path.join(raiz, 'scripts', 'musica.py'), path.join(trabajo, 'plan.json'), archivoMusica]).trim();
  console.log(`  ${r}`);
  notaMusica = r.replace(/^Música: /, 'música ');
  audioFinal = path.join(trabajo, 'musica-y-efectos.wav');
  corre('ffmpeg', ['-y', '-v', 'error', '-i', archivoMusica, '-i', archivoEfectos, '-filter_complex', `[0:a][1:a]amix=inputs=2:normalize=0,alimiter=limit=0.89,atrim=0:${dur.toFixed(6)}[a]`, '-map', '[a]', '-ar', '48000', '-c:a', 'pcm_s16le', audioFinal]);
}

// 8. Motion con sonido (mismo video, sin recomprimir)
paso(plan.musica ? 'Uniendo video, música y efectos' : 'Uniendo video y efectos');
corre('ffmpeg', ['-y', '-v', 'error', '-i', archivoMudo, '-i', audioFinal, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', dur.toFixed(6), '-movflags', '+faststart', archivoMotion]);

// 8. Hoja de montaje para el editor
const queHace: Record<string, string> = {
  mitad: 'Recorta el motion a la mitad de arriba (hasta y = 960) y pon a Juan Pablo en la mitad de abajo.',
  completa: 'Deja el motion en pantalla completa (Juan Pablo no se ve).',
  'a-camara': 'Borra el motion: Juan Pablo a pantalla completa.',
};
const nombreTramo = {mitad: 'MITAD', completa: 'COMPLETA', 'a-camara': 'A CÁMARA'} as const;
const filas: string[] = [];
let cursor = 0;
const fila = (desde: number, hasta: number, tramo: keyof typeof nombreTramo, detalle: string) =>
  filas.push(`${formato(desde, plan.fps)} → ${formato(hasta, plan.fps)}  (${seg(hasta - desde)} s)  ${nombreTramo[tramo].padEnd(9)} ${queHace[tramo]}${detalle ? `\n    ${detalle}` : ''}`);
for (const e of plan.escenas) {
  if (e.desde > cursor) fila(cursor, e.desde, 'a-camara', 'fondo limpio');
  const det = [e.pieza && `pieza: ${e.pieza}`, e.texto && `texto: "${e.texto.replace(/[*[\]{}]/g, '')}"`, e.destello && 'con destello', e.nota].filter(Boolean).join(' · ');
  fila(e.desde, e.hasta, e.tramo, det);
  cursor = e.hasta;
}
if (cursor < plan.total) fila(cursor, plan.total, 'a-camara', 'fondo limpio');
const r = resumenTramos(plan);
const pct = (f: number) => `${Math.round((f / plan.total) * 100)} %`;
fs.writeFileSync(
  archivoHoja,
  [
    `HOJA DE MONTAJE · ${nombre}`,
    `Motion: ${path.basename(archivoMotion)} · 1080×1920 · ${plan.fps} fps · ${formato(plan.total, plan.fps)} (${seg(plan.total)} s) · empieza en 00:00:00`,
    `Tiempos en mm:ss:ff (ff = fotograma). Ponlo encima del video de Juan Pablo desde 00:00.`,
    `Tramos: mitad ${pct(r.mitad)} · completa ${pct(r.completa)} · a cámara ${pct(r['a-camara'])}`,
    `Efectos: ${medida.lufs} LUFS (objetivo −24) · pico ${medida.pico} dBFS · ${notaMusica}`,
    plan.musica ? `Versiones: ${path.basename(archivoMotion)} (música + efectos) · ${path.basename(archivoMudo)} (sin sonido) · ${path.basename(archivoMusica)} y ${path.basename(archivoEfectos)} por separado para CapCut` : '',
    '',
    ...filas,
    '',
  ].join('\n'),
);

// 9. Comprobación del archivo final
const info = corre('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-count_packets', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,pix_fmt,nb_read_packets', '-of', 'default=nw=1', archivoMotion]);
paso('Comprobación del motion');
console.log(info.trim().split('\n').map((l) => `  ${l}`).join('\n'));
const frames = Number(info.match(/nb_read_packets=(\d+)/)?.[1]);
console.log(frames === plan.total ? `  ✔ ${frames} fotogramas, igual que el reel` : `  ✖ tiene ${frames} fotogramas y el reel ${plan.total}`);

// 10. Hojas de fotogramas para revisar
if (!sinHojas) {
  paso('Hojas de fotogramas');
  const rev = path.join(raiz, 'revision', nombre);
  console.log(corre('python3', [path.join(raiz, 'scripts', 'hoja.py'), path.join(trabajo, 'plan.json'), archivoMudo, rev]).trim());
}

paso('Listo');
for (const f of [archivoMotion, archivoMudo, archivoEfectos, ...(plan.musica ? [archivoMusica] : []), archivoHoja]) console.log(`  ${path.relative(kit, f)}`);
