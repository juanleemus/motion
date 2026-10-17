# ESTILO JPR · motion graphics de Juan Pablo Ramos

Este archivo manda. Cada reel se arma **solo escribiendo `escenas.json`** con las piezas de `src/jpr/ui.tsx`.
No se programan piezas nuevas por reel. Si algo del estilo cambia, se cambia aquí, en el manual y en el doc de prompts.

---

## 0. Lo que NUNCA se hace

- Nunca se generan subtítulos ni se escribe palabra por palabra lo que dice Juan Pablo. Solo textos de apoyo cortos.
- Nunca se usa, recorta ni monta el video de Juan Pablo. El editor lo pone después en CapCut.
- Nunca se entregan capas transparentes (ni ProRes, ni .mov, ni .webm): solo MP4 normales (H.264, yuv420p).
- Nunca queda la pantalla en negro: donde no hay gráfico, va el fondo x limpio.
- Nunca se inventan cifras ni datos: solo lo que se dice en el audio.
- Nunca se piden contraseñas ni se inicia sesión en ninguna cuenta.

## 1. Identidad visual

| Elemento | Regla |
|---|---|
| Fondo | `01-fondo/fondo-x.jpg` escalado para cubrir, con zoom muy lento de 1 a 1,06 durante todo el video (pieza `Fondo`, va siempre). |
| Azul medianoche `#0A1F44` | Texto, tarjetas, chips. |
| Azul eléctrico `#2F5FFF` | Formas, líneas, recuadros, gráficas, palabras de acento. |
| Verde lima `#C8F542` | Acento: marcador detrás de palabras clave, botones, CTA, la última barra. |
| Blanco `#FFFFFF` | Texto dentro de tarjetas oscuras. |
| Gris `#8A94A6` | Etiquetas y lo que "no" (tachados). |

- Nada fuera de esta paleta (las sombras son azul medianoche con transparencia).
- El verde lima **nunca** va como texto sobre el fondo blanco: va como marcador detrás de la palabra, con el texto en azul medianoche encima.
- Letras: Poppins para todo (Bold para textos y cifras, Medium para chips y etiquetas). Lora Italic solo para una palabra de acento. Ninguna otra.
- Las fuentes se cargan desde `fuentes/` del kit (nunca desde internet).
- Firma: "JPR" escrito con texto (no imagen), Poppins Bold, espaciado 0,08 em, azul medianoche, con una raya lima de 120×8 px debajo que se dibuja de izquierda a derecha.

## 2. Textos de apoyo (no son subtítulos)

- Cada escena lleva un texto corto con la idea clave: **de 2 a 6 palabras**, máximo 2 líneas, Poppins Bold de 70 a 100 px, azul medianoche.
- En minúscula salvo siglas (IA, ROAS, CPA, B2B), marcas, personas y países. Sin puntos finales.
- De 1 a 3 palabras de acento por texto, de una de estas formas:
  - `*palabra*` → Lora Italic en azul eléctrico (entra con desenfoque de 8 px a 0).
  - `[palabra]` → marcador lima detrás, texto azul medianoche encima.
  - `{palabra}` → Poppins Bold en azul eléctrico.
- Entra justo cuando Juan Pablo dice esa idea (`textoEn`), en 4 fotogramas: opacidad 0→1, escala 0,92→1 y sube 12 px.

## 3. Tres tipos de tramo

| Tramo | En `escenas.json` | Qué lleva |
|---|---|---|
| **mitad** (cerca del 70 % del reel) | `"tramo": "mitad"` | Todo el contenido arriba, entre y = 300 y 900. De y = 960 hacia abajo SOLO el fondo x limpio (la composición lo recorta por seguridad). Ahí el editor pone a Juan Pablo. |
| **completa** | `"tramo": "completa"` | El motion usa toda la pantalla, contenido entre y = 300 y 1520. Solo para momentos fuertes: una cifra grande, una captura, el CTA, la firma. |
| **a cámara** | `"tramo": "a-camara"` | Solo el fondo x limpio, sin nada. El editor pone a Juan Pablo completo. |

- Ritmo: algo nuevo cada 2 a 4 s. Un tramo "mitad" o "completa" dura mínimo 1,5 s. Juan Pablo solo (a cámara) máximo 4 s seguidos.
- Donde no hay escena, queda el fondo limpio (equivale a "a cámara").

## 4. Zonas seguras y zoom

- Nada importante en los **250 px de arriba**, los **380 px de abajo** ni los **140 px de la derecha**.
- Contenido entre **x = 110 y 900** (para que en CapCut se pueda hacer zoom de hasta 115 % sin cortar nada). Las piezas ya se centran en esa franja.

## 5. Estilo de animación (de la referencia, adaptado a JPR)

| Pieza | Cómo se mueve |
|---|---|
| `Insignia` | Círculo azul eléctrico con el número de la sección y una etiqueta corta al lado, arriba de la escena (y ≈ 320). En listas lleva puntos de progreso. |
| `Chip` / `PilaChips` | Tarjetas azul medianoche (radio 18) con ícono de línea lima y texto blanco. Entran uno por uno desde abajo y se apilan, todos derechos. El paso actual puede ir en lima. |
| `Barra` | Se llena en azul eléctrico; al llegar al 100 % cambia a lima y aparece un ícono de alerta de línea. |
| `Cifra` | Poppins Bold de 220 a 260 px que cuenta hasta el valor dicho en 18 fotogramas, con tic. |
| `Grafica` | Barras o línea azul eléctrico que suben hacia donde se dice; la última barra en lima. Sin cifras inventadas. |
| `TarjetaLogo` | Logo en tarjeta blanca redondeada (radio 28) con sombra suave. Entra en la palabra exacta en que se nombra la marca. |
| `Captura` | Entra con escala 1,08→1 y luego zoom lento. `Recuadro` azul eléctrico (8 px, radio 20) que se dibuja alrededor del dato y `Marcador` lima que barre detrás del texto importante. Encima puede ir una palabra gigante (Poppins Bold 150 px). |
| `IconoApp` | Logo de la herramienta en un cuadrado redondeado que flota (muy suave) encima de la captura o solo. |
| `Nodos` | Centro + hasta 4 nodos; puntos y líneas azul eléctrico que se dibujan solos. |
| `Comparacion` | Dos tarjetas: la mala en gris y tachada, la buena con borde lima. |
| `Destello` | Luz blanca y lima suave de 8 fotogramas entre bloques grandes, máximo una cada 12 s (`"destello": true` en la escena). |
| `Cta` | "comenta" + la palabra en una pastilla lima + un chip de comentario que se escribe solo. |
| `Firma` | "JPR" + raya lima que se dibuja. 1 s, al final del reel. Se queda hasta el último fotograma. |
| Salidas | Cada escena sale con desvanecido y desenfoque en 6 fotogramas. Nada salta de lugar ni se monta sobre otra cosa: la escena siguiente empieza cuando la anterior terminó. |

## 6. Premium, no infantil

- Todo va derecho: nada inclinado ni rotado. Rebote máximo del 6 % (las piezas usan ≈ 3 %).
- Máximo 2 elementos moviéndose a la vez. Una idea por pantalla. Mucho aire alrededor.
- Sin emojis, stickers, GIFs, memes, flechas a mano, confeti ni efectos de sonido de caricatura. Íconos siempre de línea.
- Sin degradados de colores ni neón.

## 7. Logos

1. Primero en `03-logos/` (más de 100: un PNG transparente por marca, ej. `openai.png`; con el nombre escrito: `openai-texto.png`). La lista está en `03-logos/LEEME.txt`.
2. Si falta, `node scripts/logo.mjs <nombre>` lo busca en Wikimedia Commons y, si está bloqueado, en el paquete `simple-icons` de npm, y lo guarda en `03-logos/` para la próxima vez. El render lo hace solo si nota que falta uno.
3. Si nada funciona, se sigue con lo demás y al final se dice qué archivo hay que subir.

## 8. Sonido

- Solo efectos, **sin música**, generados con código (`scripts/sfx.py` → `public/sfx/`). Nada de bancos de sonidos.
- Cada efecto va atado a su animación (lo calcula `src/jpr/plan.ts`, así imagen y sonido salen de la misma fuente):

| Efecto | Suena cuando… |
|---|---|
| `whoosh` | entra una captura, una comparación, un destello o cambia el tipo de tramo |
| `pop` | entra un chip, un logo, un ícono de app, la alerta de la barra, la tarjeta buena, la pastilla del CTA |
| `tic` | la cifra cuenta (6 tics en 18 fotogramas) |
| `clic` | aparece una insignia o se envía el comentario del CTA |
| `tecleo` | cada letra que se escribe en el chip del CTA |
| `trazo` | se dibuja un recuadro, un marcador, una barra, una gráfica, una línea de nodos, un tachado o la raya de la firma |

- Los efectos van suaves, alrededor de **−24 LUFS** (cada uno normalizado; la mezcla final se mide y aparece en la hoja de montaje).

## 9. Biblioteca: cuando se dice… → pieza

| Cuando se dice… | Pieza |
|---|---|
| El gancho (0–3 s) | Tramo a cámara (el editor pone el subtítulo en CapCut). |
| Se nombra una marca o herramienta | `TarjetaLogo` o `IconoApp`, en esa palabra. |
| Se muestra una página o un dato | `Captura` con `recuadro` y `marcador`. |
| Se dice un número | `Cifra` que cuenta. |
| Métrica de marketing (ROAS, CAC, CPA, CTR) | `Grafica` (sola o debajo de la `Cifra` con `datos.grafica`). |
| Problema, riesgo o error | `PilaChips` con alerta. |
| Algo llega al límite | `Barra`. |
| Pasos ("primero… luego…") | `Insignia` con número + `PilaChips` con `"numerados": true`. |
| Proceso o automatización | `Nodos`. |
| Antes vs. después / algo "no es" | `Comparacion`. |
| Remate o frase emocional | `Texto` con la palabra en Lora Italic (`*palabra*`). |
| Cambio de bloque grande | `"destello": true` (máximo uno cada 12 s). |
| Llamado a comentar | `Cta`. |
| Fin del reel | `Firma` (1 s). |

---

## 10. Cómo se arma un reel

```
kit-jpr/
├── 04-reels/<nombre>/          audio o .srt, guion, capturas y escenas.json del reel
└── proyecto-remotion/
    ├── ESTILO.md                este archivo
    ├── src/jpr/ui.tsx           las piezas
    ├── src/jpr/plan.ts          tiempos, efectos y avisos de estilo
    ├── demo/escenas.json        ejemplo con todas las piezas
    ├── out/<nombre>/            entregables
    └── revision/<nombre>/       hojas de fotogramas para revisar
```

1. Escribir `04-reels/<nombre>/escenas.json` (formato abajo). Las capturas van en la misma carpeta.
2. Un solo comando (usa todos los núcleos del computador):
   ```
   cd kit-jpr/proyecto-remotion
   npm install          # solo la primera vez
   npm run reel -- <nombre>
   ```
3. Sale en `out/<nombre>/`:
   - `<nombre>-motion.mp4` → 1080×1920, H.264, con efectos, con los fps y la duración exacta del reel, empieza en 00:00.
   - `<nombre>-motion-mudo.mp4` → igual, sin sonido.
   - `<nombre>-efectos.wav` → solo los efectos.
   - `<nombre>-hoja-de-montaje.txt` → cada tramo con su tiempo (mm:ss:ff), tipo y qué hace el editor.
4. Revisar `revision/<nombre>/hoja-escenas.png` (un fotograma por escena, zonas seguras en rojo, línea en y = 960, área de zoom) y `hoja-movimiento.png` (a mitad de cada animación). Leer los avisos (⚠) que imprime el comando y corregir.

Otros comandos: `npm run studio` (vista previa del demo), `npm run demo` (vuelve a sacar el demo), `npm run sfx` (regenera los efectos), `npm run tipos` (revisa el código).

## 11. Formato de `escenas.json`

```json
{
  "nombre": "mi-reel",
  "fps": 30,
  "duracion": "00:42:17",
  "escenas": [
    {"inicio": 0, "fin": 2.4, "tramo": "a-camara"},
    {"inicio": 2.4, "fin": 5.1, "tramo": "mitad", "pieza": "PilaChips",
     "insignia": {"numero": 1, "etiqueta": "el problema"},
     "datos": {"chips": [{"texto": "tu CPA sube", "en": 2.6}, {"texto": "la audiencia se cansa", "en": 3.3}]},
     "texto": "y nadie te *avisa*", "textoEn": 4.2}
  ]
}
```

- **Tiempos**: en segundos (`8.4`) o en `"mm:ss:ff"` (fotogramas). Siempre absolutos del reel (no relativos a la escena).
- `fps` y `duracion`: los del video de Juan Pablo (normalmente 25 o 30).
- Cada escena: `inicio`, `fin`, `tramo` (`mitad` · `completa` · `a-camara`), y opcionales `pieza`, `texto`, `textoEn`, `insignia`, `destello`, `datos`, `nota` (sale en la hoja de montaje).
- Todos los `en` son opcionales: si faltan, las piezas entran escalonadas solas. Para que entren en la palabra exacta, ponerlos.
- `insignia`: `{"numero": 2, "etiqueta": "el paso", "puntos": 3, "actual": 2, "en": 10.2}`.

| Pieza | `datos` |
|---|---|
| `Texto` | (nada; usa `texto`) |
| `Chip` | `{"texto": "tu CPA sube", "icono": "alerta", "en": 3.1}` |
| `PilaChips` | `{"chips": [{"texto": "…", "en": 3.1, "icono": "alerta"}], "numerados": false, "actual": 2}` (máximo 4 chips) |
| `Barra` | `{"etiqueta": "presupuesto", "en": 4.0, "llenoEn": 5.0, "hasta": 100}` (al 100 % se pone lima con alerta) |
| `Cifra` | `{"valor": 4.2, "prefijo": "", "sufijo": "x", "etiqueta": "[ROAS]", "en": 6.2, "grafica": {"tipo": "barras", "valores": [2, 3, 4.2]}}` |
| `Grafica` | `{"tipo": "barras" o "linea", "valores": [1, 2, 3], "etiquetas": ["ene", "feb", "mar"], "en": 7}` (los valores solo dan la forma; no se muestran cifras) |
| `TarjetaLogo` | `{"logos": [{"logo": "meta", "en": 9.0}, {"logo": "openai-texto", "en": 9.4}]}` (máximo 3) |
| `IconoApp` | `{"logo": "notion", "en": 12}` |
| `Captura` | `{"imagen": "captura1.png", "en": 11, "gigante": {"texto": "gratis", "en": 11.1}, "icono": {"logo": "meta", "en": 11.3}, "recuadro": {"x": 0.04, "y": 0.29, "w": 0.33, "h": 0.09, "en": 11.6}, "marcador": {"x": 0.05, "y": 0.30, "w": 0.21, "h": 0.07, "en": 12}}` (x, y, w, h en fracción de la imagen, de 0 a 1) |
| `Nodos` | `{"centro": {"texto": "tu CRM"}, "nodos": [{"logo": "whatsapp", "en": 14}, {"texto": "web"}], "en": 13.5}` (máximo 4 nodos) |
| `Comparacion` | `{"mal": {"titulo": "antes", "texto": "agencia tradicional", "en": 15.2}, "bien": {"titulo": "ahora", "texto": "sistema con IA", "en": 16}}` |
| `Cta` | `{"palabra": "ADS", "en": 17}` y en `texto` lo que recibe: `"y te mando la *guía*"` |
| `Firma` | `{}` (1 s, tramo `completa`, al final) |

Chips solo con ícono (reels sin texto): `"texto": ""` y `"tam"` en `datos` (ej. 110 en mitad, 140 en completa): queda una ficha cuadrada con el ícono centrado.

Íconos de línea disponibles para chips: `alerta`, `check`, `x`, `sube`, `baja`, `reloj`, `rayo`, `usuario`, `dinero`, `grafica`, `comentario`.

El comando avisa (⚠) si algo rompe el estilo: textos de más de 6 palabras o con punto final, más de 3 palabras de acento, tramos de menos de 1,5 s, Juan Pablo solo más de 4 s, destellos a menos de 12 s, escenas que se montan, reel sin firma.
