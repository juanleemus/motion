import {Composition, Still} from 'remotion';
import {Muestra} from './jpr/Muestra';
import {Contenido10} from './reels/contenido-10/Reel';
import {DURACION} from './reels/contenido-10/tiempos';
import {Portada10} from './reels/contenido-10/Portada';

export const Root: React.FC = () => (
  <>
    <Composition id="MuestraClaro" component={Muestra} defaultProps={{tema: 'claro' as const}} durationInFrames={270} fps={30} width={1080} height={1920} />
    <Composition id="MuestraOscuro" component={Muestra} defaultProps={{tema: 'oscuro' as const}} durationInFrames={270} fps={30} width={1080} height={1920} />
    <Composition id="contenido-10" component={Contenido10} durationInFrames={DURACION} fps={30} width={1080} height={1920} />
    <Still id="contenido-10-portada" component={Portada10} width={1080} height={1920} />
  </>
);
