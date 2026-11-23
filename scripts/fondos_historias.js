// Fondos para historias de Instagram (1080 x 1920) con la vibra de plan v: brillo difuso y grano.
// Uso: node scripts/fondos_historias.js  → out/planv/fondos-historias/*.png
const {chromium} = require('playwright');
const C = {bermellon: '#F2381F', negro: '#000000', papel: '#EDEDEA', sombra: '#6E1A0F'};
// fondo, color del brillo principal, color del segundo brillo
const COMBOS = {
	'negro-bermellon': [C.negro, C.bermellon, C.sombra],
	'negro-sombra': [C.negro, C.sombra, C.bermellon],
	'bermellon': [C.bermellon, C.sombra, '#FF7A5C'],
	'sombra-bermellon': [C.sombra, C.bermellon, C.negro],
	'papel-bermellon': [C.papel, C.bermellon, '#F7A08F'],
};
const DESENFOQUE = {suave: 70, medio: 140, fuerte: 230};
const pagina = (fondo, b1, b2, blur, grano) => `<html><body style="margin:0">
<div style="position:relative;width:1080px;height:1920px;overflow:hidden;background:${fondo}">
	<div style="position:absolute;left:-200px;top:900px;width:1480px;height:1400px;border-radius:50%;
		background:radial-gradient(ellipse at 50% 50%, ${b1} 0%, ${b1} 35%, transparent 70%);filter:blur(${blur}px);opacity:.55"></div>
	<div style="position:absolute;left:420px;top:-350px;width:1000px;height:900px;border-radius:50%;
		background:radial-gradient(ellipse at 50% 50%, ${b2} 0%, ${b2} 30%, transparent 70%);filter:blur(${blur}px);opacity:.35"></div>
	<svg width="1080" height="1920" style="position:absolute;inset:0;mix-blend-mode:overlay;opacity:${grano}">
		<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="2.2" intercept="-0.6"/><feFuncG type="linear" slope="2.2" intercept="-0.6"/><feFuncB type="linear" slope="2.2" intercept="-0.6"/></feComponentTransfer></filter>
		<rect width="100%" height="100%" filter="url(#g)"/>
	</svg>
</div></body></html>`;
(async () => {
	const b = await chromium.launch();
	const p = await b.newPage({viewport: {width: 1080, height: 1920}});
	for (const [n, [fondo, b1, b2]] of Object.entries(COMBOS)) {
		for (const [d, blur] of Object.entries(DESENFOQUE)) {
			await p.setContent(pagina(fondo, b1, b2, blur, fondo === C.papel ? 0.25 : 0.32));
			await p.screenshot({path: `out/planv/fondos-historias/planv-historia-${n}-${d}.png`});
		}
	}
	await b.close();
})();
