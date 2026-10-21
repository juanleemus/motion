import os from 'node:os';
import {Config} from '@remotion/cli/config';
import {navegadorLocal} from './scripts/navegador.mjs';

// Mismo formato que el render por script: H.264 normal, sin transparencias.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setPixelFormat('yuv420p');
Config.setColorSpace('bt709');
Config.setConcurrency(os.cpus().length);
const chrome = navegadorLocal();
if (chrome) Config.setBrowserExecutable(chrome);
