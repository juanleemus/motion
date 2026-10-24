import {Composition} from 'remotion';
import {Muestra} from './jpr/Muestra';

export const Root: React.FC = () => (
  <>
    <Composition id="MuestraClaro" component={Muestra} defaultProps={{tema: 'claro' as const}} durationInFrames={270} fps={30} width={1080} height={1920} />
    <Composition id="MuestraOscuro" component={Muestra} defaultProps={{tema: 'oscuro' as const}} durationInFrames={270} fps={30} width={1080} height={1920} />
  </>
);
