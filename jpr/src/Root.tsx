import {Composition} from 'remotion';
import {Muestra} from './jpr/Muestra';

export const Root: React.FC = () => (
  <>
    <Composition id="Muestra" component={Muestra} durationInFrames={270} fps={30} width={1080} height={1920} />
  </>
);
