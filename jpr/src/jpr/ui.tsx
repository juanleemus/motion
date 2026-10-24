import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, entrada} from './marca';

// Fondo de cuadrícula con zoom lento y degradados de marca.
export const FondoX: React.FC<{alto?: number}> = ({alto = 1920}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const z = interpolate(f, [0, durationInFrames], [1, 1.06]);
  return (
    <div style={{position: 'absolute', inset: 0, height: alto, overflow: 'hidden', background: C.blanco}}>
      <Img src={staticFile('fondo-x.png')} style={{width: '100%', transform: `scale(${z})`, transformOrigin: '50% 40%'}} />
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(60% 45% at 75% 30%, rgba(47,95,255,0.16), transparent 70%), radial-gradient(40% 30% at 15% 85%, rgba(200,245,66,0.18), transparent 70%)`}} />
    </div>
  );
};

// Texto que acompaña (no es subtítulo): entra con máscara de abajo hacia arriba.
export const Titular: React.FC<{texto: string; desde: number; y: number; tam?: number; color?: string}> = ({texto, desde, y, tam = 104, color = C.medianoche}) => {
  const f = useCurrentFrame();
  const t = entrada((f - desde) / 12);
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, textAlign: 'center', overflow: 'hidden', paddingBottom: 8}}>
      <div style={{font: `800 ${tam}px Poppins`, color, letterSpacing: '-0.02em', lineHeight: 1, transform: `translateY(${(1 - t) * 110}%)`}}>{texto}</div>
    </div>
  );
};

// Palabra de golpe en Anton con marcador lima que barre detrás.
export const Golpe: React.FC<{texto: string; desde: number; y: number; tam?: number}> = ({texto, desde, y, tam = 190}) => {
  const f = useCurrentFrame();
  const m = entrada((f - desde) / 10);
  const t = entrada((f - desde - 4) / 12);
  const s = interpolate(t, [0, 1], [1.25, 1]);
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div style={{position: 'relative', padding: '0 34px'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: '22%', bottom: '8%', background: `linear-gradient(90deg, ${C.lima}, #D9FA7A)`, transformOrigin: 'left', transform: `scaleX(${m}) skewX(-6deg)`, borderRadius: 6}} />
        <div style={{position: 'relative', font: `400 ${tam}px Anton`, color: C.medianoche, lineHeight: 1.05, opacity: t, transform: `scale(${s})`, filter: `blur(${(1 - t) * 10}px)`}}>{texto}</div>
      </div>
    </div>
  );
};

// Chip con profundidad: tarjeta azul medianoche con degradado, borde de luz y sombra azul.
export const Chip: React.FC<{texto: string; desde: number; y: number; giro: number}> = ({texto, desde, y, giro}) => {
  const f = useCurrentFrame();
  const t = entrada((f - desde) / 14);
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center', perspective: 1200}}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 26, padding: '30px 46px 30px 30px', borderRadius: 28,
        background: `linear-gradient(135deg, #16336E 0%, ${C.medianoche} 55%, #071634 100%)`,
        boxShadow: `0 30px 60px ${C.sombra}, inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 1px rgba(47,95,255,0.35)`,
        transform: `translateY(${(1 - t) * 260}px) rotateX(${(1 - t) * 50}deg) rotate(${giro * t}deg) scale(${0.9 + 0.1 * t})`,
        opacity: Math.min(1, t * 1.6),
      }}>
        <div style={{width: 64, height: 64, borderRadius: 18, background: `linear-gradient(145deg, ${C.lima}, #9DCB1E)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(200,245,66,0.35)'}}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={C.medianoche} strokeWidth="2.6" strokeLinecap="round"><path d="M12 8v5M12 16.5v.5" /><path d="M10.3 3.8 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.8a2 2 0 0 0-3.4 0z" /></svg>
        </div>
        <div style={{font: '700 58px Poppins', color: C.blanco, whiteSpace: 'nowrap'}}>{texto}</div>
      </div>
    </div>
  );
};

// Haz de luz que barre la pantalla entre bloques.
export const Barrido: React.FC<{desde: number; dur?: number}> = ({desde, dur = 14}) => {
  const f = useCurrentFrame();
  const t = (f - desde) / dur;
  if (t < 0 || t > 1) return null;
  const x = interpolate(entrada(t), [0, 1], [-60, 160]);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: '-20%', bottom: '-20%', left: `${x}%`, width: '38%', transform: 'skewX(-18deg)', background: `linear-gradient(90deg, transparent, rgba(47,95,255,0.85) 35%, ${C.lima} 55%, rgba(255,255,255,0.95) 62%, transparent)`, filter: 'blur(18px)'}} />
    </AbsoluteFill>
  );
};
