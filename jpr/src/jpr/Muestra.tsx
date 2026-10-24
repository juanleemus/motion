import {AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import './marca';
import {C, entrada} from './marca';
import {Barrido, Chip, FondoX, Golpe, Titular} from './ui';
import {Alerta3D, Barras3D} from './tres';

// Clip de muestra del estilo nuevo (no es un reel): pantalla dividida con gráfica 3D,
// barrido de luz y gráfico completo con ícono 3D y chips. Abajo, un fotograma de Juan Pablo
// como relleno de lo que pondría el editor.
const A = 0, B = 128;

const Dividida: React.FC = () => {
  const f = useCurrentFrame();
  const baja = entrada(f / 10);
  const sale = entrada((f - (B - 10)) / 10);
  return (
    <AbsoluteFill>
      <Img src={staticFile('jpr-placeholder.jpg')} style={{position: 'absolute', top: 960, width: 1080, height: 960, objectFit: 'cover'}} />
      <div style={{position: 'absolute', top: 960, left: 0, right: 0, textAlign: 'center', font: '700 26px Poppins', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', paddingTop: 18}}>VIDEO DE JUAN PABLO (LO MONTA EL EDITOR)</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 960, overflow: 'hidden', transform: `translateY(${(baja - 1) * 960 - sale * 960}px)`, boxShadow: `0 20px 50px ${C.sombra}`}}>
        <FondoX alto={960} />
        <Titular texto="tu ROAS" desde={8} y={290} />
        <Golpe texto="REAL" desde={16} y={400} tam={150} />
        <div style={{position: 'absolute', top: 545, left: 0}}>
          <Barras3D ancho={1080} alto={415} desde={20} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Completa: React.FC = () => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 140], [1.04, 1]);
  return (
    <AbsoluteFill style={{transform: `scale(${z})`}}>
      <FondoX />
      <div style={{position: 'absolute', top: 300, left: 0}}>
        <Alerta3D ancho={1080} alto={620} desde={4} />
      </div>
      <Chip texto="tu CPA sube" desde={22} y={960} giro={-1.5} />
      <Chip texto="la audiencia se cansa" desde={34} y={1130} giro={1.2} />
      <Chip texto="el creativo se quema" desde={46} y={1300} giro={-0.8} />
    </AbsoluteFill>
  );
};

export const Muestra: React.FC = () => (
  <AbsoluteFill style={{background: C.blanco}}>
    <Sequence from={A} durationInFrames={B}><Dividida /></Sequence>
    <Sequence from={B - 4}><Completa /></Sequence>
    <Barrido desde={B - 10} dur={16} />
  </AbsoluteFill>
);
