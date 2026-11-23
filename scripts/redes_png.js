// Íconos de Instagram, TikTok y YouTube en los colores de plan v (PNG transparente, 1000 x 1000) y una hoja de muestra.
// Los dibujos vienen de Simple Icons (licencia CC0), guardados en public/planv/redes/.
// Uso: node scripts/redes_png.js  → out/planv/redes/
const fs = require('fs');
const {chromium} = require('playwright');
const C = {bermellon: '#F2381F', negro: '#111111', papel: '#EDEDEA', sombra: '#6E1A0F', blanco: '#FFFFFF'};
const REDES = ['instagram', 'tiktok', 'youtube'];
const camino = (n) => fs.readFileSync(`public/planv/redes/${n}.svg`, 'utf8').match(/ d="([^"]+)"/)[1];
// nombre → [color del ícono, color del círculo (o null para el ícono solo)]
const VARIANTES = {
	bermellon: [C.bermellon, null],
	negro: [C.negro, null],
	papel: [C.papel, null],
	sombra: [C.sombra, null],
	blanco: [C.blanco, null],
	'circulo-bermellon': [C.papel, C.bermellon],
	'circulo-negro': [C.bermellon, C.negro],
	'circulo-papel': [C.bermellon, C.papel],
};
const icono = (d, color, circulo, tam) => {
	const s = circulo ? 0.52 : 0.88; // proporción del ícono dentro del cuadro
	const off = (24 - 24 / s) / 2;
	return `<svg width="${tam}" height="${tam}" viewBox="${off} ${off} ${24 / s} ${24 / s}" xmlns="http://www.w3.org/2000/svg">
		${circulo ? `<circle cx="12" cy="12" r="${12 / s}" fill="${circulo}"/>` : ''}<path d="${d}" fill="${color}"/></svg>`;
};
(async () => {
	fs.mkdirSync('out/planv/redes', {recursive: true});
	const b = await chromium.launch();
	const p = await b.newPage({viewport: {width: 1000, height: 1000}});
	for (const r of REDES) {
		for (const [v, [color, circulo]] of Object.entries(VARIANTES)) {
			await p.setContent(`<body style="margin:0;background:transparent">${icono(camino(r), color, circulo, 1000)}</body>`);
			await p.screenshot({path: `out/planv/redes/planv-${r}-${v}.png`, omitBackground: true});
		}
	}
	// Hoja de muestra: cada variante sobre un fondo donde se vea bien.
	const fondoDe = (v) => (['negro', 'sombra', 'circulo-negro', 'circulo-bermellon'].includes(v) ? (v === 'circulo-negro' ? '#2a2a2a' : C.papel) : '#000');
	const fuentes = `@font-face{font-family:SpaceMonoPV;src:url(data:font/woff2;base64,${fs.readFileSync('public/fuentes/spacemono-400.woff2').toString('base64')})}@font-face{font-family:Serif;src:url(data:font/woff2;base64,${fs.readFileSync('public/fuentes/dmserif-400.woff2').toString('base64')})}`;
	const filas = REDES.map((r) => `<div style="display:flex;gap:16px">${Object.entries(VARIANTES)
		.map(([v, [color, circulo]]) => `<div style="width:200px;text-align:center"><div style="background:${fondoDe(v)};border-radius:18px;padding:30px">${icono(camino(r), color, circulo, 140)}</div>
			<div style="font:14px SpaceMonoPV;color:#EDEDEA;margin-top:10px">${v}</div></div>`).join('')}</div>`).join('');
	const hoja = await b.newPage({viewport: {width: 1830, height: 1000}});
	await hoja.setContent(`<style>${fuentes}</style><body style="margin:0;background:#000"><div style="padding:60px">
		<div style="font:64px Serif;color:#EDEDEA">plan <span style="color:#F2381F">v</span> <span style="font:22px SpaceMonoPV;letter-spacing:.3em;color:rgba(237,237,234,.7);margin-left:16px">redes</span></div>
		<div style="display:flex;flex-direction:column;gap:30px;margin-top:40px">${filas}</div></div></body>`);
	await hoja.evaluate(async () => { await document.fonts.load('14px SpaceMonoPV'); await document.fonts.ready; });
	await hoja.screenshot({path: 'out/planv/redes-planv-muestra.png', fullPage: true});
	// Etiquetas: el ícono en su círculo más una píldora con el usuario.
	const USUARIOS = {instagram: '@planv.pod', tiktok: '@planv.pod', youtube: '@planvpod'};
	// nombre → [círculo, ícono, píldora, texto, borde]
	const ETIQUETAS = {
		bermellon: [C.bermellon, C.papel, C.bermellon, C.papel, null],
		negro: [C.negro, C.bermellon, C.negro, C.papel, null],
		papel: [C.papel, C.bermellon, C.papel, C.negro, null],
		sombra: [C.sombra, C.papel, C.sombra, C.papel, null],
		'contorno-blanco': ['transparent', C.blanco, 'transparent', C.blanco, C.blanco],
	};
	const fuenteUsuario = `@font-face{font-family:InterPV;src:url(data:font/woff2;base64,${fs.readFileSync('public/fuentes/inter-500.woff2').toString('base64')})}`;
	const etiqueta = (r, [circ, ico, pil, txt, borde], alto) => {
		const linea = borde ? `border:${alto * 0.025}px solid ${borde};` : '';
		return `<div class="et" style="display:inline-flex;align-items:center;gap:${alto * 0.18}px;height:${alto}px;padding:0 ${alto * 0.42}px 0 0;border-radius:${alto / 2}px;background:${pil};${linea}box-sizing:border-box">
			<div style="width:${alto}px;height:${alto}px;margin-left:${borde ? -alto * 0.025 : 0}px">${icono(camino(r), ico, circ, alto)}</div>
			<span style="font:500 ${alto * 0.32}px InterPV;letter-spacing:-0.01em;color:${txt};white-space:nowrap">${USUARIOS[r]}</span></div>`;
	};
	const pe = await b.newPage({viewport: {width: 2000, height: 600}});
	for (const r of REDES) {
		for (const [v, est] of Object.entries(ETIQUETAS)) {
			await pe.setContent(`<style>${fuenteUsuario}</style><body style="margin:0;background:transparent;padding:20px">${etiqueta(r, est, 240)}</body>`);
			await pe.evaluate(async () => { await document.fonts.load('20px InterPV'); });
			await pe.locator('.et').screenshot({path: `out/planv/redes/planv-${r}-etiqueta-${v}.png`, omitBackground: true});
		}
	}
	// Muestra de las etiquetas
	const fondoEt = (v) => (v === 'papel' ? '#000' : v === 'contorno-blanco' ? C.sombra : C.papel);
	const hoja2 = await b.newPage({viewport: {width: 1830, height: 800}});
	await hoja2.setContent(`<style>${fuentes}${fuenteUsuario}</style><body style="margin:0;background:#000"><div style="padding:60px">
		<div style="font:64px Serif;color:#EDEDEA">plan <span style="color:#F2381F">v</span> <span style="font:22px SpaceMonoPV;letter-spacing:.3em;color:rgba(237,237,234,.7);margin-left:16px">etiquetas</span></div>
		<div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:20px;margin-top:40px">
		${Object.entries(ETIQUETAS).map(([v, est]) => REDES.map((r) => `<div style="background:${fondoEt(v)};border-radius:18px;padding:26px;display:flex;flex-direction:column;align-items:center;gap:10px">
			${etiqueta(r, est, 90)}<div style="font:13px SpaceMonoPV;color:${fondoEt(v) === C.papel ? '#111' : '#EDEDEA'}">${r} · ${v}</div></div>`).join('')).join('')}
		</div></div></body>`);
	await hoja2.evaluate(async () => { await document.fonts.load('20px InterPV'); await document.fonts.load('14px SpaceMonoPV'); await document.fonts.ready; });
	await hoja2.screenshot({path: 'out/planv/redes-planv-etiquetas-muestra.png', fullPage: true});
	await b.close();
})();
