// Piezas reutilizables del estilo JPR. Cada reel solo escribe escenas.json; aquí no se toca nada por reel.
// Reglas de ESTILO.md: todo derecho (sin rotaciones), rebote máximo 6 %, íconos de línea, solo la paleta.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, interpolateColors, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AREA_ANCHO, AREA_X, C, LORA, POPPINS, SOMBRA, ZONA} from './tema';
import {EscenaPlan, Icono, partesTexto} from './plan';

// ---------- movimiento ----------
const suave = Easing.bezier(0.22, 1, 0.36, 1); // sale rápido y frena, sin pasarse
const firme = Easing.out(Easing.back(0.9)); // rebote ≈ 3 % (máximo permitido 6 %)
const enInOut = Easing.bezier(0.65, 0, 0.35, 1);
const k = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const prog = (frame: number, f: number, dur: number, easing = suave) =>
  interpolate(frame, [f, f + dur], [0, 1], {...k, easing});

/** Entrada estándar: 4 fotogramas, opacidad 0→1, escala 0,92→1, sube 12 px. */
export const entrada = (frame: number, f: number, dur = 4, sube = 12): React.CSSProperties => {
  const p = prog(frame, f, dur);
  return {opacity: p, transform: `translateY(${(1 - p) * sube}px) scale(${0.92 + 0.08 * p})`};
};
/** Entrada desde abajo para chips y tarjetas (rebote máximo 3 %). */
const desdeAbajo = (frame: number, f: number, dist = 40): React.CSSProperties => {
  const o = prog(frame, f, 5);
  const p = interpolate(frame, [f, f + 9], [0, 1], {...k, easing: firme});
  return {opacity: o, transform: `translateY(${(1 - p) * dist}px) scale(${0.96 + 0.04 * p})`};
};

const poppins = (peso: 500 | 700, tam: number, color: string = C.medianoche): React.CSSProperties => ({
  fontFamily: POPPINS,
  fontWeight: peso,
  fontSize: tam,
  color,
  lineHeight: 1.12,
});

// ---------- íconos de línea ----------
const TRAZOS: Record<Exclude<Icono, 'numero'> | 'enviar', React.ReactNode> = {
  alerta: (<><path d="M12 3.5 21.5 20h-19z" /><path d="M12 10v4.5" /><path d="M12 17.3v.2" /></>),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  sube: (<><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>),
  baja: (<><path d="M3 7l6 6 4-4 8 8" /><path d="M15 17h6v-6" /></>),
  reloj: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>),
  rayo: <path d="M13 2.5 4.5 14H12l-1 7.5L19.5 10H12z" />,
  usuario: (<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>),
  dinero: (<><rect x="2.5" y="6" width="19" height="12" rx="2.5" /><circle cx="12" cy="12" r="2.8" /></>),
  grafica: (<><path d="M3.5 20.5h17" /><path d="M6.5 17v-5M11.5 17V7M16.5 17v-8" /></>),
  comentario: <path d="M4 5h16v11H9.5L4 20z" />,
  enviar: (<><path d="M12 19V5.5" /><path d="M6.5 11 12 5.5l5.5 5.5" /></>),
};
export const IconoLinea: React.FC<{nombre: keyof typeof TRAZOS; tam?: number; color?: string; grosor?: number}> = ({nombre, tam = 44, color = C.lima, grosor = 2.4}) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0}}>
    {TRAZOS[nombre]}
  </svg>
);

// ---------- Fondo ----------
/** Fondo x en todo el motion: cubre la pantalla y hace zoom muy lento de 1 a 1,06. */
export const Fondo: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const z = interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [1, 1.06], k);
  return (
    <AbsoluteFill style={{backgroundColor: C.blanco}}>
      <Img src={staticFile('kit/fondo-x.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`}} />
    </AbsoluteFill>
  );
};

// ---------- Texto de apoyo ----------
/** Texto corto con acento: *lora* (Lora Italic azul), [marcador] (lima detrás), {azul} (azul eléctrico). */
export const Texto: React.FC<{texto: string; f: number; tam?: number; ancho?: number}> = ({texto, f, tam = 88, ancho = AREA_ANCHO}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{...poppins(700, tam), ...entrada(frame, f), maxWidth: ancho, textAlign: 'center', textWrap: 'balance', letterSpacing: '-0.01em'}}>
      {partesTexto(texto).map((p, i) => {
        if (p.estilo === 'lora') {
          const b = interpolate(frame, [f, f + 6], [8, 0], k);
          return (
            <span key={i} style={{fontFamily: LORA, fontStyle: 'italic', fontWeight: 500, fontSize: tam * 1.1, color: C.electrico, filter: `blur(${b}px)`, letterSpacing: 0}}>
              {p.t}
            </span>
          );
        }
        if (p.estilo === 'marcador') {
          const m = prog(frame, f + 2, 7, enInOut);
          return (
            <span key={i} style={{position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', zIndex: 0}}>
              <span style={{position: 'absolute', left: '-0.1em', right: '-0.1em', top: '0.12em', bottom: '0.06em', background: C.lima, borderRadius: 10, transform: `scaleX(${m})`, transformOrigin: 'left center', zIndex: -1}} />
              {p.t}
            </span>
          );
        }
        if (p.estilo === 'azul') return <span key={i} style={{color: C.electrico}}>{p.t}</span>;
        return <span key={i}>{p.t}</span>;
      })}
    </div>
  );
};

// ---------- Insignia ----------
/** Número de sección en círculo azul eléctrico + etiqueta corta; en listas, puntos de progreso. */
export const Insignia: React.FC<{numero: string; etiqueta: string; puntos?: number; actual?: number; f: number}> = ({numero, etiqueta, puntos = 0, actual = 1, f}) => {
  const frame = useCurrentFrame();
  const c = prog(frame, f, 6, firme);
  const l = prog(frame, f + 3, 6);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
      <div style={{width: 72, height: 72, borderRadius: 36, background: C.electrico, display: 'flex', alignItems: 'center', justifyContent: 'center', ...poppins(700, 36, C.blanco), lineHeight: 1, opacity: prog(frame, f, 3), transform: `scale(${0.8 + 0.2 * c})`}}>
        {numero}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 10, opacity: l, transform: `translateX(${(1 - l) * -16}px)`}}>
        <div style={{...poppins(500, 42), lineHeight: 1}}>{etiqueta}</div>
        {puntos > 1 && (
          <div style={{display: 'flex', gap: 8}}>
            {Array.from({length: puntos}).map((_, i) => (
              <div key={i} style={{height: 10, width: i + 1 === actual ? 30 : 10, borderRadius: 5, background: i + 1 <= actual ? C.electrico : C.gris, opacity: i + 1 <= actual ? 1 : 0.45}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Chip y PilaChips ----------
export const Chip: React.FC<{texto: string; icono?: Icono; numero?: number; f: number; actual?: boolean; tam?: number}> = ({texto, icono = 'alerta', numero, f, actual, tam = 44}) => {
  const frame = useCurrentFrame();
  const fondo = actual ? C.lima : C.medianoche;
  const tinta = actual ? C.medianoche : C.blanco;
  const linea = actual ? C.medianoche : C.lima;
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, background: fondo, borderRadius: 18, padding: `${tam * 0.42}px ${tam * 0.7}px ${tam * 0.42}px ${tam * 0.5}px`, boxShadow: SOMBRA, ...desdeAbajo(frame, f)}}>
      {icono === 'numero' ? (
        <div style={{width: tam, height: tam, borderRadius: tam / 2, border: `3px solid ${linea}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', ...poppins(700, tam * 0.5, linea), lineHeight: 1}}>{numero}</div>
      ) : (
        <IconoLinea nombre={icono} tam={tam} color={linea} />
      )}
      <span style={{...poppins(500, tam, tinta), lineHeight: 1.05, whiteSpace: 'nowrap'}}>{texto}</span>
    </div>
  );
};

export const PilaChips: React.FC<{chips: {texto: string; f: number; icono?: Icono; numero?: number}[]; actual?: number; tam?: number}> = ({chips, actual, tam}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
    {chips.map((c, i) => (
      <Chip key={i} {...c} tam={tam} actual={actual === i + 1} />
    ))}
  </div>
);

// ---------- Barra ----------
/** Se llena en azul eléctrico; al 100 % cambia a lima y aparece la alerta de línea. */
export const Barra: React.FC<{etiqueta?: string; f: number; fLleno: number; hasta: number; ancho?: number}> = ({etiqueta, f, fLleno, hasta, ancho = 640}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [f + 4, fLleno], [0, hasta], {...k, easing: enInOut});
  const lleno = hasta >= 1;
  const color = lleno ? interpolateColors(frame, [fLleno - 1, fLleno + 3], [C.electrico, C.lima]) : C.electrico;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, ...entrada(frame, f)}}>
      {etiqueta && <div style={{...poppins(500, 42), lineHeight: 1}}>{etiqueta}</div>}
      <div style={{width: ancho, height: 36, borderRadius: 18, background: 'rgba(138,148,166,0.22)', overflow: 'hidden'}}>
        <div style={{width: `${v * 100}%`, height: '100%', borderRadius: 18, background: color}} />
      </div>
      {lleno && (
        <div style={{width: 84, height: 84, borderRadius: 22, background: C.medianoche, display: 'flex', alignItems: 'center', justifyContent: 'center', ...entrada(frame, fLleno + 1, 6)}}>
          <IconoLinea nombre="alerta" tam={50} />
        </div>
      )}
    </div>
  );
};

// ---------- Cifra ----------
const numeroCO = (v: number, dec: number) => v.toLocaleString('es-CO', {minimumFractionDigits: dec, maximumFractionDigits: dec});
/** Cifra grande que cuenta hasta el valor dicho en 18 fotogramas (con tic). */
export const Cifra: React.FC<{valor: number; decimales: number; prefijo?: string; sufijo?: string; etiqueta?: string; f: number; tam?: number}> = ({valor, decimales, prefijo = '', sufijo = '', etiqueta, f, tam = 240}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [f, f + 18], [0, valor], {...k, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
      {etiqueta && <Texto texto={etiqueta} f={Math.max(0, f - 4)} tam={48} />}
      <div style={{...poppins(700, tam), lineHeight: 1, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', ...entrada(frame, f)}}>
        {prefijo}
        {numeroCO(v, decimales)}
        {sufijo}
      </div>
    </div>
  );
};

// ---------- Grafica ----------
/** Barras o línea en azul eléctrico que suben; la última en lima. Sin cifras inventadas. */
export const Grafica: React.FC<{tipo: 'barras' | 'linea'; valores: number[]; etiquetas?: string[]; f: number; ancho?: number; alto?: number}> = ({tipo, valores, etiquetas, f, ancho = 620, alto = 320}) => {
  const frame = useCurrentFrame();
  const max = Math.max(...valores);
  const n = valores.length;
  const base = <div style={{width: ancho, height: 5, borderRadius: 3, background: C.medianoche, opacity: prog(frame, f, 4)}} />;
  const rotulos = etiquetas && (
    <div style={{display: 'flex', width: ancho, justifyContent: 'space-around', marginTop: 14}}>
      {etiquetas.map((t, i) => (
        <div key={i} style={{...poppins(500, 30, C.gris), opacity: prog(frame, f + i * 4, 6), width: ancho / n, textAlign: 'center'}}>{t}</div>
      ))}
    </div>
  );
  if (tipo === 'linea') {
    const pts = valores.map((v, i) => [ancho * (0.06 + (0.88 * i) / (n - 1)), alto - 16 - (alto - 40) * (v / max)]);
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
    const p = prog(frame, f + 2, 8 + n * 4, enInOut);
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <svg width={ancho} height={alto} style={{overflow: 'visible'}}>
          <path d={d} fill="none" stroke={C.electrico} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
          {pts.map(([x, y], i) => {
            const ultimo = i === n - 1;
            const vis = prog(frame, f + 2 + ((8 + n * 4) * i) / (n - 1) - 1, 4);
            return <circle key={i} cx={x} cy={y} r={(ultimo ? 17 : 10) * vis} fill={ultimo ? C.lima : C.electrico} stroke={ultimo ? C.medianoche : 'none'} strokeWidth={4} />;
          })}
        </svg>
        {base}
        {rotulos}
      </div>
    );
  }
  const gap = 26;
  const w = Math.min(104, (ancho - 40 - gap * (n - 1)) / n);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap, height: alto, width: ancho}}>
        {valores.map((v, i) => {
          const p = prog(frame, f + i * 4, 12, firme);
          return <div key={i} style={{width: w, height: Math.max(0, (alto - 10) * (v / max) * p), borderRadius: '14px 14px 4px 4px', background: i === n - 1 ? C.lima : C.electrico}} />;
        })}
      </div>
      {base}
      {rotulos}
    </div>
  );
};

// ---------- logos ----------
export const urlLogo = (logo: string) => staticFile(`kit/logos/${logo.replace(/\.png$/, '')}.png`);

/** Logo en tarjeta blanca (radio 28, sombra suave). Las versiones "-texto" usan tarjeta ancha. */
export const TarjetaLogo: React.FC<{logo: string; f: number; tam?: number}> = ({logo, f, tam = 280}) => {
  const frame = useCurrentFrame();
  const ancha = logo.endsWith('-texto');
  const w = ancha ? tam * 1.9 : tam;
  const h = ancha ? tam * 0.72 : tam;
  return (
    <div style={{width: w, height: h, borderRadius: 28, background: C.blanco, boxShadow: SOMBRA, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...entrada(frame, f, 6, 20)}}>
      <Img src={urlLogo(logo)} style={{width: ancha ? '80%' : '62%', height: ancha ? '62%' : '62%', objectFit: 'contain'}} />
    </div>
  );
};
export const FilaLogos: React.FC<{logos: {logo: string; f: number}[]; grande: boolean}> = ({logos, grande}) => {
  const anchas = logos.filter((l) => l.logo.endsWith('-texto')).length;
  const tam = logos.length === 1 ? (grande ? 360 : 300) : logos.length === 2 ? (anchas ? 200 : 280) : anchas ? 150 : 228;
  return (
    <div style={{display: 'flex', gap: 30, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', maxWidth: AREA_ANCHO}}>
      {logos.map((l, i) => <TarjetaLogo key={i} logo={l.logo} f={l.f} tam={tam} />)}
    </div>
  );
};

/** Logo de herramienta en cuadrado redondeado que flota (muy suave). */
export const IconoApp: React.FC<{logo: string; f: number; tam?: number}> = ({logo, f, tam = 220}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flota = frame > f ? Math.sin(((frame - f) / fps) * Math.PI * 0.8) * 6 : 0;
  return (
    <div style={{transform: `translateY(${flota}px)`}}>
      <div style={{width: tam, height: tam, borderRadius: tam * 0.24, background: C.blanco, boxShadow: SOMBRA, display: 'flex', alignItems: 'center', justifyContent: 'center', ...entrada(frame, f, 6, 20)}}>
        <Img src={urlLogo(logo)} style={{width: '60%', height: '60%', objectFit: 'contain'}} />
      </div>
    </div>
  );
};

// ---------- Captura ----------
type Caja = {x: number; y: number; w: number; h: number; f: number}; // fracciones de la imagen (0 a 1)
/** Recuadro azul eléctrico (8 px, radio 20) que se dibuja alrededor del dato. */
export const Recuadro: React.FC<{caja: Caja; W: number; H: number}> = ({caja, W, H}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, caja.f, 12, enInOut);
  const m = 10;
  const x = caja.x * W - m, y = caja.y * H - m, w = caja.w * W + 2 * m, h = caja.h * H + 2 * m;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <rect x={x} y={y} width={w} height={h} rx={20} fill="none" stroke={C.electrico} strokeWidth={8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={p > 0 ? 1 : 0} />
    </svg>
  );
};
/** Marcador lima que barre detrás del texto importante de la captura. */
export const Marcador: React.FC<{caja: Caja; W: number; H: number}> = ({caja, W, H}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, caja.f, 8, enInOut);
  return <div style={{position: 'absolute', left: caja.x * W - 4, top: caja.y * H, width: caja.w * W + 8, height: caja.h * H, background: C.lima, mixBlendMode: 'multiply', borderRadius: 6, transform: `scaleX(${p})`, transformOrigin: 'left center'}} />;
};

/** Captura: entra con escala 1,08→1, luego zoom lento hacia el dato; Recuadro, Marcador e IconoApp encima. */
export const Captura: React.FC<{imagen: string; carpeta: string; aspecto?: number; f: number; dur: number; recuadro?: Caja; marcador?: Caja; icono?: {logo: string; f: number}; gigante?: {texto: string; f: number}; anchoMax: number; altoMax: number}> = ({imagen, carpeta, aspecto = 1.6, f, dur, recuadro, marcador, icono, gigante, anchoMax, altoMax}) => {
  const frame = useCurrentFrame();
  const altoGigante = gigante ? 250 : 0;
  let W = anchoMax;
  let H = W / aspecto;
  const hMax = altoMax - altoGigante;
  if (H > hMax) {
    H = hMax;
    W = H * aspecto;
  }
  const e = prog(frame, f, 10);
  const zoom = interpolate(frame, [f + 10, dur], [1, 1.05], k);
  const escala = (1.08 - 0.08 * e) * zoom;
  const foco = recuadro ? `${(recuadro.x + recuadro.w / 2) * 100}% ${(recuadro.y + recuadro.h / 2) * 100}%` : 'center';
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {gigante && (
        <div style={{height: altoGigante, display: 'flex', alignItems: 'flex-start'}}>
          <Texto texto={gigante.texto} f={gigante.f} tam={150} />
        </div>
      )}
      <div style={{position: 'relative', width: W, height: H}}>
        <div style={{width: W, height: H, borderRadius: 24, overflow: 'hidden', background: C.blanco, boxShadow: SOMBRA, opacity: e}}>
          <div style={{position: 'relative', width: W, height: H, transform: `scale(${escala})`, transformOrigin: foco}}>
            <Img src={staticFile(`${carpeta}/${imagen}`)} style={{width: W, height: H, objectFit: 'cover', display: 'block'}} />
            {marcador && <Marcador caja={marcador} W={W} H={H} />}
            {recuadro && <Recuadro caja={recuadro} W={W} H={H} />}
          </div>
        </div>
        {icono && (
          <div style={{position: 'absolute', right: 28, top: -60}}>
            <IconoApp logo={icono.logo} f={icono.f} tam={150} />
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Nodos ----------
type Nodo = {texto?: string; logo?: string; f: number};
const CajaNodo: React.FC<{n: {texto?: string; logo?: string}; centro?: boolean}> = ({n, centro}) =>
  n.logo ? (
    <div style={{width: centro ? 150 : 120, height: centro ? 150 : 120, borderRadius: 28, background: C.blanco, boxShadow: SOMBRA, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Img src={urlLogo(n.logo)} style={{width: '60%', height: '60%', objectFit: 'contain'}} />
    </div>
  ) : (
    <div style={{padding: centro ? '22px 36px' : '16px 26px', borderRadius: centro ? 999 : 18, background: centro ? C.electrico : C.blanco, boxShadow: SOMBRA, ...poppins(centro ? 700 : 500, centro ? 44 : 36, centro ? C.blanco : C.medianoche), whiteSpace: 'nowrap', lineHeight: 1}}>{n.texto}</div>
  );
const POS: Record<number, [number, number][]> = {
  1: [[1, 0]],
  2: [[-1, 0], [1, 0]],
  3: [[-1, -1], [1, -1], [0, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
};
/** Diagrama: centro y nodos alrededor; las líneas azul eléctrico se dibujan solas. */
export const Nodos: React.FC<{centro: {texto?: string; logo?: string}; nodos: Nodo[]; f: number; alto: number}> = ({centro, nodos, f, alto}) => {
  const frame = useCurrentFrame();
  const W = AREA_ANCHO;
  const cx = W / 2, cy = alto / 2;
  const pos = POS[Math.min(4, Math.max(1, nodos.length))];
  const dx = W / 2 - 130, dy = alto / 2 - 60;
  return (
    <div style={{position: 'relative', width: W, height: alto}}>
      <svg width={W} height={alto} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {nodos.map((n, i) => {
          const [px, py] = pos[i] ?? [0, 0];
          const p = prog(frame, n.f, 10, enInOut);
          const x = cx + px * dx, y = cy + py * dy;
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={cx + (x - cx) * p} y2={cy + (y - cy) * p} stroke={C.electrico} strokeWidth={5} strokeLinecap="round" />
              <circle cx={cx + (x - cx) * p} cy={cy + (y - cy) * p} r={p > 0 && p < 1 ? 9 : 0} fill={C.electrico} />
            </g>
          );
        })}
      </svg>
      {nodos.map((n, i) => {
        const [px, py] = pos[i] ?? [0, 0];
        return (
          <div key={i} style={{position: 'absolute', left: cx + px * dx, top: cy + py * dy, transform: 'translate(-50%, -50%)'}}>
            <div style={entrada(frame, n.f + 8, 5)}>
              <CajaNodo n={n} />
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: cx, top: cy, transform: 'translate(-50%, -50%)'}}>
        <div style={entrada(frame, f, 5)}>
          <CajaNodo n={centro} centro />
        </div>
      </div>
    </div>
  );
};

// ---------- Comparacion ----------
type Lado = {titulo?: string; texto: string; f: number};
/** Dos tarjetas: la mala en gris y tachada, la buena con borde lima. */
export const Comparacion: React.FC<{mal: Lado; bien: Lado; fTachado: number}> = ({mal, bien, fTachado}) => {
  const frame = useCurrentFrame();
  const t = prog(frame, fTachado, 8, enInOut);
  const tarjeta = (lado: Lado, buena: boolean) => (
    <div style={{width: 370, boxSizing: 'border-box', padding: '30px 30px 34px', borderRadius: 28, background: C.blanco, border: buena ? `6px solid ${C.lima}` : `3px solid ${C.gris}`, boxShadow: buena ? SOMBRA : 'none', display: 'flex', flexDirection: 'column', gap: 18, ...entrada(frame, lado.f, 6, 20)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 52, height: 52, borderRadius: 26, background: buena ? C.lima : 'transparent', border: buena ? 'none' : `3px solid ${C.gris}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IconoLinea nombre={buena ? 'check' : 'x'} tam={30} color={buena ? C.medianoche : C.gris} grosor={2.8} />
        </div>
        <div style={{...poppins(500, 32, buena ? C.medianoche : C.gris), lineHeight: 1}}>{lado.titulo ?? (buena ? 'después' : 'antes')}</div>
      </div>
      <div style={{...poppins(700, 50, buena ? C.medianoche : C.gris), lineHeight: 1.1}}>
        {buena ? (
          lado.texto
        ) : (
          // tachado que se dibuja de izquierda a derecha en cada línea
          <span style={{backgroundImage: `linear-gradient(${C.gris}, ${C.gris})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 58%', backgroundSize: `${t * 100}% 6px`, WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone'}}>{lado.texto}</span>
        )}
      </div>
    </div>
  );
  return (
    <div style={{display: 'flex', gap: 44, alignItems: 'stretch'}}>
      {tarjeta(mal, false)}
      {tarjeta(bien, true)}
    </div>
  );
};

// ---------- Destello ----------
/** Luz blanca y lima suave de 8 fotogramas entre bloques grandes (máximo una cada 12 s). */
export const Destello: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 4, 8], [0, 1, 0], k);
  return (
    <AbsoluteFill style={{opacity: o, pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.98) 0%, rgba(200,245,66,0.30) 46%, rgba(255,255,255,0) 78%)'}} />
      <AbsoluteFill style={{background: C.blanco, opacity: 0.55}} />
    </AbsoluteFill>
  );
};

// ---------- Cta ----------
/** "comenta" + palabra en pastilla lima + chip de comentario que se escribe solo. */
export const Cta: React.FC<{palabra: string; f: number; fChip: number; fEscribe: number; porLetra: number; fEnvia: number}> = ({palabra, f, fChip, fEscribe, porLetra, fEnvia}) => {
  const frame = useCurrentFrame();
  const letras = Math.max(0, Math.min(palabra.length, Math.floor((frame - fEscribe) / porLetra) + 1));
  const escrito = frame >= fEscribe ? palabra.slice(0, letras) : '';
  const cursor = frame < fEnvia && Math.floor(frame / 8) % 2 === 0;
  const pulso = interpolate(frame, [fEnvia, fEnvia + 3, fEnvia + 7], [1, 1.06, 1], k);
  const enviado = frame >= fEnvia;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
        <span style={{...poppins(700, 92), lineHeight: 1, ...entrada(frame, f)}}>comenta</span>
        <span style={{...poppins(700, 92), lineHeight: 1, background: C.lima, borderRadius: 999, padding: '14px 40px 10px', ...entrada(frame, f + 4, 6)}}>{palabra}</span>
      </div>
      <div style={{width: 640, height: 112, boxSizing: 'border-box', borderRadius: 24, background: C.blanco, boxShadow: SOMBRA, display: 'flex', alignItems: 'center', gap: 20, padding: '0 22px', ...desdeAbajo(frame, fChip, 30)}}>
        <div style={{width: 62, height: 62, borderRadius: 31, border: `3px solid ${C.gris}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IconoLinea nombre="usuario" tam={34} color={C.gris} />
        </div>
        <div style={{flex: 1, display: 'flex', alignItems: 'center', ...poppins(500, 42, escrito ? C.medianoche : C.gris), lineHeight: 1}}>
          {escrito || 'agrega un comentario'}
          {escrito && <span style={{width: 4, height: 46, marginLeft: 6, background: C.electrico, opacity: cursor ? 1 : 0}} />}
        </div>
        <div style={{width: 66, height: 66, borderRadius: 33, background: enviado ? C.lima : 'rgba(138,148,166,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pulso})`}}>
          <IconoLinea nombre="enviar" tam={36} color={C.medianoche} grosor={2.8} />
        </div>
      </div>
    </div>
  );
};

// ---------- Firma ----------
/** "JPR" con texto (Poppins Bold, espaciado 0,08 em) y raya lima de 120×8 que se dibuja de izquierda a derecha. */
export const Firma: React.FC<{f: number}> = ({f}) => {
  const frame = useCurrentFrame();
  const r = prog(frame, f + 8, 10, enInOut);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, ...entrada(frame, f, 6)}}>
      <div style={{...poppins(700, 150), lineHeight: 1, letterSpacing: '0.08em', paddingLeft: '0.08em'}}>JPR</div>
      <div style={{width: 120, height: 8, borderRadius: 4, background: C.lima, transform: `scaleX(${r})`, transformOrigin: 'left center'}} />
    </div>
  );
};

// ---------- Escena: arma cada tramo según escenas.json ----------
/** Coloca la pieza en su zona (mitad: y 300–900 · completa: y 300–1520) y la saca con desvanecido y desenfoque en 6 fotogramas. */
export const Escena: React.FC<{e: EscenaPlan; carpeta: string; final?: boolean}> = ({e, carpeta, final}) => {
  const frame = useCurrentFrame();
  // la última escena del reel (la firma) se queda hasta el último fotograma
  const salida = final ? 1 : interpolate(frame, [e.dur - 6, e.dur], [1, 0], k);
  const blur = final ? 0 : interpolate(frame, [e.dur - 6, e.dur], [0, 12], k);
  const grande = e.tramo === 'completa';
  const zona = ZONA[grande ? 'completa' : 'mitad'];
  const arriba = e.insignia ? zona.arriba + 72 + 40 : zona.arriba;
  const alto = zona.abajo - arriba;
  const d = e.d;
  const tamTexto = e.pieza === 'Texto' || !e.pieza ? (grande ? 100 : 96) : grande ? 88 : 76;

  let visual: React.ReactNode = null;
  switch (e.pieza) {
    case 'Chip':
      visual = <Chip texto={d.texto} icono={d.icono} f={d.f} tam={grande ? 52 : 44} />;
      break;
    case 'PilaChips':
      visual = <PilaChips chips={d.chips} actual={d.actual} tam={grande ? 52 : 42} />;
      break;
    case 'Barra':
      visual = <Barra etiqueta={d.etiqueta} f={d.f} fLleno={d.fLleno} hasta={d.hasta} />;
      break;
    case 'Cifra':
      visual = <Cifra valor={d.valor} decimales={d.decimales} prefijo={d.prefijo} sufijo={d.sufijo} etiqueta={d.etiqueta} f={d.f} tam={grande ? 260 : 220} />;
      break;
    case 'Grafica':
      visual = <Grafica tipo={d.tipo} valores={d.valores} etiquetas={d.etiquetas} f={d.f} alto={grande ? 420 : 260} />;
      break;
    case 'TarjetaLogo':
      visual = <FilaLogos logos={d.logos} grande={grande} />;
      break;
    case 'IconoApp':
      visual = <IconoApp logo={d.logo} f={d.f} tam={grande ? 300 : 240} />;
      break;
    case 'Captura':
      visual = <Captura imagen={d.imagen} carpeta={carpeta} aspecto={d.aspecto} f={d.f} dur={e.dur} recuadro={d.recuadro} marcador={d.marcador} icono={d.icono} gigante={d.gigante} anchoMax={grande ? AREA_ANCHO : 680} altoMax={alto - (e.texto ? 130 : 0) - (d.icono ? 60 : 0)} />;
      break;
    case 'Nodos':
      visual = <Nodos centro={d.centro ?? {texto: ''}} nodos={d.nodos} f={d.f} alto={grande ? 640 : e.texto ? 330 : 440} />;
      break;
    case 'Comparacion':
      visual = <Comparacion mal={d.mal} bien={d.bien} fTachado={d.fTachado} />;
      break;
    case 'Cta':
      visual = <Cta palabra={d.palabra} f={d.f} fChip={d.fChip} fEscribe={d.fEscribe} porLetra={d.porLetra} fEnvia={d.fEnvia} />;
      break;
    case 'Firma':
      visual = <Firma f={d.f} />;
      break;
    default:
      break;
  }
  // Una cifra suele ir con una gráfica debajo (métrica de marketing): "datos.grafica".
  const extra = e.pieza === 'Cifra' && d.grafica ? <Grafica tipo={d.grafica.tipo ?? 'barras'} valores={d.grafica.valores} etiquetas={d.grafica.etiquetas} f={d.f + 10} alto={grande ? 300 : 160} /> : null;

  return (
    <AbsoluteFill style={{opacity: salida, filter: blur ? `blur(${blur}px)` : undefined, clipPath: grande ? undefined : 'inset(0 0 980px 0)'}}>
      {e.insignia && (
        <div style={{position: 'absolute', top: zona.arriba, left: AREA_X, width: AREA_ANCHO, display: 'flex', justifyContent: 'center'}}>
          <Insignia {...e.insignia} />
        </div>
      )}
      <div style={{position: 'absolute', top: arriba, left: AREA_X, width: AREA_ANCHO, height: alto, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: grande ? 56 : 40}}>
        {visual}
        {extra}
        {e.texto && <Texto texto={e.texto} f={e.textoF} tam={tamTexto} />}
      </div>
    </AbsoluteFill>
  );
};
