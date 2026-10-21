// Si el computador ya tiene un Chrome sin interfaz (por ejemplo, el de Playwright), se usa ese;
// si no, Remotion descarga el suyo la primera vez. Se puede forzar con la variable JPR_CHROME.
import fs from 'node:fs';
import path from 'node:path';

export const navegadorLocal = () => {
  if (process.env.JPR_CHROME && fs.existsSync(process.env.JPR_CHROME)) return process.env.JPR_CHROME;
  const base = '/opt/pw-browsers';
  if (!fs.existsSync(base)) return null;
  for (const d of fs.readdirSync(base).filter((d) => d.startsWith('chromium_headless_shell')).sort().reverse()) {
    const p = path.join(base, d, 'chrome-linux', 'headless_shell');
    if (fs.existsSync(p)) return p;
  }
  return null;
};
