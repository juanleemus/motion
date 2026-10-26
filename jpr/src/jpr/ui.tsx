import {Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, entrada} from './marca';

export type Tema = 'claro' | 'oscuro';

// Fondo de cuadrícula (blanco o azul medianoche) con zoom lento y degradados de marca.
export const FondoX: React.FC<{alto?: number; tema: Tema}> = ({alto = 1920, tema}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const z = interpolate(f, [0, durationInFrames], [1, 1.05]);
  const oscuro = tema === 'oscuro';
  return (
    <div style={{position: 'absolute', inset: 0, height: alto, overflow: 'hidden', background: oscuro ? C.medianoche : C.blanco}}>
      <Img src={staticFile(oscuro ? 'fondo-x-medianoche.png' : 'fondo-x.png')} style={{width: '100%', transform: `scale(${z})`, transformOrigin: '50% 40%'}} />
      <div style={{position: 'absolute', inset: 0, background: oscuro
        ? 'radial-gradient(70% 45% at 75% 25%, rgba(47,95,255,0.38), transparent 70%), radial-gradient(45% 30% at 10% 90%, rgba(200,245,66,0.10), transparent 70%)'
        : 'radial-gradient(60% 45% at 75% 30%, rgba(47,95,255,0.14), transparent 70%)'}} />
    </div>
  );
};

// Texto que acompaña (no es subtítulo): entra con máscara, sin rebote.
export const Titular: React.FC<{texto: string; desde: number; y: number; tam?: number; tema: Tema}> = ({texto, desde, y, tam = 104, tema}) => {
  const f = useCurrentFrame();
  const t = entrada((f - desde) / 14);
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, textAlign: 'center', overflow: 'hidden', paddingBottom: 8}}>
      <div style={{font: `800 ${tam}px Poppins`, color: tema === 'oscuro' ? C.blanco : C.medianoche, letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'pre-line', transform: `translateY(${(1 - t) * 105}%)`}}>{texto}</div>
    </div>
  );
};

// Palabra de golpe en Anton con marcador lima que barre detrás.
export const Golpe: React.FC<{texto: string; desde: number; y: number; tam?: number}> = ({texto, desde, y, tam = 150}) => {
  const f = useCurrentFrame();
  const m = entrada((f - desde) / 12);
  const t = entrada((f - desde - 5) / 14);
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div style={{position: 'relative', padding: '0 30px'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: '22%', bottom: '8%', background: C.lima, transformOrigin: 'left', transform: `scaleX(${m})`}} />
        <div style={{position: 'relative', font: `400 ${tam}px Anton`, color: C.medianoche, lineHeight: 1.05, opacity: t, transform: `translateY(${(1 - t) * 18}px)`}}>{texto}</div>
      </div>
    </div>
  );
};

// Fila de dato: tarjeta sobria con barra lateral lima. Entra deslizándose, sin giro ni rebote.
export const Chip: React.FC<{texto: string; desde: number; y: number; tema: Tema}> = ({texto, desde, y, tema}) => {
  const f = useCurrentFrame();
  const t = entrada((f - desde) / 16);
  const oscuro = tema === 'oscuro';
  return (
    <div style={{position: 'absolute', top: y, left: 150, right: 150, opacity: t, transform: `translateX(${(1 - t) * -60}px)`}}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 28, padding: '30px 40px', borderRadius: 18,
        background: oscuro ? 'linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))' : `linear-gradient(180deg, #12306A, ${C.medianoche})`,
        border: oscuro ? '1px solid rgba(120,150,255,0.35)' : '1px solid rgba(47,95,255,0.25)',
        boxShadow: oscuro ? 'none' : `0 24px 50px ${C.sombra}`,
      }}>
        <div style={{width: 8, alignSelf: 'stretch', borderRadius: 4, background: C.lima}} />
        <div style={{font: '700 54px Poppins', color: C.blanco, whiteSpace: 'nowrap'}}>{texto}</div>
      </div>
    </div>
  );
};

// Zona segura del contenido (x 70–930): envuelve titulares y golpes para que no toquen el borde derecho.
export const Zona: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', left: 70, width: 860, top: 0, bottom: 0}}>{children}</div>
);

// Pantalla dividida (formato B): arriba fondo y gráfico (y 0–960), abajo transparente para Juan Pablo.
// Entra y sale deslizándose en 12 fotogramas; sin sombra sobre el video.
export const Dividida: React.FC<{tema: Tema; dur: number; children: React.ReactNode}> = ({tema, dur, children}) => {
  const f = useCurrentFrame();
  const entra = entrada(f / 12);
  const sale = Math.pow(Math.min(Math.max((f - (dur - 12)) / 12, 0), 1), 2);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 960, overflow: 'hidden', transform: `translateY(${(entra - 1 - sale) * 960}px)`}}>
      <FondoX alto={960} tema={tema} />
      {children}
    </div>
  );
};

// Texto de acompañamiento sobre Juan Pablo (formato A): tarjeta medianoche, entra con máscara de abajo hacia arriba.
export const TextoA: React.FC<{texto: string; desde: number; y?: number; tam?: number}> = ({texto, desde, y = 1390, tam = 64}) => {
  const f = useCurrentFrame();
  const t = entrada((f - desde) / 13);
  return (
    <Zona>
      <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center', overflow: 'hidden', paddingBottom: 30}}>
        <div style={{transform: `translateY(calc(${(1 - t) * 100}% + ${(1 - t) * 40}px))`, padding: '22px 40px', borderRadius: 18, background: `linear-gradient(180deg, #12306A, ${C.medianoche})`, border: '1px solid rgba(47,95,255,0.35)', display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{width: 8, alignSelf: 'stretch', borderRadius: 4, background: C.lima}} />
          <div style={{font: `700 ${tam}px Poppins`, color: C.blanco, whiteSpace: 'pre', textAlign: 'center', lineHeight: 1.1}}>{texto}</div>
        </div>
      </div>
    </Zona>
  );
};

// Logo en una tarjeta blanca (se lee igual sobre blanco, medianoche o video). Entra con máscara.
export const Logo: React.FC<{src: string; alto: number; desde: number; x?: number; y: number; ancho?: number}> = ({src, alto, desde, x, y, ancho}) => {
  const f = useCurrentFrame();
  const t = entrada((f - desde) / 12);
  return (
    <div style={{position: 'absolute', top: y, left: x ?? 0, right: x === undefined ? 0 : undefined, display: 'flex', justifyContent: 'center', overflow: 'hidden', padding: '0 0 30px'}}>
      <div style={{transform: `translateY(calc(${(1 - t) * 100}% + ${(1 - t) * 40}px))`, background: C.blanco, borderRadius: 20, padding: `${alto * 0.32}px ${alto * 0.45}px`, boxShadow: `0 18px 40px ${C.sombra}`, border: '1px solid rgba(47,95,255,0.18)'}}>
        <Img src={staticFile(src)} style={{height: alto, width: ancho, objectFit: 'contain', display: 'block'}} />
      </div>
    </div>
  );
};

type Caja = {x: number; y: number; w: number; h: number};

// Captura completa (formato D): web con zoom lento, recuadro azul que se dibuja y marcador lima en el dato.
// Las cajas van en píxeles de la imagen.
export const Captura: React.FC<{
  src: string; w: number; h: number; ancho: number; y: number;
  recuadro: Caja; recuadroDesde: number; marcas: Caja[]; marcaDesde: number; fuente: string;
}> = ({src, w, h, ancho, y, recuadro, recuadroDesde, marcas, marcaDesde, fuente}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const k = ancho / w;
  const alto = h * k;
  const z = interpolate(f, [0, durationInFrames], [1, 1.05]);
  const r = entrada((f - recuadroDesde) / 18);
  const per = 2 * (recuadro.w + recuadro.h) * k + 40;
  const total = marcas.reduce((a, m) => a + m.w, 0);
  const m = entrada((f - marcaDesde) / 14) * total;
  let usado = 0;
  return (
    <div style={{position: 'absolute', top: y, left: 70 + (860 - ancho) / 2, width: ancho}}>
    <div style={{position: 'relative', height: alto, borderRadius: 20, overflow: 'hidden', background: C.blanco, boxShadow: `0 30px 60px ${C.sombra}`, border: '1px solid rgba(47,95,255,0.25)'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${z})`, transformOrigin: `${(recuadro.x + recuadro.w / 2) / w * 100}% ${(recuadro.y + recuadro.h / 2) / h * 100}%`}}>
        <Img src={staticFile(src)} style={{width: ancho, height: alto, display: 'block'}} />
        {marcas.map((c, i) => {
          const visible = Math.max(0, Math.min(c.w, m - usado));
          usado += c.w;
          return <div key={i} style={{position: 'absolute', left: c.x * k - 4, top: c.y * k, height: c.h * k, width: visible * k + (visible > 0 ? 8 : 0), background: C.lima, mixBlendMode: 'multiply'}} />;
        })}
        <svg width={ancho} height={alto} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={recuadro.x * k - 14} y={recuadro.y * k - 12} width={recuadro.w * k + 28} height={recuadro.h * k + 24} rx={10} fill="none" stroke={C.electrico} strokeWidth={6}
            strokeDasharray={per} strokeDashoffset={per * (1 - r)} />
        </svg>
      </div>
    </div>
      <div style={{marginTop: 18, textAlign: 'right', font: '600 26px "Open Sans"', color: C.gris}}>{fuente}</div>
    </div>
  );
};
