// Fondos con la vibra de plan v: color liso o brillo difuso, con o sin grano.
//  - historias de Instagram (1080 x 1920) → out/planv/fondos-historias/
//  - miniaturas de YouTube (1920 x 1080)  → out/planv/fondos-miniaturas/
// Uso: node scripts/fondos_historias.js [historias|miniaturas]  (sin argumento hace los dos)
const fs = require('fs');
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

// Dónde van las dos manchas de luz según el formato (x, y, ancho, alto).
const FORMATOS = {
	historias: {w: 1080, h: 1920, carpeta: 'fondos-historias', b1: [-200, 900, 1480, 1400], b2: [420, -350, 1000, 900]},
	miniaturas: {w: 1920, h: 1080, carpeta: 'fondos-miniaturas', b1: [-400, 300, 1500, 1200], b2: [1100, -400, 1200, 900]},
};

// Sobre negro puro el modo overlay no se ve, así que ahí el grano se suma con screen.
const grano = (w, h, op, modo = 'overlay') =>
	op <= 0
		? ''
		: `<svg width="${w}" height="${h}" style="position:absolute;inset:0;mix-blend-mode:${modo};opacity:${op}">
	<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4"/><feColorMatrix type="saturate" values="0"/>
	<feComponentTransfer><feFuncR type="linear" slope="2.2" intercept="-0.6"/><feFuncG type="linear" slope="2.2" intercept="-0.6"/><feFuncB type="linear" slope="2.2" intercept="-0.6"/></feComponentTransfer></filter>
	<rect width="100%" height="100%" filter="url(#g)"/></svg>`;

const mancha = ([x, y, w, h], color, blur, op, corte) =>
	`<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:50%;
	background:radial-gradient(ellipse at 50% 50%, ${color} 0%, ${color} ${corte}%, transparent 70%);filter:blur(${blur}px);opacity:${op}"></div>`;

const pagina = (f, [fondo, b1, b2], v) => `<html><body style="margin:0">
<div style="position:relative;width:${f.w}px;height:${f.h}px;overflow:hidden;background:${fondo}">
	${v.brillo ? mancha(f.b1, b1, v.blur, 0.55, 35) + mancha(f.b2, b2, v.blur, 0.35, 30) : ''}
	${fondo === C.negro ? grano(f.w, f.h, v.grano * 0.22, 'screen') : ''}
	${grano(f.w, f.h, v.grano * (fondo === C.papel ? 0.8 : 1))}
</div></body></html>`;

// Historias: solo degradados con distinto desenfoque (grano sutil).
const VARIANTES_HISTORIAS = {
	suave: {brillo: true, blur: 70, grano: 0.32},
	medio: {brillo: true, blur: 140, grano: 0.32},
	fuerte: {brillo: true, blur: 230, grano: 0.32},
};
// Miniaturas: de liso a mucha textura.
const VARIANTES_MINIATURAS = {
	'1-liso': {brillo: false, grano: 0},
	'2-liso-grano': {brillo: false, grano: 0.45},
	'3-degradado': {brillo: true, blur: 160, grano: 0},
	'4-degradado-grano-suave': {brillo: true, blur: 160, grano: 0.32},
	'5-degradado-grano-fuerte': {brillo: true, blur: 110, grano: 1},
};

(async () => {
	const pedidos = process.argv[2] ? [process.argv[2]] : ['historias', 'miniaturas'];
	const b = await chromium.launch();
	for (const tipo of pedidos) {
		const f = FORMATOS[tipo];
		const variantes = tipo === 'historias' ? VARIANTES_HISTORIAS : VARIANTES_MINIATURAS;
		const prefijo = tipo === 'historias' ? 'planv-historia' : 'planv-miniatura';
		fs.mkdirSync(`out/planv/${f.carpeta}`, {recursive: true});
		const p = await b.newPage({viewport: {width: f.w, height: f.h}});
		for (const [n, combo] of Object.entries(COMBOS)) {
			for (const [d, v] of Object.entries(variantes)) {
				await p.setContent(pagina(f, combo, v));
				await p.screenshot({path: `out/planv/${f.carpeta}/${prefijo}-${n}-${d}.png`});
			}
		}
		await p.close();
	}
	await b.close();
})();
