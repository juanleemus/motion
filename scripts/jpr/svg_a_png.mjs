// Pasa los logos SVG a PNG (fondo transparente, 600 px) para la carpeta 03-logos.
import {createRequire} from 'module';
import fs from 'fs'; import path from 'path';
const require = createRequire(import.meta.url);
const {chromium} = require(path.join(process.argv[4], 'playwright'));
const [dirIn, dirOut] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 600, height: 600}});
for (const f of fs.readdirSync(dirIn).filter(f => f.endsWith('.svg'))) {
  const svg = fs.readFileSync(path.join(dirIn, f), 'utf8').replace('<svg ', '<svg width="560" height="560" ');
  await p.setContent(`<html><body style="margin:0;background:transparent;display:flex;align-items:center;justify-content:center;width:600px;height:600px">${svg}</body></html>`);
  await p.screenshot({path: path.join(dirOut, f.replace('.svg', '.png')), omitBackground: true});
  fs.copyFileSync(path.join(dirIn, f), path.join(dirOut, f));
}
await b.close();
