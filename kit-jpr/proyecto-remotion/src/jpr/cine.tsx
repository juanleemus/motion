// Piezas de impacto JPR (ESTILO.md §5b): palabras que golpean, pantallas que se usan, video, personas y clips.
// Misma paleta y letras que ui.tsx. Todo derecho, sin rotaciones ni temblores; el "poder" sale de la escala,
// el contraste (superficie oscura) y el ritmo, no de efectos de caricatura.
import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {AREA_ANCHO, C, LORA, POPPINS, SOMBRA} from './tema';
import {partesTexto} from './plan';
import {urlLogo} from './ui';

const k = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const suave = Easing.bezier(0.22, 1, 0.36, 1);
const enInOut = Easing.bezier(0.65, 0, 0.35, 1);
const prog = (frame: number, f: number, dur: number, easing = suave) => interpolate(frame, [f, f + dur], [0, 1], {...k, easing});
const ya = (frame: number, f: number | undefined) => f !== undefined && frame >= f;

/** true dentro de una escena con fondo oscuro: los textos pasan a blanco y los acentos a lima. */
export const Oscuro = createContext(false);
export const useTinta = () => (useContext(Oscuro) ? C.blanco : C.medianoche);

const poppins = (peso: 500 | 700, tam: number, color: string): React.CSSProperties => ({fontFamily: POPPINS, fontWeight: peso, fontSize: tam, color, lineHeight: 1.1});

// ---------- íconos de línea extra ----------
const TRAZOS = {
  link: (<><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2" /><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" /></>),
  estrella: <path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6-4.5-4.2 6.1-.8z" />,
  chispa: (<><path d="M12 3c.6 4.3 2.7 6.4 7 7-4.3.6-6.4 2.7-7 7-.6-4.3-2.7-6.4-7-7 4.3-.6 6.4-2.7 7-7z" /><path d="M19 15.5c.2 1.4.9 2.1 2.3 2.3-1.4.2-2.1.9-2.3 2.3-.2-1.4-.9-2.1-2.3-2.3 1.4-.2 2.1-.9 2.3-2.3z" /></>),
  lupa: (<><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></>),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  usuario: (<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>),
  rayo: <path d="M13 2.5 4.5 14H12l-1 7.5L19.5 10H12z" />,
  enviar: (<><path d="M21 3 10 14" /><path d="M21 3l-7 18-4-7-7-4z" /></>),
};
export const Linea: React.FC<{n: keyof typeof TRAZOS; tam?: number; color?: string; grosor?: number; relleno?: string}> = ({n, tam = 40, color = C.lima, grosor = 2.4, relleno = 'none'}) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" fill={relleno} stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink: 0, display: 'block'}}>
    {TRAZOS[n]}
  </svg>
);

// ---------- superficie oscura ----------
/** Azul medianoche con la luz azul eléctrico del manual (superficie de impacto) y la x del fondo muy tenue. */
export const FondoOscuro: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, Math.max(1, dur)], [1, 1.1], k);
  const gx = 50 + 10 * Math.sin(frame / 36);
  return (
    <AbsoluteFill style={{background: C.medianoche, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 42% at ${gx}% 34%, rgba(47,95,255,0.62) 0%, rgba(47,95,255,0.2) 45%, rgba(10,31,68,0) 75%)`, transform: `scale(${z})`}} />
      <AbsoluteFill style={{opacity: 0.07, mixBlendMode: 'screen', filter: 'invert(1)', transform: `scale(${z})`}}>
        <Img src={staticFile('kit/fondo-x.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Palabras ----------
export type LineaPalabras = {texto: string; f: number; tam?: number; fTachar?: number; golpe?: boolean};
/** Palabras grandes que golpean al ritmo de la voz: entran de grande a su tamaño con desenfoque (7 fotogramas).
 *  Acentos: [marcador lima] · *Lora Italic* · {azul}. "tachar" dibuja una raya encima y apaga la palabra. */
export const Palabras: React.FC<{palabras: LineaPalabras[]; tam?: number; gap?: number}> = ({palabras, tam = 150, gap = 0}) => {
  const frame = useCurrentFrame();
  const oscuro = useContext(Oscuro);
  const tinta = oscuro ? C.blanco : C.medianoche;
  const acento = oscuro ? C.lima : C.electrico;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>
      {palabras.map((l, i) => {
        const t = l.tam ?? tam;
        const p = prog(frame, l.f, 7);
        const o = prog(frame, l.f, 2, Easing.linear);
        const esc = (l.golpe ? 1.35 : 1.16) - (l.golpe ? 0.35 : 0.16) * p;
        const blur = (1 - p) * (l.golpe ? 14 : 8);
        const tach = l.fTachar !== undefined ? prog(frame, l.fTachar, 7, enInOut) : 0;
        return (
          <div key={i} style={{position: 'relative', opacity: o, transform: `scale(${esc})`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined, whiteSpace: 'nowrap', ...poppins(700, t, tinta), lineHeight: 1.04, letterSpacing: '-0.035em', textAlign: 'center'}}>
            <span style={{opacity: 1 - 0.55 * tach}}>
              {partesTexto(l.texto).map((s, j) => {
                if (s.estilo === 'lora')
                  return <span key={j} style={{fontFamily: LORA, fontStyle: 'italic', fontWeight: 600, fontSize: t * 1.08, color: acento, letterSpacing: '-0.01em'}}>{s.t}</span>;
                if (s.estilo === 'azul') return <span key={j} style={{color: acento}}>{s.t}</span>;
                if (s.estilo === 'marcador') {
                  const m = prog(frame, l.f + 1, 5, enInOut);
                  // sobre oscuro la palabra va en lima hasta que el marcador la cubre; luego azul medianoche encima del lima
                  return (
                    <span key={j} style={{position: 'relative', display: 'inline-block', zIndex: 0, color: oscuro && m < 0.98 ? C.lima : C.medianoche, padding: '0 0.06em'}}>
                      <span style={{position: 'absolute', left: '-0.04em', right: '-0.04em', top: '0.1em', bottom: '0.02em', background: C.lima, borderRadius: t * 0.08, transform: `scaleX(${m})`, transformOrigin: 'left center', zIndex: -1}} />
                      {s.t}
                    </span>
                  );
                }
                return <span key={j}>{s.t}</span>;
              })}
            </span>
            {l.fTachar !== undefined && (
              <div style={{position: 'absolute', left: '-4%', top: '50%', height: Math.max(10, t * 0.085), width: '108%', marginTop: -t * 0.03, background: oscuro ? C.lima : C.electrico, borderRadius: 999, transform: `scaleX(${tach})`, transformOrigin: 'left center'}} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Buscador (pantalla de Google que se usa) ----------
type Paso = {f: number} | undefined;
const barra = (w: number | string, h = 14, color = 'rgba(138,148,166,0.32)', extra: React.CSSProperties = {}) => <div style={{width: w, height: h, borderRadius: h, background: color, flexShrink: 0, ...extra}} />;
const favicon = (color: string, tam = 34) => <div style={{width: tam, height: tam, borderRadius: tam / 2, background: color, flexShrink: 0}} />;

const Resultado: React.FC<{color: string; ancho?: number; titulo?: React.ReactNode; marca?: React.ReactNode}> = ({color, ancho = 1, titulo, marca}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 12, padding: '18px 0'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      {favicon(color)}
      {barra(170 * ancho, 13)}
      {marca}
    </div>
    {titulo ?? barra(430 * ancho, 22, 'rgba(47,95,255,0.75)')}
    {barra(560 * ancho, 12)}
    {barra(420 * ancho, 12)}
  </div>
);

/** Pantalla de búsqueda dentro de un marco de celular (vista "ia", "resultados", "favoritos" o "verificado").
 *  Cada paso entra en su palabra: escribe, ia, links[], sube, toca, oficial, unica, estrellas[], verificado. */
export const Buscador: React.FC<{d: any; dur: number}> = ({d, dur}) => {
  const frame = useCurrentFrame();
  const W = 700, H = 570;
  const entra = prog(frame, d.f ?? 0, 9);
  const zoom = interpolate(frame, [0, dur], [1, 1.05], k);
  const consulta: string = d.consulta ?? 'seo';
  const fEsc = (d.escribe as Paso)?.f;
  const letras = fEsc === undefined ? consulta.length : fEsc < 0 ? consulta.length : Math.max(0, Math.min(consulta.length, Math.floor((frame - fEsc) / 2) + 1));
  const escrito = fEsc !== undefined && frame < fEsc ? '' : consulta.slice(0, letras);
  const cursor = Math.floor(frame / 7) % 2 === 0;

  const cabecera = (
    <div style={{padding: '26px 28px 10px', display: 'flex', flexDirection: 'column', gap: 18}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Img src={urlLogo('google-texto')} style={{height: 46, objectFit: 'contain'}} />
        <div style={{width: 46, height: 46, borderRadius: 23, background: C.electrico, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Linea n="usuario" tam={28} color={C.blanco} grosor={2.4} />
        </div>
      </div>
      <div style={{height: 76, borderRadius: 38, border: '2px solid rgba(138,148,166,0.35)', boxShadow: '0 6px 18px rgba(10,31,68,0.08)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 26px'}}>
        <Linea n="lupa" tam={34} color={C.gris} grosor={2.4} />
        <span style={{...poppins(500, 36, C.medianoche)}}>{escrito}</span>
        {fEsc !== undefined && <span style={{width: 3, height: 40, background: C.electrico, opacity: cursor ? 1 : 0, marginLeft: -12}} />}
      </div>
    </div>
  );

  let cuerpo: React.ReactNode = null;
  if (d.vista === 'ia') {
    const fIa = (d.ia as Paso)?.f;
    const abre = fIa === undefined ? 1 : prog(frame, fIa, 10);
    const links: Paso[] = d.links ?? [];
    const fSube = (d.sube as Paso)?.f;
    const sube = fSube === undefined ? 0 : prog(frame, fSube, 10, enInOut);
    const fToca = (d.toca as Paso)?.f;
    const toca = fToca === undefined ? 0 : prog(frame, fToca, 12);
    const colores = [C.electrico, C.medianoche, C.lima];
    const fila = (
      <div style={{display: 'flex', gap: 12, transform: `scale(${1 + 0.08 * sube})`, transformOrigin: 'left center'}}>
        {links.map((l, i) => {
          const a = l ? prog(frame, l.f, 7) : 1;
          const tocado = i === 0 && toca > 0;
          return (
            <div key={i} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 18, background: C.blanco, border: `2px solid ${tocado ? C.electrico : 'rgba(47,95,255,0.28)'}`, boxShadow: SOMBRA, opacity: a, transform: `translateY(${(1 - a) * 24}px)`}}>
              {favicon(colores[i % 3], 28)}
              {barra(52, 12)}
              <Linea n="link" tam={26} color={C.electrico} grosor={2.4} />
              {tocado && (
                <div style={{position: 'absolute', left: '50%', top: '50%', width: 150, height: 150, marginLeft: -75, marginTop: -75, borderRadius: 75, border: `5px solid ${C.electrico}`, opacity: 1 - toca, transform: `scale(${0.2 + 0.8 * toca})`}} />
              )}
            </div>
          );
        })}
      </div>
    );
    cuerpo = (
      <div style={{padding: '8px 28px', opacity: abre}}>
        <div style={{borderRadius: 26, background: 'rgba(47,95,255,0.06)', border: '2px solid rgba(47,95,255,0.22)', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16, transform: `translateY(${(1 - abre) * 30}px)`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <Linea n="chispa" tam={34} color={C.electrico} relleno="rgba(47,95,255,0.15)" grosor={2} />
            <span style={{...poppins(700, 28, C.electrico)}}>vista creada con IA</span>
          </div>
          {sube > 0 && <div style={{height: 64 * sube, marginBottom: -64 * sube}} />}
          <div style={{position: 'relative', height: 0}}>
            <div style={{position: 'absolute', top: interpolate(sube, [0, 1], [118, -4]), left: 0}}>{fila}</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: interpolate(sube, [0, 1], [0, 84]), opacity: 1 - 0.4 * sube}}>
            {barra('92%', 13)}
            {barra('84%', 13)}
            {barra('60%', 13)}
          </div>
          <div style={{height: interpolate(sube, [0, 1], [86, 6])}} />
        </div>
        <div style={{opacity: 0.5}}>
          <Resultado color={C.gris} />
        </div>
      </div>
    );
  } else if (d.vista === 'resultados') {
    const fOf = (d.oficial as Paso)?.f;
    const of = fOf === undefined ? 0 : prog(frame, fOf, 12, enInOut);
    const fUn = (d.unica as Paso)?.f;
    const un = fUn === undefined ? 0 : prog(frame, fUn, 10);
    const alto = 168;
    const insignia = (
      <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px 6px 8px', borderRadius: 999, background: C.medianoche, opacity: prog(frame, (fOf ?? 0) + 6, 6), transform: `scale(${0.9 + 0.1 * prog(frame, (fOf ?? 0) + 6, 8)})`}}>
        <div style={{width: 26, height: 26, borderRadius: 13, background: C.lima, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Linea n="check" tam={18} color={C.medianoche} grosor={3.2} />
        </div>
        <span style={{...poppins(700, 22, C.blanco)}}>sitio oficial</span>
      </div>
    );
    const filas = [
      {color: C.gris, pos: 0},
      {color: C.medianoche, pos: 1},
      {color: C.electrico, pos: 2, oficial: true},
    ];
    cuerpo = (
      <div style={{position: 'relative', margin: '6px 28px', height: alto * 3}}>
        {filas.map((r, i) => {
          const y = r.oficial ? interpolate(of, [0, 1], [r.pos * alto, 0]) : interpolate(of, [0, 1], [r.pos * alto, (r.pos + 1) * alto]);
          const apaga = r.oficial ? 1 : 1 - 0.75 * un;
          return (
            <div key={i} style={{position: 'absolute', left: 0, right: 0, top: y, opacity: apaga, borderRadius: 22, padding: r.oficial ? '0 18px' : 0, margin: r.oficial ? '0 -18px' : 0, background: r.oficial ? `rgba(200,245,66,${0.0 + 0.16 * of})` : 'transparent', border: r.oficial ? `3px solid rgba(47,95,255,${of})` : 'none', boxShadow: r.oficial && of > 0 ? SOMBRA : 'none', zIndex: r.oficial ? 2 : 1}}>
              <Resultado color={r.color} marca={r.oficial && fOf !== undefined ? insignia : undefined} />
            </div>
          );
        })}
      </div>
    );
  } else if (d.vista === 'favoritos') {
    const estrellas: Paso[] = d.estrellas ?? [];
    const colores = [C.electrico, C.medianoche, C.gris, C.electrico];
    cuerpo = (
      <div style={{margin: '4px 28px', display: 'flex', flexDirection: 'column', gap: 4}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0 10px'}}>
          <Linea n="estrella" tam={34} color={C.electrico} grosor={2.2} />
          <span style={{...poppins(700, 30, C.medianoche)}}>tus fuentes preferidas</span>
        </div>
        {colores.map((c, i) => {
          const e = estrellas[i];
          const on = e ? prog(frame, e.f, 8) : 0;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '16px 18px', borderRadius: 20, background: on > 0 ? `rgba(200,245,66,${0.18 * on})` : 'transparent', border: `2px solid rgba(138,148,166,${0.25 + 0.0 * on})`}}>
              {favicon(c, 46)}
              <div style={{display: 'flex', flexDirection: 'column', gap: 10, flex: 1}}>
                {barra(220 - i * 30, 16, 'rgba(10,31,68,0.55)')}
                {barra(320 - i * 20, 11)}
              </div>
              <div style={{transform: `scale(${1 + 0.25 * Math.sin(Math.PI * Math.min(1, on))})`}}>
                <Linea n="estrella" tam={46} color={on > 0.5 ? C.medianoche : C.gris} relleno={on > 0.5 ? C.lima : 'none'} grosor={2.2} />
              </div>
            </div>
          );
        })}
      </div>
    );
  } else if (d.vista === 'verificado') {
    const fV = (d.verificado as Paso)?.f;
    const v = fV === undefined ? 1 : prog(frame, fV, 9);
    const fO = (d.oficial as Paso)?.f;
    const o = fO === undefined ? 0 : prog(frame, fO, 9);
    cuerpo = (
      <div style={{margin: '10px 28px', borderRadius: 26, border: `3px solid rgba(47,95,255,${0.25 + 0.75 * o})`, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 18, boxShadow: SOMBRA}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div style={{width: 92, height: 92, borderRadius: 24, background: C.medianoche, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Linea n="usuario" tam={54} color={C.lima} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {barra(260, 22, 'rgba(10,31,68,0.8)')}
            {barra(180, 13)}
          </div>
          <div style={{marginLeft: 'auto', width: 74, height: 74, borderRadius: 37, background: C.blanco, boxShadow: SOMBRA, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: v, transform: `scale(${0.6 + 0.4 * v})`}}>
            <Img src={urlLogo('google')} style={{width: 44, height: 44, objectFit: 'contain'}} />
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, alignSelf: 'flex-start', padding: '10px 20px 10px 12px', borderRadius: 999, background: C.electrico, opacity: o, transform: `translateY(${(1 - o) * 16}px)`}}>
          <div style={{width: 36, height: 36, borderRadius: 18, background: C.lima, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Linea n="check" tam={24} color={C.medianoche} grosor={3.2} />
          </div>
          <span style={{...poppins(700, 30, C.blanco)}}>fuente oficial</span>
        </div>
        {barra('94%', 13)}
        {barra('70%', 13)}
      </div>
    );
  }

  return (
    <div style={{width: W + 24, height: H + 24, borderRadius: 56, background: C.medianoche, padding: 12, boxSizing: 'border-box', boxShadow: '0 30px 70px rgba(10,31,68,0.28)', opacity: entra, transform: `translateY(${(1 - entra) * 60}px) scale(${0.94 + 0.06 * entra})`}}>
      <div style={{width: W, height: H, borderRadius: 44, background: C.blanco, overflow: 'hidden', position: 'relative'}}>
        <div style={{transform: `scale(${zoom})`, transformOrigin: '50% 20%'}}>
          {cabecera}
          {cuerpo}
        </div>
      </div>
    </div>
  );
};

// ---------- Video (el nombre del creador se vuelve link) ----------
/** Tarjeta de video: miniatura que corre, "en prueba", fila del creador cuyo nombre se vuelve link y la cuenta de Google. */
export const Video: React.FC<{d: any; carpeta: string}> = ({d, carpeta}) => {
  const frame = useCurrentFrame();
  const W = 700, Hm = 360;
  const entra = prog(frame, d.f ?? 0, 9);
  const fP = (d.prueba as Paso)?.f, fC = (d.creador as Paso)?.f, fL = (d.link as Paso)?.f, fCu = (d.cuenta as Paso)?.f, fPe = (d.perfil as Paso)?.f;
  const pr = fP === undefined ? 0 : prog(frame, fP, 7);
  const cr = fC === undefined ? 1 : prog(frame, fC, 9);
  const li = fL === undefined ? 0 : prog(frame, fL, 10, enInOut);
  const cu = fCu === undefined ? 0 : prog(frame, fCu, 9);
  const pe = fPe === undefined ? 0 : prog(frame, fPe, 9);
  const avance = interpolate(frame, [0, 400], [0.12, 0.95], k);
  const toque = fL === undefined ? 0 : prog(frame, fL + 4, 12);
  return (
    <div style={{width: W, display: 'flex', flexDirection: 'column', gap: 22, opacity: entra, transform: `translateY(${(1 - entra) * 50}px)`}}>
      <div style={{position: 'relative', width: W, height: Hm, borderRadius: 32, overflow: 'hidden', background: C.medianoche, boxShadow: '0 30px 70px rgba(10,31,68,0.28)'}}>
        {d.imagen ? (
          <Medio archivo={d.imagen} carpeta={carpeta} />
        ) : (
          <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 70% at 50% 40%, rgba(47,95,255,0.7), rgba(10,31,68,0) 70%)'}} />
        )}
        <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 120, height: 120, borderRadius: 60, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SOMBRA}}>
            <svg width="54" height="54" viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill={C.medianoche} /></svg>
          </div>
        </AbsoluteFill>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 10, background: 'rgba(255,255,255,0.25)'}}>
          <div style={{width: `${avance * 100}%`, height: '100%', background: C.lima}} />
        </div>
        <div style={{position: 'absolute', left: 22, top: 22, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px 10px 14px', borderRadius: 999, background: C.lima, opacity: pr, transform: `scale(${0.85 + 0.15 * pr})`, transformOrigin: 'left center'}}>
          <Linea n="rayo" tam={28} color={C.medianoche} grosor={2.6} />
          <span style={{...poppins(700, 28, C.medianoche)}}>en prueba</span>
        </div>
      </div>
      <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 20, padding: '0 8px', opacity: cr, transform: `translateY(${(1 - cr) * 24}px)`}}>
        <div style={{width: 84, height: 84, borderRadius: 42, background: C.electrico, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
          <Linea n="usuario" tam={48} color={C.blanco} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 12}}>
            <span style={{...poppins(700, 40, li > 0.5 ? C.electrico : C.medianoche)}}>nombre del creador</span>
            <div style={{opacity: li, transform: `scale(${0.6 + 0.4 * li})`}}>
              <Linea n="link" tam={38} color={C.electrico} grosor={2.6} />
            </div>
            <div style={{position: 'absolute', left: 0, bottom: -6, height: 5, width: 370, borderRadius: 3, background: C.electrico, transform: `scaleX(${li})`, transformOrigin: 'left center'}} />
            {toque > 0 && toque < 1 && <div style={{position: 'absolute', left: 160, top: -40, width: 130, height: 130, borderRadius: 65, border: `5px solid ${C.electrico}`, opacity: 1 - toque, transform: `scale(${0.2 + 0.8 * toque})`}} />}
          </div>
          {barra(260, 13)}
        </div>
        {(cu > 0 || pe > 0) && (
          <div style={{position: 'absolute', right: -6, top: -150, display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 20px', borderRadius: 24, background: C.blanco, boxShadow: '0 24px 56px rgba(10,31,68,0.22)', opacity: cu, transform: `translateY(${(1 - cu) * 20}px)`}}>
            {[{t: 'cuenta de Google', a: cu}, {t: 'perfil de Google', a: pe}].map((r, i) => (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, opacity: r.a, transform: `translateX(${(1 - r.a) * 16}px)`}}>
                <Img src={urlLogo('google')} style={{width: 34, height: 34, objectFit: 'contain'}} />
                <span style={{...poppins(700, 28, C.medianoche)}}>{r.t}</span>
                <Linea n="check" tam={26} color={C.electrico} grosor={3} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Multitud (la gente elige) ----------
/** Retícula de personas que se encienden en ola desde el centro; las elegidas se ponen lima con check. */
export const Multitud: React.FC<{d: any; alto: number}> = ({d, alto}) => {
  const frame = useCurrentFrame();
  const oscuro = useContext(Oscuro);
  const cols = d.columnas ?? 6, filas = d.filas ?? 5;
  const tam = Math.min((AREA_ANCHO - (cols - 1) * 18) / cols, (alto - (filas - 1) * 18) / filas);
  const elegidos: number[] = d.elegidos ?? [8, 15, 22];
  const fE = (d.elige as Paso)?.f;
  const cx = (cols - 1) / 2, cy = (filas - 1) / 2;
  return (
    <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${tam}px)`, gap: 18}}>
      {Array.from({length: cols * filas}).map((_, i) => {
        const x = i % cols, y = Math.floor(i / cols);
        const dist = Math.hypot(x - cx, y - cy);
        const a = prog(frame, (d.f ?? 0) + dist * 2.2, 8);
        const elegido = elegidos.includes(i) && fE !== undefined;
        const e = elegido ? prog(frame, fE! + elegidos.indexOf(i) * 3, 7) : 0;
        const base = oscuro ? 'rgba(255,255,255,0.1)' : 'rgba(10,31,68,0.06)';
        return (
          <div key={i} style={{width: tam, height: tam, borderRadius: tam / 2, background: e > 0.5 ? C.lima : base, border: `2px solid ${e > 0.5 ? C.lima : oscuro ? 'rgba(255,255,255,0.22)' : 'rgba(10,31,68,0.14)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: a * (fE !== undefined && ya(frame, fE) && !elegido ? 0.55 : 1), transform: `scale(${(0.7 + 0.3 * a) * (1 + 0.12 * Math.sin(Math.PI * e))})`}}>
            <Linea n={e > 0.5 ? 'check' : 'usuario'} tam={tam * 0.52} color={e > 0.5 ? C.medianoche : oscuro ? C.blanco : C.medianoche} grosor={e > 0.5 ? 3 : 2} />
          </div>
        );
      })}
    </div>
  );
};

// ---------- Clip / imagen de fondo ----------
const esVideo = (a: string) => /\.(mp4|webm|mov|m4v)$/i.test(a);
/** Video o foto a sangre, en dos tonos de la marca (azul medianoche → azul eléctrico) para que no rompa la paleta. */
export const Medio: React.FC<{archivo: string; carpeta: string; desde?: number; duotono?: boolean}> = ({archivo, carpeta, desde = 0, duotono = true}) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 120], [1.08, 1.0], {...k, easing: suave});
  const src = staticFile(`${carpeta}/${archivo}`);
  const estilo: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover', filter: duotono ? 'grayscale(1) contrast(1.25) brightness(1.05)' : undefined};
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        {esVideo(archivo) ? <OffthreadVideo src={src} muted startFrom={desde} style={estilo} /> : <Img src={src} style={estilo} />}
      </AbsoluteFill>
      {duotono && (
        <>
          <AbsoluteFill style={{background: C.electrico, mixBlendMode: 'multiply', opacity: 0.85}} />
          <AbsoluteFill style={{background: C.medianoche, mixBlendMode: 'screen', opacity: 0.35}} />
          <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,31,68,0.55) 0%, rgba(10,31,68,0.15) 40%, rgba(10,31,68,0.7) 100%)'}} />
        </>
      )}
    </AbsoluteFill>
  );
};
