# Videos largos de YouTube de Mateo Folador

Tercer proyecto del repositorio, aparte de Invora (raíz) y JPR (`jpr/`). No usa Remotion: se edita con el **kit de
Mateo** (`kit-edicion-v2`), que trae su pipeline en Python (`pipeline-largo`), las plantillas gráficas de HyperFrames con
su marca (`templates/mf-capas`) y el skill `/video-largo`, que ordena el proceso.

## Qué hay en git y qué no
- **En git** (este repositorio es público): solo esta guía, `preparar.sh` y la adaptación a Linux (`linux/`).
- **Fuera de git** (`mateo/paquete/`, en `.gitignore`): el kit, los proyectos, las grabaciones y los renders. Llegan en
  un zip de Drive que comparte el usuario. Nunca se suben al repositorio, ni se ponen los enlaces de Drive en archivos
  versionados.

## Arranque en una sesión nueva
1. Pedir al usuario el enlace del zip del paquete (el "paquete-5-niveles.zip" o el que lo reemplace), compartido como
   "cualquier persona con el enlace".
2. Correr `bash mateo/preparar.sh <enlace o ID>`. Descarga el zip, instala faster-whisper, opencv y HyperFrames,
   adapta el pipeline a Linux e instala el skill.
3. Leer, en este orden:
   - `mateo/paquete/CLAUDE.md`;
   - `mateo/paquete/skill/video-largo/SKILL.md` (las fases y las puertas);
   - `kit-edicion-v2/pipeline-largo/README.md`, `RECETA.md` (reglas R1–R14) y `REVISION-FINAL.md`;
   - `skill/video-largo/references/gotchas.md`.

## Adaptación a Linux (`linux/aplicar.sh`, idempotente)
El kit está hecho para una Mac con Apple Silicon. Lo único que cambia:
- **Whisper:** `mlx_whisper.transcribe` pasa a `asr.transcribe` (`linux/asr.py`). En la Mac sigue usando MLX; en Linux
  usa faster-whisper con el mismo modelo (large-v3-turbo, int8 en CPU) y devuelve el mismo formato. Velocidad aquí:
  unos 0,4 s de cómputo por segundo de audio.
- **Borrador:** `ENC_RAPIDO` usa libx264 `veryfast` en lugar de VideoToolbox.
- **Rutas:** a `run.py` y `escenas.py` se les pasa la ruta **absoluta** del proyecto (HyperFrames corre desde la carpeta
  de plantillas). A `nuevo.py` se le pone `VIDEO_BASE="$PWD/mateo/paquete"`.
- `timeline.py` escribe también en `~/Movies/<slug>-davinci/` (pensado para el DaVinci de la Mac): en el contenedor no
  sirve; el fcpxml que se entrega es el de `renders/davinci/`.

Probado el 2026-11-19 sobre "5 niveles": una escena re-renderizada en Linux sale idéntica a la de la Mac, y `componer`
arma el borrador completo (12 min, 112 piezas) en unos 4 min.

## Cuando llega un video ya cortado
El usuario puede mandar el video ya cortado en lugar del export de Tella. Entonces:
1. Crear el proyecto: `VIDEO_BASE="$PWD/mateo/paquete" python3 mateo/paquete/kit-edicion-v2/pipeline-largo/nuevo.py "<slug>" <video.mp4> "<vocabulario>"`.
2. Transcribir: `run.py <proyecto absoluto> --hasta transcribir`.
3. Escribir `seleccion.json` con un solo bloque y un solo tramo que tome todo el clip, de la primera palabra a la
   última. No se eligen tomas, porque ya vienen elegidas.
4. Seguir el skill desde la fase 3 (corte limpio y puertas) en `--borrador`. El render 1080p sale solo con la
   aprobación de Mateo.

## Modo burbuja: sin cámara a cuadro completo
Algunos exports compuestos de Tella traen a Mateo solo en el círculo de la esquina y la pantalla congelada. En ese caso
no se edita la imagen: se arma solo la capa gráfica, y Mateo va en un círculo fijo a la derecha.
1. Crear la carpeta del proyecto con `raw/<export>.mp4`, `work/words-corte.json` (la transcripción con el vocabulario
   corregido) y `burbuja.json`:
   - `centro` y `radio`: el círculo en el video fuente. Se mide con `cv2.HoughCircles` sobre un cuadro.
   - `x`: borde izquierdo de la zona libre (1480).
   - `cx`, `cy` y `d`: el círculo en 1920×1080 (1680, 540, 400).
2. `VIDEO_BORRADOR=1 python3 PL/burbuja.py <proyecto> fondo`: crea la grilla de la marca con la voz a −14 LUFS y un
   `edl.json` de un solo plano.
3. Escribir `graficos.json` como siempre. Todas las piezas con panel quedan a la izquierda del círculo y los textos se
   centran en esa zona.
4. `VIDEO_BORRADOR=1 BURBUJA=1480 python3 PL/escenas.py <proyecto>`, después `componer.py` y al final
   `burbuja.py <proyecto> componer`. Salen dos archivos:
   - `final-graficos.mp4`: solo la capa gráfica;
   - `final-burbuja.mp4`: la capa con el círculo y el aro azul de la marca.
5. Para el 1080p, lo mismo sin `VIDEO_BORRADOR`.

Los cambios al kit están en `linux/burbuja.patch` y `linux/burbuja.py`, y `aplicar.sh` los aplica.

## Gráficos en Remotion (modo círculo, versión que se entrega)
Las plantillas del kit están pensadas para un panel al lado de la cámara a cuadro completo. En modo círculo se desarman:
textos chicos, tarjetas a medio llenar y contenido pegado abajo. Para estos videos se usa `mateo/graficos/`, que tiene
la marca de Mateo (colores e Inter Tight) y reglas fijas:
- **Zona única:** todo el contenido va centrado en la zona de la izquierda (`ZONA` en `src/marca.ts`), con el círculo
  fijo a la derecha.
- **Tamaños:** textos grandes ajustados al ancho (`ajustar`), nunca por debajo de 32–40 px.
- **Sincronía:** cada elemento entra en el cuadro en que se dice su frase y la palabra clave se enciende en su palabra.
- **Piezas:** `frase`, `cifra`, `lista`, `versus`, `pasos`, `caso` e `imagen`, siempre con la misma entrada y salida.

Pasos:
1. Preparar `burbuja.json`, la voz y el recorte del círculo con `burbuja.py <proyecto> fondo` y `burbuja.camara()`.
2. Escribir `<proyecto>/plan.json`. Cada escena tiene `desde` y `hasta` como frases ancla, y sus elementos llevan
   `en` (o `kw_en`). Para tomas repetidas que se van a cortar, `corte` da el segundo exacto del borde.
3. `cd mateo/graficos && npm install && python3 resolver.py <proyecto> <slug>`: copia la voz y la cámara a
   `public/<slug>/` y escribe `timeline.json`. Las escenas quedan pegadas una a otra, sin pantalla vacía.
4. Renderizar los dos archivos:
   `npx remotion render src/index.ts Mateo out/<slug>-con-circulo.mp4 --props='{"slug":"<slug>","circulo":true,"audio":true}'`
   y lo mismo con `"circulo":false` para el de solo gráficos.

## Entregas
- Borradores en `<proyecto>/renders/borrador/`.
- El final en `<proyecto>/renders/`: `final.mp4`, `subtitulos.srt`, `CAPITULOS.txt` y `davinci/`.
- Se envían al usuario con la herramienta de archivos, sin subirlos a git.
