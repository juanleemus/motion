// Guía para el editor: dónde va el video de Juan Pablo en cada plano y dónde van los acercamientos de golpe.
// Uso: node scripts/guia-edicion-jpr.ts > out/jpr-marcas-colaboran-guia-edicion.csv
import {ESCENAS} from '../src/jpr/escenas.ts';
const tc = (f: number) => `00:00:${String(Math.floor(f / 30)).padStart(2, '0')}:${String(f % 30).padStart(2, '0')}`;
const DONDE = {
	A: 'Juan Pablo a pantalla completa (1080x1920)',
	S: 'Juan Pablo abajo, de y 920 a 1920 (1080x1000), encuadre más abierto; cabeza debajo de y 920',
	B: 'Sin Juan Pablo (apoyo a pantalla completa)',
};
console.log('entra,sale,fotograma_entra,fotograma_sale,plano,escena,video_de_juan_pablo,acercamientos_12%');
for (const e of ESCENAS) {
	const z = (e.zooms ?? []).map(([a, b]) => `${tc(a)}-${tc(b)}`).join(' / ');
	console.log([tc(e.desde), tc(e.hasta), e.desde, e.hasta, e.plano, e.id, `"${DONDE[e.plano]}"`, z].join(','));
}
