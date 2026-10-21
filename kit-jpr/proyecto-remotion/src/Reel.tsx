import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, CalculateMetadataFunction, Sequence, continueRender, delayRender} from 'remotion';
import {fuentesListas} from './jpr/fuentes';
import {planificar, ReelJson} from './jpr/plan';
import {Destello, Escena, Fondo} from './jpr/ui';

export type PropsReel = {reel: ReelJson};

// La composición "Reel" se arma SOLO con escenas.json: no lleva código por reel.
export const Reel: React.FC<PropsReel> = ({reel}) => {
  const plan = useMemo(() => planificar(reel), [reel]);
  const [espera] = useState(() => delayRender('fuentes JPR'));
  useEffect(() => {
    fuentesListas.then(() => continueRender(espera));
  }, [espera]);
  const carpeta = `reels/${reel.nombre}`;
  return (
    <AbsoluteFill>
      {!reel.sinFondo && <Fondo />}
      {plan.escenas
        .filter((e) => e.tramo !== 'a-camara')
        .map((e) => (
          <Sequence key={e.i} from={e.desde} durationInFrames={e.dur} name={`${e.i} · ${e.tramo} · ${e.pieza ?? 'Texto'}`}>
            <Escena e={e} carpeta={carpeta} final={e.hasta >= plan.total} />
          </Sequence>
        ))}
      {plan.escenas
        .filter((e) => e.destello)
        .map((e) => (
          <Sequence key={`d${e.i}`} from={Math.max(0, e.desde - 4)} durationInFrames={8} name="destello">
            <Destello />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};

export const metadatosReel: CalculateMetadataFunction<PropsReel> = ({props}) => {
  const plan = planificar(props.reel);
  return {fps: plan.fps, durationInFrames: plan.total, width: 1080, height: 1920};
};
