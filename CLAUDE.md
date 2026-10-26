# Repositorio de motion graphics

Dos proyectos de Remotion independientes:

- Raíz (`src/`, `public/`): reels de Escuela Invora.
- `jpr/`: reels de Juan Pablo Ramos (JPR). Cuando el pedido mencione JPR o traiga el "Prompt · Motion graphics de un reel de JPR", trabaja solo dentro de `jpr/`.

## Reels de JPR

- El usuario entrega el audio del reel ya cortado (no el video), el guion y el nombre. El prompt trae todas las reglas de marca y estilo; síguelo al pie de la letra.
- Antes de empezar: `cd jpr && npm install`. Si falta whisper.cpp, ffmpeg o Playwright, instálalos en el contenedor sin pedir permiso para cada uno y avisa en una línea.
- El 3D usa `@remotion/three` y renderiza con `swangle` (ya configurado en `jpr/remotion.config.ts`); no hace falta GPU.
- Reutiliza las piezas de `jpr/src/jpr/` (`marca.ts`, `ui.tsx`, `tres.tsx`). `Muestra.tsx` es solo el clip de referencia del estilo: sirve para ver cómo se mueven las piezas, no es una plantilla de reel. Su video de fondo (`public/jpr-abajo.mp4`) no está en el repositorio, así que no se puede renderizar.
- Cada reel va en su propia composición, registrada en `jpr/src/Root.tsx`, con su carpeta de datos en `jpr/src/reels/[nombre]/`.
- Al entregar, renderiza en `jpr/out/[nombre]/` y envía al usuario los archivos para descargar (`-motion.mp4`, `-motion.mov`, `-motion.webm`, `-efectos.wav`, `-hoja-de-montaje.txt`, `-preview.mp4`).
- El usuario siempre quiere la capa también en MP4. Como el MP4 (H.264) no guarda transparencia, `-motion.mp4` va sobre fondo magenta #FF00FF para quitarlo en CapCut con Croma (ningún color de la marca se le parece). Si un archivo pasa del límite de envío (unos 400 MB), pártelo en tramos con `-c copy` y di dónde empieza cada uno.
- El repositorio es público: no subas a git el audio, el guion ni los videos del cliente. Déjalos fuera con `.gitignore`.
