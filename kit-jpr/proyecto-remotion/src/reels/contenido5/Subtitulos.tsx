// Capa de subtítulos (transparente). Posición y color según el formato de pantalla de cada momento.
import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Subtitulo} from '../../jpr/ui';
import {posicionSub, SUBTITULOS} from './datos';

const Bloque: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const b = SUBTITULOS[i];
  const {y, superficie} = posicionSub(b.desde + frame);
  return <Subtitulo palabras={b.palabras} superficie={superficie} y={y} />;
};

export const Subtitulos: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: 'transparent'}}>
    {SUBTITULOS.map((b, i) => (
      <Sequence key={i} from={b.desde} durationInFrames={b.hasta - b.desde} layout="none">
        <Bloque i={i} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
