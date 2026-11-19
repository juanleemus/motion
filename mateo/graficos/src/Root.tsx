import React from 'react';
import {Composition, staticFile} from 'remotion';
import {Props, Timeline, Video} from './Video';

// Una composición para todos los videos largos en modo círculo: el slug elige public/<slug>/ (timeline, voz, cámara).
//   npx remotion render Mateo out/x.mp4 --props='{"slug":"enso-cta-precios","circulo":true,"audio":true}'
export const Root: React.FC = () => (
  <Composition
    id="Mateo"
    component={Video}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={300}
    defaultProps={{slug: 'enso-cta-precios', circulo: true, audio: true} as Props}
    calculateMetadata={async ({props}) => {
      const timeline = (await (await fetch(staticFile(`${props.slug}/timeline.json`))).json()) as Timeline;
      return {durationInFrames: timeline.frames, props: {...props, timeline}};
    }}
  />
);
