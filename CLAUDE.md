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
- Al entregar, renderiza en `jpr/out/[nombre]/` y envía al usuario los archivos para descargar (`-motion.mov`, `-motion.webm`, `-efectos.wav`, `-hoja-de-montaje.txt`, `-preview.mp4`).
- El repositorio es público: no subas a git el audio, el guion ni los videos del cliente. Déjalos fuera con `.gitignore`.

## Videos largos de Mateo Folador

- Si el pedido menciona a Mateo, Mateo Folador, un video largo de YouTube, el kit de edición v2, `pipeline-largo` o `/video-largo`, trabaja solo dentro de `mateo/` y lee primero `mateo/LEEME.md`.
- No se hace con Remotion: se usa el kit de Mateo (pipeline en Python y plantillas de HyperFrames). Se prepara con `bash mateo/preparar.sh <zip del paquete en Drive>`.
- Kit, grabaciones y renders van en `mateo/paquete/`, que está fuera de git. No subas su contenido ni los enlaces de Drive.
