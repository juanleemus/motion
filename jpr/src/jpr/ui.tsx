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
      <div style={{font: `800 ${tam}px Poppins`, color: tema === 'oscuro' ? C.blanco : C.medianoche, letterSpacing: '-0.02em', lineHeight: 1, transform: `translateY(${(1 - t) * 105}%)`}}>{texto}</div>
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
