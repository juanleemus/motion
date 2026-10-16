// Copia al public/ de Remotion lo que vive en el kit (fondo, fuentes, logos y material de cada reel).
// Así todo se carga desde el computador, nunca desde internet. Se ejecuta solo antes de studio y render.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kit = path.resolve(raiz, '..');
const pub = path.join(raiz, 'public');

const copiar = (de, a) => {
  if (!fs.existsSync(de)) return;
  const st = fs.statSync(de);
  if (st.isDirectory()) {
    fs.mkdirSync(a, {recursive: true});
    for (const n of fs.readdirSync(de)) copiar(path.join(de, n), path.join(a, n));
    return;
  }
  if (fs.existsSync(a)) {
    const sa = fs.statSync(a);
    if (sa.size === st.size && sa.mtimeMs >= st.mtimeMs) return;
  }
  fs.mkdirSync(path.dirname(a), {recursive: true});
  fs.copyFileSync(de, a);
};
const soloImagenes = (de, a) => {
  if (!fs.existsSync(de)) return;
  for (const n of fs.readdirSync(de)) {
    const p = path.join(de, n);
    if (fs.statSync(p).isDirectory()) soloImagenes(p, path.join(a, n));
    else if (/\.(png|jpe?g|webp|svg)$/i.test(n)) copiar(p, path.join(a, n));
  }
};

copiar(path.join(kit, '01-fondo', 'fondo-x.jpg'), path.join(pub, 'kit', 'fondo-x.jpg'));
for (const n of fs.readdirSync(path.join(kit, 'fuentes')).filter((n) => n.endsWith('.ttf')))
  copiar(path.join(kit, 'fuentes', n), path.join(pub, 'kit', 'fuentes', n));
for (const n of fs.readdirSync(path.join(kit, '03-logos')).filter((n) => n.endsWith('.png')))
  copiar(path.join(kit, '03-logos', n), path.join(pub, 'kit', 'logos', n));
soloImagenes(path.join(raiz, 'demo'), path.join(pub, 'reels', 'demo'));
const reels = path.join(kit, '04-reels');
for (const n of fs.readdirSync(reels)) {
  const p = path.join(reels, n);
  if (fs.statSync(p).isDirectory()) soloImagenes(p, path.join(pub, 'reels', n));
}
console.log('Material del kit listo en public/');
