import {AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, entrada} from './marca';
import {Chip, FondoX, Golpe, Tema, Titular} from './ui';
import {Barras3D, Linea3D} from './tres';

// Clip de muestra del estilo (no es un reel). Corte seco entre bloques: nada de barridos ni
// destellos, porque la capa se monta sobre el video real de Juan Pablo.
// Abajo, un fotograma de Juan Pablo como relleno de lo que pone el editor.
const B = 128;

const Dividida: React.FC<{tema: Tema}> = ({tema}) => {
  const f = useCurrentFrame();
  const baja = entrada(f / 12);
  return (
    <AbsoluteFill>
      <Img src={staticFile('jpr-placeholder.jpg')} style={{position: 'absolute', top: 960, width: 1080, height: 960, objectFit: 'cover'}} />
      <div style={{position: 'absolute', top: 960, left: 0, right: 0, textAlign: 'center', font: '700 26px Poppins', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', paddingTop: 18}}>VIDEO DE JUAN PABLO (LO MONTA EL EDITOR)</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 960, overflow: 'hidden', transform: `translateY(${(baja - 1) * 960}px)`}}>
        <FondoX alto={960} tema={tema} />
        <Titular texto="tu ROAS" desde={10} y={290} tema={tema} />
        <Golpe texto="REAL" desde={18} y={400} />
        <div style={{position: 'absolute', top: 545, left: 0}}>
          <Barras3D ancho={1080} alto={415} desde={24} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Completa: React.FC<{tema: Tema}> = ({tema}) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, 142], [1.03, 1]);
  return (
    <AbsoluteFill style={{transform: `scale(${z})`}}>
      <FondoX tema={tema} />
      <Titular texto="cuando escalas" desde={4} y={300} tam={92} tema={tema} />
      <div style={{position: 'absolute', top: 420, left: 0}}>
        <Linea3D ancho={1080} alto={600} desde={10} />
      </div>
      <Chip texto="tu CPA sube" desde={50} y={1060} tema={tema} />
      <Chip texto="la audiencia se cansa" desde={62} y={1215} tema={tema} />
      <Chip texto="el creativo se quema" desde={74} y={1370} tema={tema} />
    </AbsoluteFill>
  );
};

export const Muestra: React.FC<{tema: Tema}> = ({tema}) => (
  <AbsoluteFill style={{background: tema === 'oscuro' ? C.medianoche : C.blanco}}>
    <Sequence from={0} durationInFrames={B}><Dividida tema={tema} /></Sequence>
    <Sequence from={B}><Completa tema={tema} /></Sequence>
  </AbsoluteFill>
);
