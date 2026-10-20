// Busca un logo que no esté en 03-logos/ y lo guarda ahí como PNG transparente para la próxima vez.
// Orden: 1) Wikimedia Commons  2) paquete simple-icons de npm (sin internet extra).
// Uso: node scripts/logo.mjs <nombre>   (ej. canva, notion-texto)
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Resvg} from '@resvg/resvg-js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destino = path.resolve(raiz, '..', '03-logos');
const nombre = process.argv[2];
if (!nombre) {
  console.error('Uso: node scripts/logo.mjs <nombre>');
  process.exit(1);
}
const archivo = path.join(destino, `${nombre}.png`);
const limpio = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
const aPng = (svg) => new Resvg(svg, {fitTo: {mode: 'width', value: 512}, background: 'rgba(0,0,0,0)'}).render().asPng();

const wikimedia = async () => {
  const busca = `${nombre.replace(/-/g, ' ')} logo`;
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch=${encodeURIComponent(busca + ' filetype:svg')}&prop=imageinfo&iiprop=url&iiurlwidth=512`;
  const r = await fetch(api, {headers: {'User-Agent': 'kit-jpr/1.0'}, signal: AbortSignal.timeout(10000)});
  if (!r.ok) throw new Error(`Wikimedia respondió ${r.status}`);
  const paginas = Object.values((await r.json()).query?.pages ?? {});
  const p = paginas.find((x) => limpio(x.title).includes(limpio(nombre))) ?? paginas[0];
  const url = p?.imageinfo?.[0]?.thumburl;
  if (!url) throw new Error('sin resultados');
  const img = await fetch(url, {headers: {'User-Agent': 'kit-jpr/1.0'}, signal: AbortSignal.timeout(10000)});
  if (!img.ok) throw new Error(`descarga ${img.status}`);
  fs.writeFileSync(archivo, Buffer.from(await img.arrayBuffer()));
  return `Wikimedia Commons (${p.title})`;
};

const simpleIcons = async () => {
  const si = await import('simple-icons');
  const buscado = limpio(nombre.replace(/-texto$/, ''));
  const icono = Object.values(si).find((i) => i && typeof i === 'object' && 'svg' in i && (limpio(i.title) === buscado || i.slug === buscado));
  if (!icono) throw new Error('no está en simple-icons');
  const svg = icono.svg.replace('<svg ', `<svg fill="#${icono.hex}" `);
  fs.writeFileSync(archivo, aPng(svg));
  return `simple-icons (${icono.title}, CC0)`;
};

for (const [fuente, fn] of [['Wikimedia', wikimedia], ['simple-icons', simpleIcons]]) {
  try {
    const de = await fn();
    fs.appendFileSync(path.join(destino, 'LEEME.txt'), `\n  ${nombre} → ${nombre}.png (agregado desde ${de})`);
    console.log(`  Logo "${nombre}" guardado en 03-logos/${nombre}.png desde ${de}`);
    process.exit(0);
  } catch (e) {
    console.log(`  ${fuente}: ${e.message}`);
  }
}
console.error(`  No encontré "${nombre}". Súbelo a 03-logos/${nombre}.png`);
process.exit(1);
