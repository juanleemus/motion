import React from 'react';
import {AbsoluteFill, Composition, continueRender, delayRender} from 'remotion';
import {fuentesListas} from './jpr/fuentes';
import {DURACION, FPS, NOMBRE} from './reels/contenido5/datos';
import {Motion} from './reels/contenido5/Motion';
import {Subtitulos} from './reels/contenido5/Subtitulos';

const espera = delayRender('Cargando letras de la marca');
fuentesListas.then(() => continueRender(espera));

// Vista de trabajo en el Studio: las dos capas juntas sobre un gris neutro (no es entregable).
const Juntas: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#555'}}>
    <Motion />
    <Subtitulos />
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <>
    <Composition id={`${NOMBRE}-motion`} component={Motion} durationInFrames={DURACION} fps={FPS} width={1080} height={1920} />
    <Composition id={`${NOMBRE}-subtitulos`} component={Subtitulos} durationInFrames={DURACION} fps={FPS} width={1080} height={1920} />
    <Composition id={`${NOMBRE}-juntas`} component={Juntas} durationInFrames={DURACION} fps={FPS} width={1080} height={1920} />
  </>
);
