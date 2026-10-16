import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('png');
Config.setConcurrency(4);
Config.setBrowserExecutable(process.env.REMOTION_BROWSER || '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell');
