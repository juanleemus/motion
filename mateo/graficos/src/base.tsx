import React from 'react';
import {AbsoluteFill, continueRender, delayRender, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {fitText} from '@remotion/layout-utils';
import {C, CIRCULO, F, ZONA} from './marca';

// ---------- fuentes ----------
const FUENTES: [string, string, string][] = [
  ['Inter Tight', 'InterTight-var.woff2', '100 900'],
  ['Inter', 'Inter-var.woff2', '100 900'],
  ['JetBrains Mono', 'JetBrainsMono-var.woff2', '100 800'],
];
let cargadas = false;
/** Carga las fuentes y devuelve true cuando están: los tamaños (fitText) se calculan recién ahí. */
export const useFuentes = () => {
  const [h] = React.useState(() => (cargadas ? null : delayRender('fuentes')));
  const [listo, setListo] = React.useState(cargadas);
  React.useEffect(() => {
    if (h === null) return;
    Promise.all(FUENTES.map(([n, f, w]) => new FontFace(n, `url(${staticFile(f)})`, {weight: w}).load().then((ff) => document.fonts.add(ff))))
      .then(() => {
        cargadas = true;
        setListo(true);
        continueRender(h);
      });
  }, [h]);
  return listo;
};

// ---------- tiempo ----------
export const ENTRA = 12; // cuadros de entrada de cada elemento
export const SALE = 7; // cuadros de salida de la escena
const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** Aparición de un elemento en el cuadro f (relativo a la escena): opacidad, subida y desenfoque. */
export const useEntrada = (f: number | undefined, dist = 28) => {
  const fr = useCurrentFrame();
  const p = interpolate(fr, [f ?? 0, (f ?? 0) + ENTRA], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  return {
    p,
    style: {opacity: p, transform: `translateY(${(1 - p) * dist}px)`, filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined} as React.CSSProperties,
  };
};

/** Encendido de la palabra clave cuando se dice. */
export const useEncendido = (kf: number | undefined) => {
  const fr = useCurrentFrame();
  if (kf === undefined) return 1;
  return interpolate(fr, [kf, kf + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
};

// ---------- texto ----------
/** Tamaño de letra que hace caber el texto en el ancho, entre min y max. */
export const ajustar = (texto: string, ancho: number, max: number, min: number, peso = 900, familia = 'Inter Tight') => {
  try {
    const {fontSize} = fitText({text: texto, withinWidth: ancho, fontFamily: familia, fontWeight: String(peso), letterSpacing: '-0.03em', validateFontIsLoaded: false});
    return Math.max(min, Math.min(max, Math.floor(fontSize)));
  } catch {
    return Math.max(min, Math.min(max, Math.floor(ancho / (texto.length * 0.55))));
  }
};

/** Texto con la palabra clave entre *asteriscos* resaltada en azul, que se enciende en kf. */
export const Resaltado: React.FC<{texto: string; kf?: number; color?: string}> = ({texto, kf, color = C.azulBrillo}) => {
  const e = useEncendido(kf);
  const partes = texto.split('*');
  return (
    <>
      {partes.map((p, i) =>
        i % 2 ? (
          <span key={i} style={{color: interpolateColor(e, C.blanco, color), textShadow: `0 0 ${30 * e}px ${color}88`}}>{p}</span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
};
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const interpolateColor = (p: number, a: string, b: string) => {
  const [x, y] = [hex(a), hex(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * p)).join(',')})`;
};
export const plano = (t: string) => t.replace(/\*/g, '');

export const Kicker: React.FC<{texto: string; f?: number; centro?: boolean}> = ({texto, f, centro}) => {
  const {style} = useEntrada(f, 14);
  return (
    <div style={{...style, display: 'flex', alignItems: 'center', gap: 16, justifyContent: centro ? 'center' : 'flex-start', font: `600 30px/1 ${F.mono}`, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.tinta300}}>
      <span style={{width: 34, height: 4, borderRadius: 2, background: C.azul}} />
      {texto}
    </div>
  );
};

// ---------- fondo y círculo ----------
export const Fondo: React.FC = () => (
  <AbsoluteFill style={{background: C.tinta950}}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)`,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 75% 75% at 40% 50%, black 30%, transparent 100%)',
      }}
    />
    <AbsoluteFill style={{background: `radial-gradient(ellipse 45% 55% at ${ZONA.x + ZONA.w / 2}px 50%, ${C.azul}14, transparent 70%)`}} />
  </AbsoluteFill>
);

export const Circulo: React.FC<{src: string}> = ({src}) => {
  const {cx, cy, d} = CIRCULO;
  return (
    <div style={{position: 'absolute', left: cx - d / 2, top: cy - d / 2, width: d, height: d}}>
      <div style={{position: 'absolute', inset: -26, borderRadius: '50%', background: `radial-gradient(circle, ${C.azul}30 55%, transparent 72%)`}} />
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', boxShadow: `0 24px 60px rgba(0,0,0,.55)`}}>
        <OffthreadVideo src={staticFile(src)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <div style={{position: 'absolute', inset: -7, borderRadius: '50%', border: `7px solid ${C.azul}`, boxShadow: `0 0 26px ${C.azul}99, inset 0 0 18px ${C.azul}55`}} />
    </div>
  );
};

/** Zona de contenido: todo centrado vertical y horizontalmente en la misma caja. */
export const Zona: React.FC<{children: React.ReactNode; alinear?: 'center' | 'flex-start'}> = ({children, alinear = 'center'}) => (
  <div style={{position: 'absolute', left: ZONA.x, top: ZONA.y, width: ZONA.w, height: ZONA.h, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: alinear}}>{children}</div>
);

export const Tarjeta: React.FC<{children: React.ReactNode; style?: React.CSSProperties; activa?: boolean}> = ({children, style, activa}) => (
  <div
    style={{
      background: `linear-gradient(180deg, ${C.tinta800}, ${C.tinta900})`,
      border: `2px solid ${activa ? C.azul : C.tinta700}`,
      borderRadius: 28,
      boxShadow: activa ? `0 0 0 1px ${C.azul}55, 0 20px 50px rgba(0,0,0,.35), 0 0 40px ${C.azul}33` : '0 20px 50px rgba(0,0,0,.35)',
      ...style,
    }}
  >
    {children}
  </div>
);
