# Prompt maestro de producción — estilo Juan Pablo (Escuela Invora)

> **Fuente del análisis.** No se pudo abrir el reel de Instagram (`instagram.com/p/DeZFNLUCQ1s`) desde el entorno de trabajo: el acceso a Instagram está bloqueado. Tampoco llegaron el manual de marca ni el guion de prueba (venían como marcadores `[Inserta…]`).
> Por eso el análisis sale del **kit del cliente que ya está en este repositorio**: el reel "Día 5 · Uber" (74 s, 23 escenas), la intro "Día X de 12", las piezas de `src/robots/`, el generador de sonido `scripts/sonido.py` y las hojas de revisión de `revision/`. Antes de producir, hay que comparar este documento con el reel de referencia y corregir lo que no coincida.

---

## PARTE 1 · Análisis del estilo

### 1.1 Estructura y ritmo (reel de 74 s)

| Tramo | Tiempo | Función | Qué se ve |
|---|---|---|---|
| Gancho | 0:00–0:13 | Contradicción + prueba | Titular legible desde el **fotograma 0** ("la gente está *vendiendo* uber"), logo, insignia numerada 1-2-3 arriba, cifra gigante que cuenta ($10) |
| Marca de serie | 0:15–0:17 | Identidad | Insignia "5 de 12" + calendario que se dibuja + "de la escuela" + INVORA espaciado |
| Desarrollo | 0:17–0:55 | Problema → datos → giro | Un ícono o logo por idea, carretera con robotaxis, cuadrícula 10×, chat de Invora que se escribe solo |
| Matiz | 0:58–1:02 | Credibilidad | "ojo" + texto tachado en rojo que cae |
| Llamado a la acción | 1:04–1:09 | Comentar palabra clave | "comenta *uber*", teclas U-B-E-R, caja de comentario, notificación de Invora |
| Cierre | 1:09–1:14 | Firma | ✔/✖ comparativo, "por eso armé INVORA", "soy *Miguel*", insignia "mañana: día 6" |

- **Cortes**: escena nueva por cada frase del guion, en promedio cada **≈3 s** (rango 1,5–5 s). La escena arranca **3 fotogramas antes** de la palabra que la dispara.
- **Dentro de cada escena** entran 2–4 elementos escalonados, cada uno en la palabra exacta que lo nombra.
- **Salida**: desvanecido + desenfoque (14 px) + leve acercamiento en **6 fotogramas (0,2 s)**. No hay cortina ni barrido.
- **Composición**: siempre una columna centrada (ícono/logo arriba, titular abajo), sin tercios inferiores ni subtítulos palabra a palabra.

### 1.2 Paleta

| Rol | Color | Uso |
|---|---|---|
| Fondo | `#0f1420` (tinta) + textura de cuadrícula azul + viñeta radial | Siempre el mismo |
| Acento | `#2a9dff` | Palabra clave, cifras, íconos encendidos, insignias |
| Acento oscuro | `#0b63d6` | Rellenos secundarios de íconos |
| Resplandor | `rgba(42,157,255,0.6)` | Brillo alrededor de todo lo azul |
| Texto | `#ffffff` con sombra `0 6px 16px rgba(0,0,0,.9)` | Titulares |
| Apoyo | `#8b95a8` | Frases puente ("el miedo supone que", "de") |
| Alerta | `#ff4d5e` | Tachado, "no", raya roja |

### 1.3 Tipografía

- **Montserrat** únicamente. 900 Black para titulares, 800 ExtraBold para apoyos, 500 Medium solo para el logotipo INVORA (espaciado 0,32 em).
- **Todo en minúsculas**, incluso nombres de marca ("uber", "comenta uber"). Excepciones: logotipo INVORA, teclas U-B-E-R, nombres propios de personas ("Nancy Pelosi", "Miguel").
- Tamaños: titular 96–124 px, normal 70–88 px, apoyo 50–64 px, cifra gigante 300–340 px. Interlineado 1,08, tracking −0,01 em.
- Máximo **3 líneas** y 1–3 palabras resaltadas en azul por titular (marcadas con `*asteriscos*`).

### 1.4 Elementos característicos

- **Ícono que se dibuja y se enciende**: trazo blanco de 5,5 px dibujado en 15 fotogramas, luego relleno azul con rebote y 8 rayitos que giran.
- **Logos de terceros** en tarjeta blanca redondeada (radio 32) con resplandor azul y brillo que la cruza.
- **Insignia numerada**: círculo azul con número tipo tragamonedas (7→4→9→n) + etiqueta + puntos de progreso.
- **Cifra que cuenta** de 0 al valor en 22 fotogramas y remata con un golpe de escala.
- **Piezas de interfaz**: chat de Invora, caja de comentario, notificación, teclas, ✔/✖, tachado, cuadrícula, carretera con robotaxis.

### 1.5 Zonas seguras

- Contenido crítico dentro de **x 70–930, y 300–1520**.
- Prohibido: franja superior 0–250 px, franja inferior 1540–1920 px (descripción y audio) y columna derecha 940–1080 px (botones).

### 1.6 Sistema técnico reutilizable (Remotion)

| Pieza | Duración de entrada | Sonido |
|---|---|---|
| `Texto` (palabra por palabra) | resorte por palabra cada 2 f, sube 46 px, rota ±6° | whoosh 0,55 |
| `Logo` | resorte 0,5→1 + giro −6° | pop |
| `Icono` | dibujo 15 f + encendido | trazo + campanita a +15 f |
| `Insignia` | 3 tics (cada 3 f) + pop a +9 f | tic ×3 + pop |
| `Cifra` | conteo 22 f + golpe | conteo |
| `LogoInvora` | desenfoque y espaciado 18 f + raya a +14 f | whoosh + trazo |
| `Cuadricula` | una pieza cada 2 f | pop 0,35 por pieza |
| `Escena` | sale en 6 f; golpes de cámara opcionales (12 f) | — |

Movimiento continuo en modo dinámico: el fondo se acerca 1→1,12 en todo el video, partículas azules suben, la cámara flota (±8 px) y empuja 2,5 % por escena, y los brillos laten a 100 BPM (cada 18 fotogramas).

---

## PARTE 2 · Prompt final de producción

```text
Vas a crear los motion graphics de un reel para el cliente JUAN PABLO (Escuela Invora), todo con código y sin abrir ningún programa de edición: Remotion para montarlo, ffmpeg para tratar el audio y whisper.cpp para transcribir en mi computador. Háblame en español de Colombia, claro y sin tecnicismos.

MATERIAL

* Guion: [pega aquí el guion completo]
* Audio guía de la voz: [ruta del audio]. Solo sirve para saber en qué momento va cada cosa. El video final NO lleva la voz; el cliente la agrega después.
* Duración final exacta: [hh:mm:ss:ff]
* Número del día de la serie: [X] de 12
* Kit del cliente: este repositorio. Úsalo como base y no lo reescribas: src/robots/ui.tsx (piezas de marca), src/robots/piezas.tsx (chat, comentario, notificación, teclas, sí/no, tachado, cuadrícula, raya roja), src/robots/carros.tsx (robotaxi, caravana, carretera), src/robots/iconos.ts, public/fondo-cuadricula.png, public/fuentes/ y public/logos/. Los logos de otras marcas los entrega el cliente; si falta uno, me lo pides, no lo dibujas.

IDENTIDAD VISUAL (obligatoria, basada en el branding de Juan Pablo)

* Formato: vertical 1080×1920 a 30 fps.
* Fondo: siempre el mismo. Color tinta #0f1420, encima la textura de cuadrícula azul (fondo-cuadricula.png) con un acercamiento lento de 1 a 1,12 durante todo el video, un resplandor azul suave en el centro y viñeta oscura en los bordes. Partículas de luz azules y blancas que suben despacio. Nada de fotos, videos de archivo ni otros colores de fondo.
* Tipografía: solo Montserrat. 900 (Black) para titulares, 800 (ExtraBold) para frases de apoyo, 500 (Medium) solo para el logotipo INVORA con letras muy separadas (0,32 em) y una raya azul debajo. Titulares de 96 a 124 px, texto normal de 70 a 88 px, apoyos de 50 a 64 px, cifras gigantes de 300 a 340 px. Interlineado 1,08.
* Mayúsculas y minúsculas: todo en minúsculas, también las marcas ("uber", "comenta uber"). Solo van con mayúscula los nombres de personas, el logotipo INVORA y las teclas del llamado a la acción. Máximo 3 líneas por titular. Signos de pregunta de apertura y cierre (¿?).
* Texto: blanco #ffffff, centrado, con sombra negra 0 6px 16px al 90 %. Escribe el titular resumido, no la frase completa del guion: 2 a 7 palabras que se lean en un vistazo.
* Color de acento: azul #2a9dff con resplandor rgba(42,157,255,0.6). Va en 1 a 3 palabras clave por titular (las marcas con *asteriscos*), en cifras, íconos encendidos e insignias. El resplandor late con la música.
* Colores de apoyo: azul oscuro #0b63d6 para rellenos secundarios, gris #8b95a8 para frases puente, rojo #ff4d5e solo para negar, tachar o marcar "no".
* Logos y elementos gráficos: los logos de otras marcas van dentro de una tarjeta blanca redondeada (radio 32 px) con resplandor azul; entran con rebote de 0,5 a 1 y un giro de −6° a 0°, flotan suave y un brillo los cruza una vez. El logotipo INVORA entra desenfocado y con las letras abiertas que se cierran en 0,6 s, y a los 14 fotogramas se dibuja su raya azul. La insignia "Día X de 12" (círculo azul con el número que gira tipo tragamonedas) aparece después del gancho, junto al calendario que se dibuja, "de la escuela" e INVORA; al final se repite como "mañana: día X+1".

ESTILO DE ANIMACIÓN (extraído del video de referencia de Juan Pablo)

* Entrada de textos: palabra por palabra, una cada 2 fotogramas; cada palabra sube 46 px, pasa de escala 0,5 a 1 y de una rotación de ±6° a 0° con un resorte rebotón (damping 10, masa 0,5, rigidez 170). El primer titular del video NO anima: está completo desde el fotograma 0 para que la portada se lea.
* Gráficos e íconos: íconos de línea blanca de 5,5 px con puntas redondas, en caja de 100×100. Se dibujan en 15 fotogramas y luego se "encienden": rellenos en azul, rebote de escala del 12 %, 8 rayitos azules alrededor que giran despacio, y flotan. Cifras: cuentan de 0 al valor en 22 fotogramas y rematan con un golpe de escala. Listas numeradas: insignia arriba con el número y puntos de progreso.
* Transiciones y ritmo: una escena por frase del guion, de 1,5 a 5 s (unas 3 s en promedio). La escena empieza 3 fotogramas antes de su primera palabra. Dentro de la escena, cada elemento entra en la palabra exacta que lo nombra. Salida en 6 fotogramas: desvanecido, desenfoque de 14 px y leve acercamiento. Cámara: llega desde 1,05, empuja 2,5 % durante la escena y flota ±8 px; en las frases de impacto, un golpe de cámara (sacudida de 12 fotogramas). Sin cortinas, barridos ni efectos de cambio de escena.
* Componentes modulares: Fondo, Escena, Columna, Fila, Texto (con *resaltado*), Logo, Cifra, Insignia, Icono, LogoInvora, ChatInvora, Comentario, Notificacion, Teclas, SiNo, Tachado, Cuadricula, RayaRoja, Robotaxi, Caravana y Carretera. Reutiliza estas piezas; solo crea una nueva si el guion la necesita, en el mismo estilo, y me avisas.
* Estructura del reel: gancho con contradicción y titular legible en el fotograma 0 → insignia "Día X de 12" + calendario + INVORA → desarrollo con un ícono o logo por idea → matiz ("ojo") → llamado a la acción ("comenta *palabra*" con teclas, caja de comentario y notificación de Invora) → cierre con INVORA, firma y "mañana: día X+1".

ZONAS SEGURAS (Interfaz de Instagram / TikTok)

* Todo lo importante va dentro del rectángulo x 70–930 y y 300–1520.
* Nada crítico en los 250 px de arriba (nombre de la cuenta), en los 380 px de abajo (descripción, audio y barra) ni en los 140 px de la derecha (botones de me gusta, comentar y compartir).
* Si un titular no cabe, se reduce o se parte en otra línea; nunca se sale del rectángulo.

SONIDO

* Música lo-fi a 100 BPM generada por código (piano eléctrico, bajo, batería suave con swing y crujido de vinilo), con entrada y salida en desvanecido. Va por debajo de los efectos.
* Efectos sintetizados por código, atados al mismo fotograma de su animación: whoosh en cada texto, pop en cada logo, trazo + campanita en cada ícono (al dibujarse y al encenderse), 3 tics + pop en la insignia, conteo en las cifras, tecleo en chats y teclas, "no" en tachados y negaciones, pops suaves en cada pieza de una cuadrícula.
* Mezcla final a −24 LUFS integrados (rango permitido −14 a −24) y picos por debajo de −1 dBFS, a 48 kHz estéreo.

REGLAS

* No inventar datos, cifras, nombres ni logos que no estén en el guion o en el kit.
* Respetar estrictamente los tiempos del audio guía: cada animación se ata a una palabra con en('frase', n), nunca a un segundo escrito a mano.
* Si whisper escucha mal una palabra, se corrige con el guion (alinear_guion.py); no se cambia el guion.
* Automatizar la revisión de zonas seguras y la exportación limpia.
* No cambiar las piezas compartidas de forma que se dañen la intro o los reels anteriores.

ORDEN DE TRABAJO (paso a paso interactivo)

1. Prepárate: valida Node, ffmpeg, whisper.cpp (modelo medium en español) y las dependencias de Python (numpy, scipy, pyloudnorm, Pillow). Dime qué falta antes de seguir.
2. Transcribe: pasa el audio a 16 kHz mono con ffmpeg y transcribe con scripts/transcribir.sh palabra por palabra, con las marcas y nombres del guion en el --prompt. Guarda src/datos/palabras.json y confirma que la duración cuadra con la duración final.
3. Planifica: muéstrame una tabla tiempo → frase → escena → titular en pantalla → pieza y animación → efecto de sonido. Espera mi aprobación antes de construir.
4. Construye: escribe las escenas en src/escenas.ts y el montaje en el Reel, cada elemento atado a su palabra. Corre scripts/revisar-claves.ts: todas las frases deben existir en la transcripción.
5. Sonoriza: escribe los eventos en src/sonidos.ts (mismos fotogramas que las animaciones), expórtalos y genera la mezcla con scripts/sonido.py a −24 LUFS. Haz también la versión solo música.
6. Revisa antes de entregar: renderiza un fotograma por escena y otro a mitad de cada animación (scripts/fotogramas.mjs) y arma las hojas con zonas seguras marcadas (scripts/hoja.py). Verifica que nada se salga del rectángulo, que todo se lea en el celular, que no haya textos montados y que el primer fotograma sea un titular legible. Muéstrame las hojas.
7. Renderiza y entrega en la carpeta out/: [nombre]-mudo.mp4 (sin sonido), [nombre]-con-musica.mp4 (música y efectos), [nombre]-solo-musica.wav y [nombre]-musica-y-efectos.wav. H.264, 1080×1920, 30 fps, duración exacta.
8. Resumen final: lista de archivos con duración, sonoridad medida, decisiones que tomaste y cualquier cosa que el cliente deba revisar.
```

---

## Pendientes para cerrar el análisis

1. **Validar contra el reel de referencia**: descargar el video (por ejemplo con `yt-dlp` en tu computador), dejarlo en `referencia/` y comparar: cortes reales, curvas de rebote, colores medidos, si hay subtítulos palabra a palabra o tercios inferiores que el kit no tiene.
2. **Manual de marca**: confirmar colores exactos, tipografía y si "Juan Pablo" firma con su nombre o como Escuela Invora (el reel del Día 5 cierra con "soy Miguel").
3. **Guion de prueba**: con él se arma la tabla del paso 3.
