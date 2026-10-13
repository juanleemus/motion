// Imprime los fotogramas de revisión: uno ya asentado por escena (o "mov" para momentos en movimiento).
// REEL=acciones usa src/acciones/escenas.ts; sin REEL, el reel del día 5.
const {ESCENAS} = await import(process.env.REEL ? `../src/${process.env.REEL}/escenas.ts` : '../src/escenas.ts');
const v = Object.values(ESCENAS) as number[];
const modo = process.argv[2] ?? 'quieto';
const out: number[] = [];
for (let i = 0; i < v.length - 1; i++) {
	if (modo === 'quieto') out.push(i === 0 ? 0 : v[i + 1] - 9);
	else out.push(v[i] + 8, Math.round((v[i] + v[i + 1]) / 2));
}
console.log(out.join(' '));
