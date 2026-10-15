// Efectos de sonido del reel JPR, atados a los mismos fotogramas que las animaciones de Reel.tsx.
// Los subtítulos normales no llevan sonido.
import {en, finDe} from './tiempos.ts';
import {ESCENAS, escena} from './escenas.ts';

export type EfectoJPR = 'whoosh_ancho' | 'golpe' | 'clic' | 'tono' | 'trazo' | 'pop' | 'campanita';
export type EventoJPR = {f: number; tipo: EfectoJPR; vol?: number; dur?: number};

const ev: EventoJPR[] = [];
const add = (f: number, tipo: EfectoJPR, vol = 1, dur?: number) => ev.push({f, tipo, vol, ...(dur ? {dur} : {})});

// whoosh de banda ancha en cada entrada a un apoyo B o S
for (const e of ESCENAS) if (e.plano !== 'A') add(e.desde, 'whoosh_ancho', 0.9);
// pop suave en cada palabra de énfasis fija ({...} en los bloques) y en el titular lima
for (const e of ESCENAS) for (const b of e.bloques) if (b.t.includes('{')) add(b.f, 'pop', 0.8);
add(en('ganando'), 'pop', 0.7);
// campanita en el llamado a la acción
add(en('sígueme'), 'campanita', 1);

// golpe en el ícono 3D (cuando aterriza) y en cada pastilla
const icono = (f: number) => add(f + 5, 'golpe', 0.9);
icono(escena('anuncios').desde);
icono(escena('solo').desde);
icono(escena('cobranding').desde);
icono(escena('pauta').desde);
for (const f of [en('buscar'), en('una marca que sea'), en('afín')]) add(f, 'golpe', 0.8);

// barra: tono ascendente mientras se llena · alerta: clic agudo
add(en('El costo'), 'tono', 0.8, finDe('las nubes') - en('El costo'));
add(en('nubes'), 'clic', 1);

// trazo en recuadros, resaltadores y líneas de nodos
add(en('anuncios'), 'trazo', 0.8);
add(en('pauta'), 'trazo', 0.8);
for (let i = 0; i < 6; i++) add(i * 3, 'trazo', 0.35); // red del gancho, en cascada
for (const f of [en('Oreo'), en('Coca-Cola'), en('Omega'), en('Snoop')]) add(f, 'trazo', 0.6);
for (let i = 0; i < 2; i++) add(escena('ganando').desde + i * 3, 'trazo', 0.5);

export const EVENTOS_JPR = ev.sort((a, b) => a.f - b.f);
