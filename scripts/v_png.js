const {chromium} = require('playwright');
const path = require('path');
const fuente = 'file://' + path.resolve('/home/user/motion/public/fuentes/dmserif-400.woff2');
const colores = {bermellon: '#F2381F', negro: '#111111', papel: '#EDEDEA', sombra: '#6E1A0F', blanco: '#FFFFFF'};
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({viewport: {width: 2400, height: 2400}});
  for (const [n, c] of Object.entries(colores)) {
    await p.setContent(`<style>@font-face{font-family:S;src:url(${fuente})}html,body{margin:0;background:transparent}
      #v{display:inline-block;font-family:S;font-size:2000px;line-height:1;color:${c};padding:0 60px}</style><span id="v">v</span>`);
    await p.evaluate(() => document.fonts.ready);
    await p.locator('#v').screenshot({path: `/home/user/motion/out/planv/v-png/planv-v-${n}.png`, omitBackground: true});
  }
  await b.close();
})();
