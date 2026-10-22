import React from 'react';
import {Composition} from 'remotion';
import demo from '../demo/escenas.json';
import {metadatosReel, PropsReel, Reel} from './Reel';
import {ReelJson} from './jpr/plan';

export const Root: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={600}
    defaultProps={{reel: demo as unknown as ReelJson} satisfies PropsReel}
    calculateMetadata={metadatosReel}
  />
);
