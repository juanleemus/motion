// Piezas reutilizables de la marca JPR (Juan Pablo Ramos).
// Todas trabajan con el fotograma relativo a su <Sequence>; los tiempos van en fotogramas.
// Reglas de marca: solo la paleta JPR, Poppins / Lora Italic (acento) / Open Sans (texto largo),
// rebote máximo del 6 %, nada gira más de 3°, íconos de línea.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const JPR = {
  navy: '#0A1F44',
  azul: '#2F5FFF',
  lima: '#C8F542',
  blanco: '#FFFFFF',
  gris: '#8A94A6',
} as const;

export const POPPINS = 'Poppins';
export const LORA = 'Lora';
export const OPEN_SANS = 'Open Sans';
export const SOMBRA_VIDEO = '0 4px 14px rgba(0,0,0,0.85)';
const SOMBRA_TARJETA = '0 18px 44px rgba(10,31,68,0.16), 0 3px 10px rgba(10,31,68,0.08)';

// Zonas seguras de Instagram: contenido entre x 70–930 y entre y 300–1520.
export const SEGURA = {x0: 70, x1: 930, y0: 300, y1: 1520} as const;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const salidaSuave = Easing.bezier(0.22, 1, 0.36, 1);

// Muelle con rebote de ~3 % (amortiguación 0,75): firme, nunca elástico.
export const useEntrada = (retraso = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - retraso, fps, config: {damping: 20, stiffness: 180, mass: 1}});
};

// ---------------------------------------------------------------- íconos de línea
const TRAZOS: Record<string, React.ReactNode> = {
  alerta: (<><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4" /><path d="M12 17h.01" /></>),
  candado: (<><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>),
  megafono: (<><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></>),
  usuario: (<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  usuarios: (<><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0" /><path d="M16 4.2a4 4 0 0 1 0 7.6" /><path d="M22 21a7 7 0 0 0-4-6.3" /></>),
  edificio: (<><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1" /><path d="M10 21v-3h4v3" /></>),
  enlace: (<><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></>),
  pin: (<><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>),
  etiqueta: (<><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></>),
  seguir: (<><circle cx="10" cy="8" r="4" /><path d="M2 21a8 8 0 0 1 16 0" /><path d="M19 8v6M16 11h6" /></>),
  reloj: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  bloqueo: (<><circle cx="12" cy="12" r="9" /><path d="M5.6 5.6l12.8 12.8" /></>),
  buscar: (<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>),
  grafica: (<><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 5-6" /></>),
  corte: (<><path d="M18 6 6 18" /><path d="M6 6l12 12" /></>),
};
export type NombreIcono = keyof typeof TRAZOS;

export const Icono: React.FC<{nombre: NombreIcono; size?: number; color?: string; grosor?: number}> = ({nombre, size = 44, color = JPR.lima, grosor = 2}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round">
    {TRAZOS[nombre]}
  </svg>
);

// ---------------------------------------------------------------- fondos y formatos
// Fondo blanco con cuadrícula de x; zoom muy lento de 1 a 1,06 durante `dur` fotogramas.
export const FondoX: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, dur], [1, 1.06], clamp);
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: JPR.blanco}}>
      <Img src={staticFile('fondo-x.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${s})`}} />
    </AbsoluteFill>
  );
};

// Salida: desvanecido y desenfoque en 6 fotogramas al final de `dur`.
export const Salida: React.FC<{dur: number; children: React.ReactNode; frames?: number}> = ({dur, children, frames = 6}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [dur - frames, dur], [0, 1], clamp);
  return <AbsoluteFill style={{opacity: 1 - p, filter: p > 0 ? `blur(${p * 14}px)` : undefined}}>{children}</AbsoluteFill>;
};

// Formato B: mitad de arriba (y 0–960) con fondo x; baja desde arriba en 8 fotogramas y sale igual hacia arriba.
export const Split: React.FC<{dur: number; children?: React.ReactNode}> = ({dur, children}) => {
  const frame = useCurrentFrame();
  const entra = interpolate(frame, [0, 8], [-960, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const sale = interpolate(frame, [dur - 8, dur], [0, -960], {...clamp, easing: Easing.in(Easing.cubic)});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 960, overflow: 'hidden', transform: `translateY(${frame < dur / 2 ? entra : sale}px)`}}>
        <FondoX dur={dur} />
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Formato C: gráfico completo sobre fondo x. Entra con un fundido corto y sale con desvanecido + desenfoque.
export const Completo: React.FC<{dur: number; children?: React.ReactNode}> = ({dur, children}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 4], [0, 1], clamp);
  return (
    <Salida dur={dur}>
      <AbsoluteFill style={{opacity: o}}>
        <FondoX dur={dur} />
        {children}
      </AbsoluteFill>
    </Salida>
  );
};

// ---------------------------------------------------------------- texto
export type Superficie = 'video' | 'blanco';
export type PalabraSub = {texto: string; acento?: 'color' | 'lora'};

// Palabra de acento. Sobre video: lima o Lora Italic. Sobre blanco: azul eléctrico o Lora Italic.
export const Acento: React.FC<{texto: string; tipo: 'color' | 'lora'; superficie: Superficie; retraso?: number}> = ({texto, tipo, superficie, retraso = 0}) => {
  const frame = useCurrentFrame();
  if (tipo === 'color') return <span style={{color: superficie === 'video' ? JPR.lima : JPR.azul}}>{texto}</span>;
  const b = interpolate(frame - retraso, [0, 6], [8, 0], clamp);
  return (
    <span style={{fontFamily: LORA, fontStyle: 'italic', fontWeight: 600, fontSize: '1.147em', filter: b > 0 ? `blur(${b}px)` : undefined, display: 'inline-block'}}>
      {texto}
    </span>
  );
};

// Bloque de subtítulo: 1 a 3 palabras, una línea, Poppins Bold 68 px, centrado en `y`.
// Entra en 4 fotogramas (opacidad 0→1, escala 0,92→1, sube 12 px) y se cambia en seco por el siguiente.
export const Subtitulo: React.FC<{palabras: PalabraSub[]; superficie: Superficie; y: number}> = ({palabras, superficie, y}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 4], [0, 1], {...clamp, easing: salidaSuave});
  const enVideo = superficie === 'video';
  return (
    <div style={{
      position: 'absolute', left: SEGURA.x0, width: SEGURA.x1 - SEGURA.x0, top: y, height: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: POPPINS, fontWeight: 700, fontSize: 68, lineHeight: 1, whiteSpace: 'nowrap',
        color: enVideo ? JPR.blanco : JPR.navy, textShadow: enVideo ? SOMBRA_VIDEO : 'none',
        opacity: p, transform: `translateY(${(1 - p) * 12}px) scale(${0.92 + 0.08 * p})`,
      }}>
        {palabras.map((w, i) => (
          <React.Fragment key={i}>
            {i > 0 ? ' ' : ''}
            {w.acento ? <Acento texto={w.texto} tipo={w.acento} superficie={superficie} /> : w.texto}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Marcador lima que barre de izquierda a derecha detrás del texto (el texto queda encima en azul medianoche).
export const Marcador: React.FC<{children: React.ReactNode; retraso?: number; dur?: number}> = ({children, retraso = 0, dur = 8}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - retraso, [0, dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <span style={{position: 'relative', display: 'inline-block', padding: '0 0.12em'}}>
      <span style={{position: 'absolute', left: 0, right: 0, top: '22%', bottom: '8%', background: JPR.lima, borderRadius: 6, transform: `scaleX(${p})`, transformOrigin: 'left center'}} />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};

// Palabra gigante (Poppins Bold 150 px) que aparece al ritmo de la voz.
export const PalabraGigante: React.FC<{children: React.ReactNode; superficie?: Superficie; size?: number}> = ({children, superficie = 'blanco', size = 150}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 4], [0, 1], {...clamp, easing: salidaSuave});
  return (
    <div style={{
      fontFamily: POPPINS, fontWeight: 700, fontSize: size, lineHeight: 1, letterSpacing: '-0.02em', whiteSpace: 'nowrap',
      color: superficie === 'video' ? JPR.blanco : JPR.navy, textShadow: superficie === 'video' ? SOMBRA_VIDEO : 'none',
      opacity: p, transform: `translateY(${(1 - p) * 16}px) scale(${0.94 + 0.06 * p})`,
    }}>
      {children}
    </div>
  );
};

// Etiqueta gris (lo secundario o lo que "no").
export const Etiqueta: React.FC<{children: React.ReactNode; size?: number; retraso?: number}> = ({children, size = 40, retraso = 0}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - retraso, [0, 6], [0, 1], clamp);
  return <div style={{fontFamily: POPPINS, fontWeight: 500, fontSize: size, color: JPR.gris, opacity: o, whiteSpace: 'nowrap'}}>{children}</div>;
};

// ---------------------------------------------------------------- piezas de interfaz
// Chip: tarjeta azul medianoche con ícono de línea lima y texto blanco. Entra desde abajo; se apila girado (±2°).
// `escribe`: el texto se escribe solo durante esos fotogramas (con tecleo).
export const Chip: React.FC<{icono: NombreIcono; texto: string; rot?: number; retraso?: number; escribe?: number; size?: number; resalta?: string}> = ({
  icono, texto, rot = 0, retraso = 0, escribe, size = 44, resalta,
}) => {
  const frame = useCurrentFrame();
  const p = useEntrada(retraso);
  const o = interpolate(frame - retraso, [0, 4], [0, 1], clamp);
  const n = escribe ? Math.round(interpolate(frame - retraso - 4, [0, escribe], [0, texto.length], clamp)) : texto.length;
  const visible = texto.slice(0, n);
  const largo = texto.split(' ').length > 6;
  const partes = resalta && visible.includes(resalta) ? visible.split(resalta) : null;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 20, padding: '22px 34px 22px 28px',
      background: JPR.navy, borderRadius: 18, boxShadow: SOMBRA_TARJETA,
      opacity: o, transform: `translateY(${(1 - p) * 70}px) rotate(${Math.max(-2, Math.min(2, rot))}deg)`,
    }}>
      <Icono nombre={icono} size={size + 4} />
      <span style={{
        fontFamily: largo ? OPEN_SANS : POPPINS, fontWeight: 600, fontSize: largo ? 32 : size, color: JPR.blanco, whiteSpace: 'nowrap',
        minWidth: escribe ? `${texto.length * 0.56}em` : undefined,
      }}>
        {partes ? (<>{partes[0]}<span style={{color: JPR.lima}}>{resalta}</span>{partes[1]}</>) : visible}
        {escribe && n < texto.length && frame - retraso > 3 ? <span style={{color: JPR.lima}}>|</span> : null}
      </span>
    </div>
  );
};

// Logo en tarjeta blanca redondeada (radio 28) con sombra suave. Entra en la palabra exacta en que se nombra la marca.
export const TarjetaLogo: React.FC<{logo: string; size?: number; etiqueta?: string; retraso?: number; apagado?: number}> = ({logo, size = 220, etiqueta, retraso = 0, apagado = 0}) => {
  const frame = useCurrentFrame();
  const p = useEntrada(retraso);
  const o = interpolate(frame - retraso, [0, 4], [0, 1], clamp);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: o * (1 - apagado * 0.25), transform: `scale(${0.86 + 0.14 * p})`}}>
      <div style={{width: size, height: size, borderRadius: 28, background: JPR.blanco, boxShadow: SOMBRA_TARJETA, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: apagado ? `grayscale(${apagado})` : undefined}}>
        <Img src={staticFile(`logos/${logo}.svg`)} style={{width: size * 0.6, height: size * 0.6, objectFit: 'contain'}} />
      </div>
      {etiqueta ? <div style={{fontFamily: POPPINS, fontWeight: 600, fontSize: Math.max(34, size * 0.17), color: JPR.navy, whiteSpace: 'nowrap'}}>{etiqueta}</div> : null}
    </div>
  );
};

// Ícono de herramienta: su logo en un cuadrado redondeado que flota encima de una captura.
export const IconoApp: React.FC<{logo: string; size?: number; retraso?: number}> = ({logo, size = 150, retraso = 0}) => {
  const frame = useCurrentFrame();
  const p = useEntrada(retraso);
  const flota = Math.sin((frame - retraso) / 18) * 6;
  return (
    <div style={{width: size, height: size, borderRadius: size * 0.24, background: JPR.blanco, boxShadow: SOMBRA_TARJETA, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, p * 1.5), transform: `translateY(${flota + (1 - p) * 40}px)`}}>
      <Img src={staticFile(`logos/${logo}.svg`)} style={{width: size * 0.62, height: size * 0.62, objectFit: 'contain'}} />
    </div>
  );
};

// Captura de una web: entra con escala 1,08→1 y luego un zoom lento.
export const Captura: React.FC<{src: string; dur: number; ancho?: number}> = ({src, dur, ancho = 940}) => {
  const frame = useCurrentFrame();
  const entra = interpolate(frame, [0, 10], [1.08, 1], {...clamp, easing: salidaSuave});
  const zoom = interpolate(frame, [10, dur], [1, 1.05], clamp);
  return (
    <div style={{width: ancho, borderRadius: 22, overflow: 'hidden', boxShadow: SOMBRA_TARJETA, transform: `scale(${entra * zoom})`, opacity: interpolate(frame, [0, 4], [0, 1], clamp)}}>
      <Img src={staticFile(src)} style={{width: '100%', display: 'block'}} />
    </div>
  );
};

// Recuadro azul eléctrico (4 px, radio 14) que se dibuja alrededor del dato.
export const Recuadro: React.FC<{x: number; y: number; w: number; h: number; retraso?: number; dur?: number}> = ({x, y, w, h, retraso = 0, dur = 12}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - retraso, [0, dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const per = 2 * (w + h);
  return (
    <svg style={{position: 'absolute', left: x - 4, top: y - 4, overflow: 'visible'}} width={w + 8} height={h + 8}>
      <rect x={4} y={4} width={w} height={h} rx={14} fill="none" stroke={JPR.azul} strokeWidth={4} strokeDasharray={per} strokeDashoffset={per * (1 - p)} />
    </svg>
  );
};

// Línea de un diagrama de nodos: se dibuja sola entre dos puntos (azul eléctrico).
// `resalta`: fotograma en que se vuelve lima. `corte`: fotograma en que se rompe por la mitad y pasa a gris.
export const Linea: React.FC<{x1: number; y1: number; x2: number; y2: number; retraso?: number; dur?: number; resalta?: number; corte?: number; grosor?: number}> = ({
  x1, y1, x2, y2, retraso = 0, dur = 14, resalta, corte, grosor = 8,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - retraso, [0, dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const L = Math.hypot(x2 - x1, y2 - y1);
  const lima = resalta !== undefined && frame >= resalta && (corte === undefined || frame < corte);
  const pc = corte !== undefined ? interpolate(frame - corte, [0, 6], [0, 1], {...clamp, easing: salidaSuave}) : 0;
  const color = pc > 0 ? JPR.gris : lima ? JPR.lima : JPR.azul;
  const ux = (x2 - x1) / L, uy = (y2 - y1) / L;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const hueco = pc * 70;
  const brillo = lima ? interpolate(frame - (resalta ?? 0), [0, 8], [0, 1], clamp) : 0;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
      {pc > 0 ? (
        <>
          <line x1={x1} y1={y1} x2={mx - ux * hueco} y2={my - uy * hueco} stroke={color} strokeWidth={grosor} strokeLinecap="round" />
          <line x1={mx + ux * hueco} y1={my + uy * hueco} x2={x2} y2={y2} stroke={color} strokeWidth={grosor} strokeLinecap="round" />
        </>
      ) : (
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={grosor + brillo * 4} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
      )}
      <circle cx={x1} cy={y1} r={grosor * 1.4} fill={pc > 0 ? JPR.gris : JPR.azul} opacity={p > 0 ? 1 : 0} />
      <circle cx={x2} cy={y2} r={grosor * 1.4} fill={pc > 0 ? JPR.gris : JPR.azul} opacity={p >= 1 ? 1 : 0} />
    </svg>
  );
};

// Diagrama de nodos: puntos y líneas azul eléctrico que se dibujan solos, uno tras otro.
export const Nodos: React.FC<{puntos: {x: number; y: number}[]; retraso?: number; paso?: number}> = ({puntos, retraso = 0, paso = 10}) => (
  <AbsoluteFill>
    {puntos.slice(1).map((b, i) => (
      <Linea key={i} x1={puntos[i].x} y1={puntos[i].y} x2={b.x} y2={b.y} retraso={retraso + i * paso} dur={paso} grosor={6} />
    ))}
  </AbsoluteFill>
);

// Barra de progreso: se llena en azul eléctrico; al llegar al 100 % cambia a lima y aparece un ícono de alerta de línea.
export const Barra: React.FC<{ancho?: number; desde: number; hasta: number; etiqueta?: string}> = ({ancho = 760, desde, hasta, etiqueta}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [desde, hasta], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const lleno = frame >= hasta;
  const pa = useEntrada(hasta);
  const o = interpolate(frame, [0, 5], [0, 1], clamp);
  return (
    <div style={{width: ancho, opacity: o}}>
      {etiqueta ? <div style={{fontFamily: POPPINS, fontWeight: 600, fontSize: 42, color: JPR.navy, marginBottom: 22, whiteSpace: 'nowrap'}}>{etiqueta}</div> : null}
      <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
        <div style={{flex: 1, height: 30, borderRadius: 15, background: 'rgba(138,148,166,0.28)', overflow: 'hidden'}}>
          <div style={{width: `${p * 100}%`, height: '100%', borderRadius: 15, background: lleno ? JPR.lima : JPR.azul}} />
        </div>
        <div style={{width: 76, height: 76, borderRadius: 18, background: JPR.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: lleno ? 1 : 0, transform: `scale(${0.8 + 0.2 * pa})`}}>
          <Icono nombre="alerta" size={46} />
        </div>
      </div>
    </div>
  );
};

// Cifra gigante que cuenta hasta el valor dicho en 18 fotogramas (cada cambio suena con un tic).
export const cuentaCifra = (frame: number, valor: number, dur = 18) => Math.round(interpolate(frame, [0, dur], [0, valor], {...clamp, easing: Easing.out(Easing.cubic)}));
export const Cifra: React.FC<{valor: number; size?: number; sufijo?: string}> = ({valor, size = 260, sufijo = ''}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 3], [0, 1], clamp);
  return (
    <div style={{fontFamily: POPPINS, fontWeight: 700, fontSize: size, lineHeight: 0.9, color: JPR.navy, letterSpacing: '-0.03em', opacity: o, fontVariantNumeric: 'tabular-nums'}}>
      {cuentaCifra(frame, valor)}{sufijo}
    </div>
  );
};

// Destello: luz blanca y lima suave de 8 fotogramas entre bloques grandes (máximo uno cada 12 s).
export const Destello: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 3, 8], [0, 0.85, 0], clamp);
  return (
    <AbsoluteFill style={{
      opacity: o,
      background: 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 35%, rgba(200,245,66,0.45) 70%, rgba(200,245,66,0) 100%)',
    }} />
  );
};

// CTA: pastilla lima con la palabra (texto azul medianoche) y un ícono de línea. A los 10 fotogramas se "pulsa" (clic).
export const Cta: React.FC<{palabra: string; icono?: NombreIcono}> = ({palabra, icono = 'seguir'}) => {
  const frame = useCurrentFrame();
  const p = useEntrada(0);
  const pulsa = interpolate(frame, [10, 13, 17], [1, 0.95, 1], clamp);
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 18, padding: '20px 44px 20px 34px', borderRadius: 999,
      background: JPR.lima, boxShadow: '0 10px 30px rgba(10,31,68,0.35)',
      opacity: interpolate(frame, [0, 4], [0, 1], clamp), transform: `translateY(${(1 - p) * 40}px) scale(${(0.9 + 0.1 * p) * pulsa})`,
    }}>
      <Icono nombre={icono} size={54} color={JPR.navy} grosor={2.4} />
      <span style={{fontFamily: POPPINS, fontWeight: 700, fontSize: 60, color: JPR.navy, letterSpacing: '0.02em'}}>{palabra}</span>
    </div>
  );
};

// Firma: "JPR" en Poppins Bold (espaciado 0,08 em) con una raya lima de 120×8 px que se dibuja de izquierda a derecha.
export const Firma: React.FC<{superficie?: Superficie; size?: number; retraso?: number}> = ({superficie = 'blanco', size = 140, retraso = 0}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - retraso, [0, 6], [0, 1], clamp);
  const raya = interpolate(frame - retraso, [6, 16], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: o}}>
      <div style={{
        fontFamily: POPPINS, fontWeight: 700, fontSize: size, letterSpacing: '0.08em', marginRight: '-0.08em', lineHeight: 1,
        color: superficie === 'video' ? JPR.blanco : JPR.navy, textShadow: superficie === 'video' ? SOMBRA_VIDEO : 'none',
        transform: `translateY(${(1 - o) * 10}px)`,
      }}>JPR</div>
      <div style={{width: 120, height: 8, borderRadius: 4, background: JPR.lima, transform: `scaleX(${raya})`, transformOrigin: 'left center'}} />
    </div>
  );
};
