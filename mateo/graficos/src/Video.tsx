import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Circulo, Fondo, SALE, useFuentes} from './base';
import {Caso, Cifra, Frase, Imagen, Lista, Pasos, Versus} from './piezas';

export type Escena = {tipo: string; id?: string; desde: number; hasta: number; [k: string]: unknown};
export type Timeline = {fps: number; frames: number; escenas: Escena[]};
export type Props = {slug: string; circulo: boolean; audio: boolean; timeline?: Timeline};

const PIEZAS: Record<string, React.FC<any>> = {frase: Frase, cifra: Cifra, lista: Lista, versus: Versus, pasos: Pasos, caso: Caso, imagen: Imagen};

/** Todos los cuadros absolutos ("f", "kf", "ft", "fa", "fe", "ff") pasan a relativos al inicio de la escena. */
const relativo = (x: unknown, d: number): unknown => {
  if (Array.isArray(x)) return x.map((v) => relativo(v, d));
  if (x && typeof x === 'object') {
    const o: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(x)) o[k] = /^(f|kf|ft|fa|fe|ff|kf0)$/.test(k) && typeof v === 'number' ? v - d : relativo(v, d);
    return o;
  }
  return x;
};

const Salida: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const fr = useCurrentFrame();
  const o = interpolate(fr, [dur - SALE, dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

export const Video: React.FC<Props> = ({slug, circulo, audio, timeline}) => {
  const listo = useFuentes();
  if (!timeline || !listo) return null;
  return (
    <AbsoluteFill>
      <Fondo />
      {timeline.escenas.map((e, i) => {
        const P = PIEZAS[e.tipo];
        const dur = e.hasta - e.desde;
        if (!P || dur <= 0) return null;
        const props = relativo(e, e.desde) as Record<string, unknown>;
        return (
          <Sequence key={i} from={e.desde} durationInFrames={dur} name={`${e.tipo} ${e.id ?? i}`}>
            <Salida dur={dur}>
              <P {...props} />
            </Salida>
          </Sequence>
        );
      })}
      {circulo ? <Circulo src={`${slug}/camara.mp4`} /> : null}
      {audio ? <Audio src={staticFile(`${slug}/voz.wav`)} /> : null}
    </AbsoluteFill>
  );
};
