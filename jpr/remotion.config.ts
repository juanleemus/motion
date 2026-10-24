import {Config} from '@remotion/cli/config';

// swangle: el 3D renderiza tanto en la nube (sin GPU) como en un computador.
Config.setChromiumOpenGlRenderer('swangle');
