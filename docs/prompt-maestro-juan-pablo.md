# Prompt maestro de producción — Juan Pablo Ramos P. (JPR)

**Fuentes del análisis**
- **Manual "Identidad Cromática y Tipográfica — Juan Pablo Ramos P."** (6 páginas, copia en `docs/branding-juan-pablo/`). Define los colores, las proporciones, las tipografías y la aplicación en el feed. Es la fuente principal.
- **Página 6, "Aplicación en el Feed"**: 3 portadas de reels ("SER VIRAL NO VENDE", "TU es como el MARKETING… FUTBOL", "50 ANUNCIOS en una TARDE"). De ahí sale el estilo de texto en pantalla.
- **El motor de este repositorio** (tiempos atados a palabras, sonido por código, revisión de zonas seguras). Se reutiliza tal cual; el **estilo visual de Escuela Invora NO se usa** para este cliente.
- **El reel de referencia** (`instagram.com/p/DeZFNLUCQ1s`) **sigue sin revisarse**: Instagram está bloqueado desde el entorno de trabajo. Los tiempos de animación de abajo son una propuesta coherente con las portadas y hay que confirmarlos con el video (ver "Pendientes").

---

## PARTE 1 · Análisis

### 1.1 Paleta oficial y proporción de uso

| Color | HEX | RGB | Uso según el manual | Proporción |
|---|---|---|---|---|
| Azul Medianoche | `#0A1F44` | 10, 31, 68 | Base y fondos, lienzo principal | **50 %** |
| Blanco | `#FFFFFF` | 255, 255, 255 | Textos generales y aire | **25 %** |
| Verde Lima | `#C8F542` | 200, 245, 66 | Acento, palabras clave y botones | **15 %** |
| Azul Eléctrico | `#2F5FFF` | 47, 95, 255 | Formas, gráficos y líneas separadoras | **10 %** |

Lo que comunica cada color, según el manual:
- **Azules**: confianza y solidez (empresas que invierten en pauta).
- **Lima**: inteligencia artificial y resultados medibles; rompe con la estética de agencia tradicional.
- **Blanco**: claridad para explicar métricas como CAC, ROAS y LTV sin saturar.

Rojo, morado o rosado aparecen solo dentro de íconos 3D de plataformas (avión de Instagram, globo "99+"), nunca en textos ni fondos.

### 1.2 Tipografía (fuentes incrustadas en el PDF)

| Nivel | Fuente | Uso |
|---|---|---|
| Titular / gancho | **Poppins Black (900)**, MAYÚSCULAS | Palabras clave de ganchos y portadas ("PRODUCE 50 ANUNCIOS EN UNA TARDE") |
| Conectores | Poppins Bold/SemiBold (700/600), minúsculas | Palabras de unión dentro del titular ("es como el", "en una") |
| Subtítulo | Poppins Regular/Medium (400/500) | Frase de apoyo bajo el titular ("Estrategia, guion y estructura que convierten.") |
| Cuerpo | **Open Sans** Regular/Medium | Textos largos y explicación de métricas |

Patrón de las portadas:
- Las **palabras clave van en MAYÚSCULAS, gigantes y en lima** (o en blanco con la última línea en lima).
- Los **conectores van en minúscula, pequeños y blancos**, encajados entre las palabras grandes.
- El interlineado es muy cerrado (≈0,9) y el tracking va ligeramente negativo.
- Una **raya lima** subraya la palabra que niega o remata ("NO", "FUTBOL").
- Una **cifra grande** puede ir pegada a la palabra ("50 ANUNCIOS").

### 1.3 Composición en el feed

- **Presentador en cámara**, centrado en la mitad inferior. Fondo de estudio o pódcast, o bien un tablero de métricas oscuro detrás (gráficos de barras, embudos LEADS→OPPS→SALES, ROAS, CAC).
- **El titular ocupa el tercio superior y medio** (más o menos entre y 380 y y 1000), y a veces un remate en la parte baja ("FUTBOL" a la altura del pecho).
- **El texto puede ir detrás de la cabeza** del presentador ("MARKETING"): se recorta a la persona y el texto queda entre el fondo y ella.
- **Íconos 3D brillantes** se montan sobre el texto (avión de Instagram con globo rojo "99+").
- **Distintivo de marca**: un cuadro lima redondeado con el símbolo en línea oscura, pegado al borde derecho.
- **Fondos del manual sin presentador**: azul medianoche con bloques diagonales de azul eléctrico y un acento lima (p. 1, 2, 4, 6).

### 1.4 Diferencias con el kit actual del repositorio (Escuela Invora)

| | Invora (no usar) | Juan Pablo |
|---|---|---|
| Fondo | `#0f1420` + cuadrícula | `#0A1F44` + diagonales eléctricas / presentador / tablero de métricas |
| Acento | azul `#2a9dff` | **lima `#C8F542`** |
| Fuente | Montserrat | **Poppins** + Open Sans |
| Mayúsculas | todo minúsculas | **CLAVES EN MAYÚSCULAS** + conectores en minúscula |
| Íconos | línea blanca que se enciende | 3D brillantes + línea en lima/eléctrico |
| Imagen | solo gráficos | presentador en cámara |

### 1.5 Sistema técnico reutilizable (propuesto)

| Pieza | Qué hace | Entrada | Sonido |
|---|---|---|---|
| `Gancho` | Titular de portada con claves grandes + conectores pequeños | golpe de escala 1,35→1 con rebote, 8 f | golpe grave + whoosh |
| `Clave` | Palabra en MAYÚSCULA lima o blanca | palabra por palabra cada 3 f, escala 1,3→1, sube 30 px | pop |
| `Conector` | Minúsculas blancas pequeñas | aparece y se desliza 20 px, 5 f | — |
| `Subraya` | Raya lima bajo una palabra | se dibuja de izquierda a derecha, 8 f | swish corto |
| `Cifra` | Número grande que cuenta | conteo 18 f + golpe | conteo |
| `Icono3D` | PNG 3D del kit (Instagram, globo, etc.) | rebote 0→1,1→1 con giro, flota | pop + brillo |
| `Globo` | Notificación roja "99+" | salta y cuenta | campanita |
| `Metrica` | Tarjeta de KPI (ROAS, CAC, LTV) en azul eléctrico | sube 40 px + conteo | tic + conteo |
| `Embudo` / `Barras` | Gráfico de embudo o de barras eléctrico/lima | barras crecen escalonadas 2 f | tics |
| `Sello` | Cuadro lima con el símbolo JPR | entra por la derecha, 10 f | whoosh suave |
| `Fondo` | Medianoche + diagonales eléctricas que se deslizan | continuo | — |
| `Recorte` | Texto detrás del presentador (máscara de persona) | — | — |

---

## PARTE 2 · Prompt final de producción

```text
Vas a crear los motion graphics de un reel para el cliente JUAN PABLO RAMOS P. (marca JPR), todo con código y sin abrir ningún programa de edición: Remotion para montarlo, ffmpeg para tratar el audio y el video, y whisper.cpp para transcribir en mi computador. Háblame en español de Colombia, claro y sin tecnicismos.

MATERIAL

* Guion: [pega aquí el guion completo]
* Audio guía de la voz: [ruta del audio]. Solo sirve para saber en qué momento va cada cosa. El video final NO lleva la voz; el cliente la agrega después.
* Video del presentador (si lo hay): [ruta del clip]. Se usa sin su audio.
* Duración final exacta: [hh:mm:ss:ff]
* Kit del cliente: docs/branding-juan-pablo/ (manual de identidad y ejemplos del feed), carpeta de activos con el símbolo JPR, íconos 3D, tableros de métricas de fondo y videos de referencia, y este proyecto de Remotion. Reutiliza el motor del proyecto (src/tiempos.ts, scripts/transcribir.sh, scripts/alinear_guion.py, scripts/sonido.py, scripts/fotogramas.mjs, scripts/hoja.py), pero NO el estilo visual de Escuela Invora (Montserrat, cuadrícula, azul #2a9dff). Las piezas de Juan Pablo van en su propia carpeta, src/jpr/. Si falta un logo o ícono, me lo pides; no lo dibujas ni lo inventas.

IDENTIDAD VISUAL (obligatoria, basada en el branding de Juan Pablo)

* Formato: vertical 1080×1920 a 30 fps.
* Fondo: Azul Medianoche #0A1F44 como lienzo principal, con bloques diagonales de Azul Eléctrico #2F5FFF muy suaves que se deslizan lento y un degradado más oscuro hacia los bordes. Cuando hay presentador, el fondo es su video; cuando el guion habla de resultados, pauta o métricas, detrás puede ir un tablero de métricas oscuro, desenfocado y bajado de brillo, para que el texto se lea. Proporción de color en pantalla: 50 % medianoche, 25 % blanco, 15 % lima, 10 % eléctrico.
* Tipografía: Poppins para todo lo que se lee en pantalla. Poppins Black (900) para las palabras clave, Poppins Bold (700) o SemiBold (600) para los conectores y Poppins Medium (500) para subtítulos. Open Sans (400/500) solo para textos largos o explicativos (más de 8 palabras). Instala las dos con @fontsource y cárgalas como archivos locales.
* Mayúsculas y minúsculas: las palabras clave van en MAYÚSCULAS (verbo, cifra, resultado, la palabra que niega). Los conectores ("es como el", "en una", "de", "que") van en minúscula y a menos de la mitad del tamaño de la clave, encajados entre las palabras grandes. Subtítulos y cuerpo en minúscula, con mayúscula solo al inicio.
* Texto: claves de 130 a 200 px, conectores de 56 a 72 px, subtítulos de 44 a 52 px, cifras de 220 a 300 px. Interlineado 0,9 y tracking −0,02 em en las claves. Sombra suave oscura (0 8px 24px rgba(10,31,68,0.85)) para leerse sobre el video. Máximo 2 claves grandes por pantalla y un titular de 2 a 6 palabras en total; resume la frase, no la copies completa.
* Color de acento: Verde Lima #C8F542 en la palabra clave o en la última línea del titular, en la raya que subraya, en botones y en el sello de marca. Resplandor lima sutil (0 0 30px rgba(200,245,66,0.45)) solo en la palabra que remata.
* Colores de apoyo: Blanco #FFFFFF para el resto de las claves, los conectores y los subtítulos. Azul Eléctrico #2F5FFF para gráficos, barras, embudos, tarjetas de métricas y líneas separadoras. No uses otros colores en textos ni fondos; el rojo solo existe dentro del globo de notificación 3D.
* Logos y elementos gráficos: el sello de marca es un cuadro lima redondeado con el símbolo JPR en línea medianoche. Entra por el borde derecho en 10 fotogramas en el gancho y en el cierre, y queda fijo y pequeño. Íconos de plataformas (Instagram, Meta, Google, TikTok) en versión 3D brillante del kit, montados sobre el texto, con rebote y flotación. Logos de terceros siempre del kit, nunca redibujados.

ESTILO DE ANIMACIÓN (extraído de las portadas del feed de Juan Pablo; confirmar con el video de referencia)

* Entrada de textos: el gancho entra con un golpe: la clave pasa de escala 1,35 a 1 en 8 fotogramas con rebote corto (damping 12, masa 0,6, rigidez 180) y una sacudida de cámara de 6 fotogramas. Después, palabra por palabra al ritmo de la voz: cada clave entra en la palabra exacta del audio, escala 1,3→1 y sube 30 px; los conectores aparecen y se deslizan 20 px en 5 fotogramas. La raya lima se dibuja de izquierda a derecha en 8 fotogramas bajo la palabra que niega o remata. Las cifras cuentan hasta su valor en 18 fotogramas y rematan con un golpe de escala del 10 %. El primer fotograma del video ya muestra el gancho completo y legible (portada).
* Gráficos e íconos: los íconos 3D entran con rebote 0→1,1→1, un giro de −8° a 0° y luego flotan (±6 px, ±2°). Globo de notificación rojo que salta y cuenta ("99+"). Gráficos de datos en azul eléctrico con el valor destacado en lima: barras que crecen escalonadas cada 2 fotogramas, embudos que se llenan de arriba abajo y tarjetas de KPI (ROAS, CAC, LTV, AOV) que suben 40 px y cuentan. Las cifras solo salen del guion.
* Texto detrás del presentador: cuando hay video del presentador y la palabra clave cruza su cabeza, recorta a la persona (máscara de segmentación por fotograma, por ejemplo con rembg o robust-video-matting) y pon el texto entre el fondo y ella. Si el recorte no queda limpio, el texto va delante; nunca un recorte con bordes sucios.
* Transiciones y ritmo: cambio de titular en cada frase del guion, de 1 a 3 s; ritmo rápido de pauta digital. La salida dura 5 fotogramas (escala 1→0,92 y desvanecido, o barrido hacia arriba de 6 fotogramas en los cambios de tema). Fondo y tablero con acercamiento lento continuo (1→1,08 por escena). Golpe de cámara solo en ganchos, cifras y remates. Nada de transiciones decorativas (cubos, giros, destellos de color).
* Componentes modulares: crea en src/jpr/ las piezas Fondo, Escena, Gancho, Clave, Conector, Subraya, Cifra, Icono3D, Globo, Metrica, Embudo, Barras, Sello y Recorte, con los colores y fuentes como constantes de marca en un solo archivo (src/jpr/marca.ts). Cada pieza recibe el fotograma de entrada con en('frase', n). Muéstrame las piezas en una composición de prueba antes de montar el reel.

ZONAS SEGURAS (Interfaz de Instagram / TikTok)

* Todo lo importante va dentro del rectángulo x 70–930 y y 300–1520.
* Nada crítico en los 250 px de arriba (nombre de la cuenta), en los 380 px de abajo (descripción, audio y barra) ni en los 140 px de la derecha (botones de me gusta, comentar y compartir). El sello lima puede tocar el borde derecho, pero siempre por encima de y 900, para no quedar bajo los botones.
* Los titulares van preferiblemente entre y 380 y y 1000, sin tapar la cara del presentador.
* Si una clave no cabe, se reduce o se parte en otra línea; nunca se sale del rectángulo.

SONIDO

* Música de fondo generada por código: base electrónica moderna y limpia de 110 a 120 BPM (bombo suave, sintetizador con filtro, sin melodía protagonista), con entrada y salida en desvanecido. Va por debajo de los efectos.
* Efectos sintetizados por código, atados al mismo fotograma de su animación: golpe grave + whoosh en el gancho, pop en cada clave, swish corto en cada raya, conteo en las cifras, tics en barras y embudos, pop con brillo en cada ícono 3D, campanita en el globo de notificación, whoosh suave en el sello y en los cambios de tema.
* Mezcla final a −24 LUFS integrados (rango permitido −14 a −24) y picos por debajo de −1 dBFS, a 48 kHz estéreo.

REGLAS

* No inventar datos, cifras, métricas ni nombres que no estén en el guion. Los valores de los tableros de fondo son decorativos y van desenfocados; ninguna cifra legible puede contradecir el guion.
* Respetar estrictamente los tiempos del audio guía: cada animación se ata a una palabra con en('frase', n), nunca a un segundo escrito a mano.
* Si whisper escucha mal una palabra, se corrige con el guion (alinear_guion.py); no se cambia el guion.
* Respetar la paleta y la proporción del manual; nada de colores fuera de la paleta.
* Automatizar la revisión de zonas seguras y la exportación limpia.
* No tocar las piezas de Escuela Invora (src/robots/) ni romper sus composiciones.

ORDEN DE TRABAJO (paso a paso interactivo)

1. Prepárate: valida Node, ffmpeg, whisper.cpp (modelo medium en español) y Python (numpy, scipy, pyloudnorm, Pillow; y rembg o robust-video-matting si hay presentador). Instala @fontsource/poppins y @fontsource/open-sans. Dime qué falta antes de seguir.
2. Transcribe: pasa el audio a 16 kHz mono con ffmpeg y transcribe con scripts/transcribir.sh palabra por palabra, con las marcas y términos del guion en el --prompt (ROAS, CAC, LTV, Meta Ads, etc.). Guarda la transcripción y confirma que la duración cuadra con la duración final.
3. Planifica: muéstrame una tabla tiempo → frase → titular en pantalla (claves en MAYÚSCULA, conectores en minúscula) → pieza y animación → efecto de sonido → ¿va detrás del presentador? Espera mi aprobación antes de construir.
4. Construye: crea src/jpr/ con las piezas y la composición del reel, cada elemento atado a su palabra. Corre la revisión de claves: todas las frases deben existir en la transcripción.
5. Sonoriza: escribe los eventos de sonido con los mismos fotogramas de las animaciones y genera la mezcla a −24 LUFS. Haz también la versión solo música.
6. Revisa antes de entregar: renderiza un fotograma por escena y otro a mitad de cada animación, y arma las hojas con las zonas seguras marcadas. Verifica que nada se salga del rectángulo, que se lea en el celular, que la proporción de color se parezca a la del manual, que el texto no tape la cara, que los recortes estén limpios y que el primer fotograma sea un gancho legible. Muéstrame las hojas.
7. Renderiza y entrega en la carpeta out/:
   - [nombre]-gráficos.mov: solo gráficos con transparencia (ProRes 4444) para montar sobre el clip del presentador.
   - [nombre]-mudo.mp4: versión completa sin sonido.
   - [nombre]-con-musica.mp4: música y efectos.
   - [nombre]-solo-musica.wav y [nombre]-musica-y-efectos.wav.
   Todo en 1080×1920, 30 fps y duración exacta; los MP4 en H.264.
8. Resumen final: lista de archivos con duración, sonoridad medida, decisiones que tomaste y cualquier cosa que el cliente deba revisar.
```

---

## Pendientes para cerrar el análisis

1. **El reel de referencia**: súbelo como archivo para confirmar los tiempos de entrada, la ubicación real del texto, si hay subtítulos palabra a palabra y el tipo de música.
2. **Activos**: símbolo JPR en vector (SVG/PNG transparente), íconos 3D y tableros de fondo.
3. **Presentador**: falta saber si cada reel trae clip del presentador o si es 100 % gráfico. Eso decide si se entrega el `.mov` con transparencia y si se usa el recorte.
4. **Guion de prueba**: con él se arma la tabla del paso 3.
