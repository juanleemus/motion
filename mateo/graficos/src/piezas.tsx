import React from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ajustar, Kicker, plano, Resaltado, Tarjeta, useEncendido, useEntrada, Zona} from './base';
import {C, F, ZONA} from './marca';

type L = {t: string; f?: number; kf?: number; tam?: 'xl' | 'l' | 'm'};
const TAM = {xl: [150, 72], l: [112, 60], m: [78, 50]} as const;

// ---------- FRASE: una a tres líneas grandes, centradas; la palabra clave se enciende cuando se dice ----------
export const Frase: React.FC<{kicker?: string; kf0?: number; lineas: L[]; cita?: boolean}> = ({kicker, kf0, lineas, cita}) => (
  <Zona alinear={cita ? 'flex-start' : 'center'}>
    {kicker ? <div style={{marginBottom: 34}}><Kicker texto={kicker} f={kf0 ?? lineas[0]?.f} centro={!cita} /></div> : null}
    {cita ? <Comillas f={lineas[0]?.f} /> : null}
    {lineas.map((l, i) => (
      <Linea key={i} l={l} cita={cita} />
    ))}
  </Zona>
);
const Comillas: React.FC<{f?: number}> = ({f}) => {
  const {style} = useEntrada(f, 10);
  return <div style={{...style, font: `900 150px/0.7 ${F.display}`, color: C.azul, height: 80, marginBottom: 10}}>“</div>;
};
const Linea: React.FC<{l: L; cita?: boolean}> = ({l, cita}) => {
  const {style} = useEntrada(l.f);
  const [max, min] = TAM[l.tam ?? (cita ? 'm' : 'l')];
  const fs = ajustar(plano(l.t), ZONA.w * (cita ? 0.92 : 0.96), max, min, cita ? 700 : 900);
  return (
    <div
      style={{
        ...style,
        font: `${cita ? 700 : 900} ${fs}px/1.06 ${F.display}`,
        letterSpacing: cita ? '-0.015em' : '-0.03em',
        textTransform: cita ? 'none' : 'uppercase',
        color: C.blanco,
        textAlign: cita ? 'left' : 'center',
        maxWidth: ZONA.w,
        whiteSpace: 'nowrap',
      }}
    >
      <Resaltado texto={l.t} kf={l.kf} />
    </div>
  );
};

// ---------- CIFRA: un número enorme que cuenta hasta su valor en la palabra en que se dice ----------
export const Cifra: React.FC<{kicker?: string; valor: string; sufijo?: string; etiqueta?: string; f?: number; fe?: number; chips?: {t: string; f?: number}[]}> = ({
  kicker, valor, sufijo, etiqueta, f, fe, chips,
}) => {
  const fr = useCurrentFrame();
  const {style} = useEntrada(f, 40);
  const m = valor.match(/^(\D*)([\d.,]+)(.*)$/);
  let shown = valor;
  if (m) {
    const n = parseFloat(m[2].replace(/\./g, '').replace(',', '.'));
    const p = interpolate(fr, [f ?? 0, (f ?? 0) + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
    const v = Math.round(n * p);
    shown = m[1] + (n >= 1000 ? v.toLocaleString('es-CO') : String(v)) + m[3];
  }
  const fs = ajustar(valor + (sufijo ?? ''), ZONA.w * 0.9, 300, 120);
  const e = useEncendido(f !== undefined ? f + 10 : undefined);
  return (
    <Zona>
      {kicker ? <div style={{marginBottom: 26}}><Kicker texto={kicker} f={f} centro /></div> : null}
      <div style={{...style, display: 'flex', alignItems: 'baseline', gap: 14, font: `900 ${fs}px/0.9 ${F.display}`, letterSpacing: '-0.05em', color: C.azulBrillo, textShadow: `0 0 ${50 * e}px ${C.azul}88`}}>
        {shown}
        {sufijo ? <span style={{fontSize: fs * 0.3, color: C.tinta100, letterSpacing: '-0.02em', textShadow: 'none'}}>{sufijo}</span> : null}
      </div>
      {etiqueta ? <Sub texto={etiqueta} f={fe ?? (f !== undefined ? f + 6 : undefined)} /> : null}
      {chips?.length ? (
        <div style={{display: 'flex', gap: 22, marginTop: 46, flexWrap: 'wrap', justifyContent: 'center', maxWidth: ZONA.w}}>
          {chips.map((c, i) => <Chip key={i} {...c} />)}
        </div>
      ) : null}
    </Zona>
  );
};
const Sub: React.FC<{texto: string; f?: number}> = ({texto, f}) => {
  const {style} = useEntrada(f, 16);
  const fs = ajustar(plano(texto), ZONA.w * 0.9, 56, 38, 700);
  return <div style={{...style, marginTop: 30, font: `700 ${fs}px/1.15 ${F.display}`, color: C.blanco, textAlign: 'center', whiteSpace: 'nowrap'}}><Resaltado texto={texto} /></div>;
};
const Chip: React.FC<{t: string; f?: number}> = ({t, f}) => {
  const {style} = useEntrada(f, 16);
  return (
    <div style={{...style, padding: '18px 34px', borderRadius: 999, background: `${C.azul}1F`, border: `2px solid ${C.azul}`, font: `700 40px/1 ${F.display}`, color: C.blanco, whiteSpace: 'nowrap'}}>
      <Resaltado texto={t} />
    </div>
  );
};

// ---------- LISTA: tarjetas del mismo tamaño que entran cada una en su palabra ----------
type Item = {n?: string; t: string; sub?: string; f?: number};
export const Lista: React.FC<{titulo?: string; ft?: number; items: Item[]; activo?: number; fa?: number}> = ({titulo, ft, items, activo, fa}) => {
  const n = items.length;
  const cols = n === 4 ? 2 : n;
  const gap = 28;
  const w = (ZONA.w - gap * (cols - 1)) / cols;
  const largo = Math.max(...items.map((x) => x.t.length));
  const fsT = Math.min(cols >= 3 ? 50 : 60, Math.max(40, Math.floor((w - 80) / (Math.min(largo, 16) * 0.55))));
  const fr = useCurrentFrame();
  return (
    <Zona>
      {titulo ? <div style={{marginBottom: 40, alignSelf: 'stretch'}}><Kicker texto={titulo} f={ft ?? items[0]?.f} /></div> : null}
      <div style={{display: 'flex', flexWrap: 'wrap', gap, width: ZONA.w}}>
        {items.map((it, i) => (
          <ItemTarjeta key={i} it={it} w={w} fsT={fsT} alto={n === 4 ? 210 : 330} activa={activo === i && fa !== undefined && fr >= fa} />
        ))}
      </div>
    </Zona>
  );
};
const ItemTarjeta: React.FC<{it: Item; w: number; fsT: number; alto: number; activa?: boolean}> = ({it, w, fsT, alto, activa}) => {
  const {style} = useEntrada(it.f, 30);
  return (
    <div style={{...style, width: w}}>
      <Tarjeta activa={activa} style={{height: alto, padding: '36px 40px', display: 'flex', flexDirection: alto < 250 ? 'row' : 'column', alignItems: alto < 250 ? 'center' : 'flex-start', justifyContent: alto < 250 ? 'flex-start' : 'space-between', gap: 30}}>
        {it.n ? <div style={{font: `900 ${alto < 250 ? 92 : 104}px/0.9 ${F.display}`, letterSpacing: '-0.04em', color: activa ? C.azulBrillo : C.azul, minWidth: alto < 250 ? 120 : undefined}}>{it.n}</div> : null}
        <div>
          <div style={{font: `800 ${fsT}px/1.08 ${F.display}`, letterSpacing: '-0.02em', color: C.blanco}}><Resaltado texto={it.t} /></div>
          {it.sub ? <div style={{marginTop: 12, font: `500 32px/1.2 ${F.cuerpo}`, color: C.tinta300}}>{it.sub}</div> : null}
        </div>
      </Tarjeta>
    </div>
  );
};

// ---------- VERSUS: lo que parece → lo que es (A se apaga y se tacha cuando entra B) ----------
type Lado = {kicker: string; t: string; f?: number};
export const Versus: React.FC<{a: Lado; b: Lado; tachar?: boolean}> = ({a, b, tachar = true}) => {
  const fr = useCurrentFrame();
  const pb = interpolate(fr, [b.f ?? 0, (b.f ?? 0) + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const w = (ZONA.w - 120) / 2;
  return (
    <Zona>
      <div style={{display: 'flex', alignItems: 'center', gap: 30, width: ZONA.w}}>
        <LadoV l={a} w={w} apagado={pb} tachar={tachar} />
        <Flecha f={b.f} />
        <LadoV l={b} w={w} activa />
      </div>
    </Zona>
  );
};
const LadoV: React.FC<{l: Lado; w: number; apagado?: number; tachar?: boolean; activa?: boolean}> = ({l, w, apagado = 0, tachar, activa}) => {
  const {style} = useEntrada(l.f, 30);
  const fs = ajustar(plano(l.t.split('\n').sort((x, y) => y.length - x.length)[0]), w - 90, 82, 46);
  return (
    <div style={{...style, width: w}}>
      <Tarjeta activa={activa} style={{height: 420, padding: 44, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26, opacity: 1 - apagado * 0.45}}>
        <div style={{font: `600 26px/1 ${F.mono}`, letterSpacing: '0.16em', color: activa ? C.azulBrillo : C.tinta300}}>{l.kicker}</div>
        <div style={{position: 'relative', font: `900 ${fs}px/1.04 ${F.display}`, letterSpacing: '-0.03em', color: C.blanco, whiteSpace: 'pre-line'}}>
          <Resaltado texto={l.t} />
          {tachar && apagado > 0 ? <div style={{position: 'absolute', left: -8, top: '50%', height: 9, borderRadius: 5, background: C.coral, width: `${apagado * 104}%`}} /> : null}
        </div>
      </Tarjeta>
    </div>
  );
};
const Flecha: React.FC<{f?: number}> = ({f}) => {
  const {style} = useEntrada(f, 0);
  return <div style={{...style, font: `900 70px/1 ${F.display}`, color: C.azul, width: 60, textAlign: 'center'}}>→</div>;
};

// ---------- PASOS: secuencia horizontal numerada ----------
export const Pasos: React.FC<{titulo?: string; ft?: number; items: {t: string; sub?: string; f?: number}[]}> = ({titulo, ft, items}) => {
  const n = items.length;
  const gap = 70;
  const w = (ZONA.w - gap * (n - 1)) / n;
  const fsT = Math.min(58, Math.max(40, Math.floor((w - 60) / (Math.max(...items.map((x) => Math.min(x.t.length, 14))) * 0.56))));
  return (
    <Zona>
      {titulo ? <div style={{marginBottom: 44, alignSelf: 'stretch'}}><Kicker texto={titulo} f={ft ?? items[0]?.f} /></div> : null}
      <div style={{display: 'flex', alignItems: 'stretch', gap, width: ZONA.w}}>
        {items.map((it, i) => (
          <Paso key={i} i={i} it={it} w={w} fsT={fsT} ultimo={i === n - 1} />
        ))}
      </div>
    </Zona>
  );
};
const Paso: React.FC<{i: number; it: {t: string; sub?: string; f?: number}; w: number; fsT: number; ultimo: boolean}> = ({i, it, w, fsT, ultimo}) => {
  const {style} = useEntrada(it.f, 30);
  return (
    <div style={{...style, width: w, position: 'relative', display: 'flex'}}>
      <Tarjeta style={{minHeight: 340, height: '100%', padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 26}}>
        <div style={{flexShrink: 0, width: 76, height: 76, borderRadius: '50%', background: C.azul, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `900 40px/1 ${F.display}`, color: C.blanco, boxShadow: `0 0 26px ${C.azul}88`}}>{i + 1}</div>
        <div style={{font: `800 ${fsT}px/1.06 ${F.display}`, letterSpacing: '-0.02em', color: C.blanco}}><Resaltado texto={it.t} /></div>
        {it.sub ? <div style={{font: `500 32px/1.2 ${F.cuerpo}`, color: C.tinta300}}>{it.sub}</div> : null}
      </Tarjeta>
      {!ultimo ? <div style={{position: 'absolute', right: -58, top: 140, font: `900 52px/1 ${F.display}`, color: C.tinta500}}>›</div> : null}
    </div>
  );
};

// ---------- CASO: nombre (y foto) + antes → después ----------
type Num = {v: string; l: string; f?: number};
export const Caso: React.FC<{nombre: string; rol?: string; foto?: string; f?: number; antes: Num; despues: Num}> = ({nombre, rol, foto, f, antes, despues}) => {
  const cab = useEntrada(f, 20);
  const w = (ZONA.w - 140) / 2;
  return (
    <Zona>
      <div style={{...cab.style, display: 'flex', alignItems: 'center', gap: 30, alignSelf: 'stretch', marginBottom: 46}}>
        {foto ? <Img src={staticFile(foto)} style={{width: 128, height: 128, borderRadius: '50%', objectFit: 'cover', border: `4px solid ${C.azul}`}} /> : null}
        <div>
          <div style={{font: `600 26px/1 ${F.mono}`, letterSpacing: '0.16em', color: C.tinta300, marginBottom: 12}}>CASO</div>
          <div style={{font: `900 74px/1 ${F.display}`, letterSpacing: '-0.03em', color: C.blanco}}>{nombre}</div>
          {rol ? <div style={{font: `500 34px/1.2 ${F.cuerpo}`, color: C.tinta300, marginTop: 8}}>{rol}</div> : null}
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 40, width: ZONA.w}}>
        <Numero n={antes} w={w} />
        <Flecha f={despues.f} />
        <Numero n={despues} w={w} activa />
      </div>
    </Zona>
  );
};
const Numero: React.FC<{n: Num; w: number; activa?: boolean}> = ({n, w, activa}) => {
  const {style} = useEntrada(n.f, 30);
  const fs = ajustar(n.v, w - 100, 150, 64);
  return (
    <div style={{...style, width: w}}>
      <Tarjeta activa={activa} style={{height: 320, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 18}}>
        <div style={{font: `900 ${fs}px/0.95 ${F.display}`, letterSpacing: '-0.04em', color: activa ? C.azulBrillo : C.tinta100, textShadow: activa ? `0 0 40px ${C.azul}77` : undefined, whiteSpace: 'nowrap'}}>{n.v}</div>
        <div style={{font: `600 36px/1.15 ${F.display}`, color: C.tinta300, textAlign: 'center'}}>{n.l}</div>
      </Tarjeta>
    </div>
  );
};

// ---------- IMAGEN: captura real en tarjeta, con acercamiento lento y foco resaltado ----------
export const Imagen: React.FC<{src: string; kicker?: string; f?: number; foco?: [number, number, number, number]; ff?: number; ancho?: number}> = ({src, kicker, f, foco, ff, ancho = 1180}) => {
  const fr = useCurrentFrame();
  const {style} = useEntrada(f, 30);
  const z = interpolate(fr, [f ?? 0, (f ?? 0) + 150], [1, 1.06], {extrapolateRight: 'clamp'});
  const pf = interpolate(fr, [ff ?? 1e9, (ff ?? 1e9) + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Zona>
      {kicker ? <div style={{marginBottom: 30, alignSelf: 'stretch'}}><Kicker texto={kicker} f={f} /></div> : null}
      <div style={{...style, width: ancho, borderRadius: 26, overflow: 'hidden', border: `2px solid ${C.tinta700}`, boxShadow: '0 30px 70px rgba(0,0,0,.5)', position: 'relative'}}>
        <div style={{transform: `scale(${z})`, transformOrigin: '20% 70%', position: 'relative'}}>
          <Img src={staticFile(src)} style={{width: '100%', display: 'block'}} />
          {foco ? (
            <div style={{position: 'absolute', left: `${foco[0] * 100}%`, top: `${foco[1] * 100}%`, width: `${foco[2] * 100}%`, height: `${foco[3] * 100}%`, border: `5px solid ${C.azul}`, borderRadius: 14, background: `${C.azul}1A`, opacity: pf, boxShadow: `0 0 30px ${C.azul}88`}} />
          ) : null}
        </div>
      </div>
    </Zona>
  );
};
