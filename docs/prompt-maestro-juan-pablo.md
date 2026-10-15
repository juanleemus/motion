# Prompt maestro de producción — Juan Pablo Ramos P. (JPR)

**De dónde sale cada cosa**
- **Estilo de edición y animación** → el video de referencia `igexport-DeZFNLUCQ1s.mp4` (45,8 s, 720×1280, 25 fps). El creador que aparece ahí no es Juan Pablo; de ese video solo se copia la forma de editar. Las hojas de fotogramas del análisis están en `docs/referencia-estilo/`.
- **Colores y tipografías** → el manual "Identidad Cromática y Tipográfica — Juan Pablo Ramos P." (copia en `docs/branding-juan-pablo/`).
- **Estructura del prompt y motor técnico** → el proyecto de Escuela Invora de este repositorio, solo como ejemplo de formato y de flujo de trabajo (tiempos atados a palabras, sonido por código, revisión de zonas seguras). Su estilo visual no se usa.

---

## PARTE 1 · Análisis del video de referencia

### 1.1 Desglose segundo a segundo

Tipos de plano: **A** = presentador a pantalla completa · **S** = pantalla dividida (arriba un apoyo visual, abajo el presentador) · **B** = apoyo visual a pantalla completa.

| Tiempo | Plano | Qué se ve | Texto en pantalla |
|---|---|---|---|
| 0,0–2,0 | S | Arriba: personaje 3D de plastilina frente a un computador. Abajo: presentador en plano abierto | "Si usas" · "IA" · "desde" · "tu código" en la unión de las dos mitades; "tu código" entra en color |
| 2,0–4,2 | A | Corte a plano cerrado (más zoom) | "siempre" · "acabas" · "llegando" · "al límite" · **"Gratuito"** en ámbar; debajo, una **barra de progreso ámbar** que se llena y un **ícono de alerta** que aparece con rebote |
| 4,2–7,0 | B | Grabación de pantalla del repositorio en GitHub, con acercamiento lento | Titulares grandes arriba: "Mira esto" · "se llama" · "Free" · "LLM" · "API"; un **recuadro rojo se dibuja** alrededor del nombre |
| 7,0–11,0 | S | Arriba: fondo blanco, nodo central "API" con líneas que se dibujan hacia logos de proveedores | "y reúne" · "los planes" · "gratuitos" · "de proveedores" · "en una sola" + ***conexión*** (serif cursiva, debajo) |
| 11,0–14,3 | B | Grabación de la web con **resaltador azul** que barre la frase "7.400 millones de tokens gratuitos al mes" | "Su creador" · "anuncia más de" · "7mil millones" · "de tokens" · "al mes" |
| 14,3–15,4 | B | Vuelve al repositorio | ***sumando*** en cursiva amarilla sobre la imagen |
| 15,4–17,2 | A | Presentador | "pero no te" · "los regala" · "una única" |
| 17,2–20,5 | S | Arriba: fondo blanco, ícono "AI" con destellos y una tarjeta de formulario con una llave que se arma | "Tienes que añadir" · "propias claves" · "proveedores" · ***utilizar*** |
| 20,5–22,2 | A | Presentador | "Lo interesante" · "viene" · "después" |
| 22,2–24,1 | B | Fondo gris claro con viñeta: **tarjetas tipo pastilla** con ícono de alerta que caen una a una, ladeadas: "Alcanza" · "Su límite" · "Falla" | ***Si uno alcanza*** · ***su límite*** · ***o falla.*** (serif cursiva) |
| 24,1–27,4 | S | Arriba: video de archivo en blanco y negro, un enchufe que sale y entra a otro tomacorriente | "la herramienta" · "puede pasar" · "automáticamente" · "a otra opción" · "disponible" |
| 27,4–29,8 | A | Presentador | "sin" · "que tengas" · "que cambiar" · "la configuración" · "de tu aplicación" (entra en color) |
| 29,8–35,3 | B | Fondo negro con estrellas: ventana de app flotante, **ícono 3D brillante** que cae encima y el mockup que pasa a un celular | "Además," · "puede generar" · "un resumen" · "de contexto" · "para ayudar" · "a continuar" · "cuando cambia" (arriba, en color) · ***de modelo.*** (cursiva azul) |
| 35,3–40,4 | S | Arriba: catálogo web que se desplaza | "Para experimentar" · "con distintos" · "modelos" · "y aprovechar" · "sus cuotas" · "Gratuitas" · "tiene bastante" · "sentido" |
| 40,4–45,7 | A | Presentador; leve acercamiento en 42,8 s | "Eso sí," · "la disponibilidad" · "y la calidad" · "pueden variar" · "Si quieres" · "probarla" · **"Comenta API"** (ámbar) · ***y te mando*** · ***el enlace*** (cursiva) |

**Cortes detectados** (s): 2,0 · 4,2 · 7,1 · 11,0 · 14,3 · 15,4 · 17,2 · 20,6 · 22,2 · 24,1 · 27,4 · 29,8 · 35,3 · 40,4 · 42,8.

### 1.2 Ritmo y montaje

- **Plano nuevo cada 2,7 s en promedio** (rango 1–5 s). Siempre alterna presentador → apoyo → presentador; nunca hay dos apoyos de pantalla completa seguidos más de 5 s.
- **Todos los cortes son secos**: sin desvanecidos, barridos ni efectos de transición. El dinamismo viene del contenido.
- **Saltos de encuadre**: el presentador alterna entre plano abierto (en pantalla dividida) y plano cerrado (a pantalla completa). Hay acercamientos de golpe del 10–15 % para marcar énfasis.
- **Pantalla dividida**: la mitad de arriba ocupa el **48 % superior** (corte en y ≈ 920 de 1920) y la de abajo es el presentador. El subtítulo va **montado sobre la unión** de las dos mitades.
- **Los apoyos se mueven siempre**: acercamiento lento, desplazamiento de páginas, líneas que se dibujan, elementos que caen. Nunca hay una imagen quieta.

### 1.3 Subtítulos (la pieza central)

- **De 1 a 3 palabras por bloque**; el bloque cambia en seco con la voz, sin animación de salida.
- **Fuente sans muy negrita**, en minúsculas normales de frase (no TODO MAYÚSCULAS). Blancos, sin caja de fondo y con una sombra muy suave.
- **Tamaño** ≈ 5,5 % del ancho de la pantalla por letra (≈ 60–64 px en 1080). Los titulares de los apoyos de pantalla completa van al doble (≈ 110–130 px).
- **Posición**:
  - Presentador a pantalla completa: a la altura del pecho, justo debajo de la boca (y ≈ 1150–1220 de 1920).
  - Pantalla dividida: sobre la unión (y ≈ 900–980).
  - Apoyos de pantalla completa: debajo del elemento o arriba, como titular.
- **Entrada en color**: algunas palabras clave aparecen en color de acento (degradado azul→morado), con opacidad que sube de 0 a 1, y en 0,3–0,4 s pasan a blanco. Así el ojo se va a esa palabra.
- **Palabras de énfasis fijas** en ámbar `#F1AB06`: "Gratuito", "Comenta API".
- **Segunda voz tipográfica**: una **serif cursiva** (tipo Instrument Serif Italic) más pequeña, en una línea debajo, para remates y continuaciones: *conexión, utilizar, sumando, de modelo., el enlace*.

### 1.4 Gráficos y elementos

| Elemento | Cómo se ve | Cómo entra |
|---|---|---|
| Barra de progreso | Píldora de ≈ 330×14 px, relleno ámbar sobre pista oscura, debajo del subtítulo | Se llena de forma continua mientras se dice la frase |
| Ícono de alerta | Triángulo amarillo-ámbar, ≈ 60 px | Escala 0 → 1,25 → 1 en 0,3 s, junto a la barra |
| Tarjetas tipo pastilla | Café oscuro `#34200F`, radio grande, ícono de alerta + texto blanco negrita; ladeadas −4° a +4° | Una por palabra: entra pequeña y desenfocada, se pasa al 112 % y vuelve al 100 % en ≈ 0,25 s; se apilan hacia abajo |
| Recuadro de señalamiento | Rectángulo redondeado con borde rojo de 3 px | Se dibuja alrededor del nombre en pantalla |
| Resaltador | Barra azul translúcida detrás de una frase de la web | Barre de izquierda a derecha |
| Diagrama de nodos | Fondo blanco, nodo central circular, líneas finas grises que se dibujan hacia logos | Líneas en cascada, puntos que viajan por ellas |
| Ícono 3D | Ícono de app brillante, con sombra | Cae desde arriba con rebote y flota |
| Ventana/mockup | Captura de pantalla flotante con sombra, sobre fondo negro con estrellas | Acercamiento lento; cambia a otra captura |
| Personaje 3D | Render 3D en el gancho | Plano de apertura |

### 1.5 Colores del video de referencia

- Presentador: luz morada y rosada de fondo.
- Fondos de los apoyos: blanco o gris claro con viñeta, o negro con estrellas.
- Acento: degradado azul `#3A6BFF` → morado `#8A6BFF`.
- Énfasis: ámbar `#F1AB06`.
- Tarjetas: café `#34200F`.

### 1.6 Sonido

- Mezcla a **−14,4 LUFS** integrados, con un rango dinámico de 3,3 LU. La voz domina.
- **Efectos de aire (whoosh)** de banda ancha en cada entrada a un apoyo de pantalla completa (≈ 7 s, 8,5–11 s, 27 s, 41 s).
- **Golpes y clics cortos** en tarjetas e íconos.
- Música de fondo apenas perceptible.

---

## PARTE 2 · Cómo se traduce el estilo a la marca de Juan Pablo

| Elemento | Video de referencia | Versión Juan Pablo |
|---|---|---|
| Fuente de subtítulos | Sans muy negrita | **Poppins Bold (700)**; claves en **Poppins Black (900)** |
| Segunda voz (cursiva) | Serif cursiva | **Poppins Medium Italic (500)** (el manual solo tiene Poppins y Open Sans) |
| Entrada en color de palabras | Azul → morado → blanco | **Azul Eléctrico `#2F5FFF` → Lima `#C8F542` → blanco** |
| Énfasis fijo | Ámbar `#F1AB06` | **Verde Lima `#C8F542`** |
| Barra de progreso | Ámbar sobre pista oscura | **Lima sobre pista Azul Medianoche `#0A1F44`** con borde eléctrico |
| Ícono de alerta | Triángulo ámbar | **Triángulo lima con signo medianoche** |
| Tarjetas tipo pastilla | Café `#34200F` | **Azul Medianoche `#0A1F44`** con borde Azul Eléctrico de 2 px, ícono lima y texto blanco |
| Recuadro de señalamiento | Borde rojo | **Borde lima** de 4 px |
| Resaltador | Azul translúcido | **Lima al 35 %** detrás del texto |
| Fondos claros de apoyo | Blanco/gris con viñeta | **Blanco `#FFFFFF`** con viñeta azul muy suave; textos y líneas en medianoche; acentos eléctricos y lima |
| Fondos oscuros de apoyo | Negro con estrellas | **Azul Medianoche** con partículas finas y diagonales en azul eléctrico |
| Diagrama de nodos | Líneas grises | Líneas en Azul Eléctrico; el nodo central con borde lima |
| Llamado a la acción | "Comenta API" en ámbar | **"Comenta [PALABRA]"** en lima con la palabra en MAYÚSCULA + cursiva blanca debajo |

Proporción de color que debe respetar el resultado (manual): 50 % medianoche · 25 % blanco · 15 % lima · 10 % eléctrico. En los planos del presentador manda su propia imagen; ahí lima y eléctrico solo aparecen en subtítulos y gráficos.

---

## PARTE 3 · Prompt final de producción

```text
Vas a crear los motion graphics de un reel para el cliente JUAN PABLO RAMOS P. (marca JPR), todo con código y sin abrir ningún programa de edición: Remotion para montarlo, ffmpeg para tratar el audio y el video, y whisper.cpp para transcribir en mi computador. Háblame en español de Colombia, claro y sin tecnicismos.

MATERIAL

* Guion: [pega aquí el guion completo]
* Audio guía de la voz: [ruta del audio]. Solo sirve para saber en qué momento va cada cosa. El video final NO lleva la voz; el cliente la agrega después.
* Video del presentador: [ruta del clip de Juan Pablo hablando a cámara]. Se usa sin su audio.
* Duración final exacta: [hh:mm:ss:ff]
* Kit del cliente: docs/branding-juan-pablo/ (manual de marca), docs/referencia-estilo/ (análisis del video de referencia), carpeta de activos con el símbolo JPR, íconos 3D, capturas y grabaciones de pantalla, y videos de archivo que el cliente entregue. Reutiliza el motor de este proyecto (src/tiempos.ts, scripts/transcribir.sh, scripts/alinear_guion.py, scripts/sonido.py, scripts/fotogramas.mjs, scripts/hoja.py), pero NO el estilo de Escuela Invora. Las piezas de Juan Pablo van en src/jpr/. Si para un apoyo falta una captura, un logo o un video de archivo, me lo pides; no lo inventas.

IDENTIDAD VISUAL (obligatoria, basada en el branding de Juan Pablo)

* Formato: vertical 1080×1920 a 30 fps.
* Fondo: el reel alterna tres tipos de plano. A = Juan Pablo a pantalla completa. S = pantalla dividida, con el apoyo visual en el 48 % de arriba (hasta y 920) y Juan Pablo abajo, en un encuadre más abierto. B = apoyo visual a pantalla completa. Los apoyos usan dos fondos de marca: claro (Blanco #FFFFFF con viñeta azul muy suave, textos y líneas en Azul Medianoche #0A1F44) u oscuro (Azul Medianoche #0A1F44 con partículas finas y diagonales en Azul Eléctrico #2F5FFF). Proporción general: 50 % medianoche, 25 % blanco, 15 % lima, 10 % eléctrico.
* Tipografía: Poppins. Subtítulos en Poppins Bold (700) de 60 a 66 px. Palabras clave y titulares de los apoyos B en Poppins Black (900) de 110 a 130 px. Segunda voz, para remates y continuaciones, en Poppins Medium Italic (500) de 54 a 58 px, en una línea debajo del subtítulo. Open Sans solo para textos de más de 8 palabras dentro de tarjetas o gráficos. Cárgalas como archivos locales con @fontsource.
* Mayúsculas y minúsculas: subtítulos en minúsculas normales de frase ("tu código", "la configuración"), con mayúscula solo al inicio de oración, en nombres propios y en siglas (IA, API, ROAS). La palabra del llamado a la acción va en MAYÚSCULAS ("Comenta PAUTA").
* Texto: blanco #FFFFFF, sin caja de fondo, con sombra muy suave (0 2px 12px rgba(10,31,68,0.55)). De 1 a 3 palabras por bloque, nunca más de 18 caracteres por línea. Posición: en el plano A, a la altura del pecho (y 1150–1220); en el plano S, sobre la unión de las dos mitades (y 900–980); en el plano B, debajo del elemento principal o arriba como titular.
* Color de acento: Verde Lima #C8F542 para la palabra de énfasis fija (la que el guion remarca: "gratis", "sin pauta", el llamado a la acción), barras de progreso, íconos de alerta, recuadros de señalamiento y resaltadores (lima al 35 %).
* Colores de apoyo: Azul Eléctrico #2F5FFF para la entrada en color de palabras, líneas de diagramas y bordes de tarjetas. Azul Medianoche #0A1F44 para tarjetas, pistas de barras y fondos oscuros. Ningún color fuera de la paleta: el ámbar, el morado y el café del video de referencia se reemplazan por lima, eléctrico y medianoche.
* Logos y elementos gráficos: símbolo JPR en un cuadro lima redondeado, pequeño, solo en el primer plano B y en el cierre. Logos de terceros e íconos 3D siempre del kit, nunca redibujados.

ESTILO DE ANIMACIÓN (extraído del video de referencia)

* Entrada de textos: el subtítulo cambia en seco, bloque por bloque, en la palabra exacta del audio y sin animación de salida. Entrada de cada bloque: opacidad de 0 a 1 y subida de 8 px en 3 fotogramas. Entrada en color: en 1 o 2 palabras clave por frase, la palabra aparece en Azul Eléctrico, pasa por lima y queda en blanco en 10 fotogramas (0,33 s). Palabra de énfasis fija: entra en lima con escala 1,15→1 en 5 fotogramas y se queda en lima. Segunda voz en cursiva: aparece debajo 4 fotogramas después del bloque principal, con opacidad 0→1 y subida de 10 px.
* Gráficos e íconos:
  - Barra de progreso: píldora de 460×18 px, relleno lima sobre pista medianoche con borde eléctrico, debajo del subtítulo; se llena de forma continua desde la primera hasta la última palabra de la frase que habla de un límite, avance o meta.
  - Ícono de alerta: triángulo lima que entra con escala 0→1,25→1 en 9 fotogramas, junto a la barra, en la palabra que nombra el problema.
  - Tarjetas tipo pastilla: medianoche con borde eléctrico, ícono lima a la izquierda y texto blanco en Poppins Bold 56 px. Una por palabra: entran desde escala 0,6 con desenfoque de 8 px, se pasan al 112 % y vuelven al 100 % en 7 fotogramas, ladeadas entre −4° y +4° (alternando), y se apilan hacia abajo con 24 px de separación.
  - Recuadro de señalamiento: rectángulo redondeado con borde lima de 4 px que se dibuja alrededor de un elemento de una captura en 10 fotogramas.
  - Resaltador: barra lima al 35 % que barre detrás de una frase de una captura en 12 fotogramas.
  - Diagrama de nodos: nodo central con borde lima y líneas eléctricas que se dibujan en cascada (3 fotogramas entre línea y línea) hacia logos del kit, con puntos que viajan por ellas.
  - Ícono 3D: cae desde 120 px más arriba con rebote (damping 12, masa 0,6, rigidez 160) y luego flota ±6 px.
  - Capturas y grabaciones de pantalla: siempre con acercamiento lento (1→1,08) o desplazamiento; sombra 0 30px 60px rgba(0,0,0,0.45) cuando flotan sobre fondo oscuro.
* Transiciones y ritmo: cortes secos, sin desvanecidos ni barridos. Cambio de plano cada 2 a 4 s (promedio 2,7 s), alternando A → S o B → A. Nunca más de 5 s seguidos en un apoyo B, ni más de 6 s seguidos en el plano A sin un acercamiento. En el plano A, acercamiento de golpe del 12 % (sin animación) en las frases de impacto, y regreso al encuadre normal en el siguiente bloque. En el plano S, el encuadre de Juan Pablo es más abierto que en el A.
* Componentes modulares (en src/jpr/, con colores y fuentes en src/jpr/marca.ts): Plano (A, S, B), Presentador (encuadre y acercamientos del clip), Subtitulo (bloques, entrada en color, énfasis, cursiva), Barra, Alerta, Pastillas, Recuadro, Resaltador, Nodos, Icono3D, Captura (acercamiento, desplazamiento, sombra), FondoClaro, FondoOscuro, Sello y LlamadoAccion. Cada pieza recibe el fotograma de entrada con en('frase', n). Muéstrame las piezas en una composición de prueba antes de montar el reel.

ZONAS SEGURAS (Interfaz de Instagram / TikTok)

* Todo lo importante va dentro del rectángulo x 70–930 y y 300–1520.
* Nada crítico en los 250 px de arriba (nombre de la cuenta), en los 380 px de abajo (descripción, audio y barra) ni en los 140 px de la derecha (botones de me gusta, comentar y compartir).
* Los subtítulos no tapan la boca ni los ojos de Juan Pablo; si el encuadre del clip los pone en riesgo, los bajas dentro del rectángulo.
* Revisa que la unión del plano S (y 920) no corte la cabeza de Juan Pablo.

SONIDO

* Música de fondo generada por código, muy baja (unos 12 dB por debajo de los efectos): base electrónica suave de 100 a 110 BPM, sin melodía protagonista, con entrada y salida en desvanecido.
* Efectos sintetizados por código, atados al fotograma de su animación:
  - whoosh de banda ancha en cada entrada a un apoyo B o S;
  - golpe corto en cada pastilla y en el ícono 3D;
  - clic agudo en el ícono de alerta;
  - tono ascendente suave mientras se llena la barra;
  - trazo en recuadros, resaltadores y líneas de nodos;
  - pop suave en cada palabra de énfasis fija;
  - campanita en el llamado a la acción.
  Los subtítulos normales no llevan sonido.
* Mezcla final a −16 LUFS integrados (el video de referencia está a −14,4 con la voz; sin voz, déjala dentro del rango −14 a −24 para que el cliente tenga espacio al agregarla) y picos por debajo de −1 dBFS, a 48 kHz estéreo.

REGLAS

* No inventar datos ni cifras ajenas al guion. Las capturas que muestran cifras deben coincidir con lo que dice el guion.
* Respetar estrictamente los tiempos del audio guía: cada bloque de subtítulo, corte y animación se ata a una palabra con en('frase', n), nunca a un segundo escrito a mano.
* El texto en pantalla es literal al guion: los subtítulos dicen exactamente lo que se escucha, partido en bloques de 1 a 3 palabras.
* Si whisper escucha mal una palabra, se corrige con el guion (alinear_guion.py); no se cambia el guion.
* Respetar la paleta y la proporción del manual de Juan Pablo; nada de colores ni fuentes fuera de él.
* Automatizar la revisión de zonas seguras y la exportación limpia.
* No tocar las piezas de Escuela Invora (src/robots/) ni romper sus composiciones.

ORDEN DE TRABAJO (paso a paso interactivo)

1. Prepárate: valida Node, ffmpeg, whisper.cpp (modelo medium en español) y Python (numpy, scipy, pyloudnorm, Pillow). Instala @fontsource/poppins (400, 500 itálica, 700, 900) y @fontsource/open-sans. Revisa el clip de Juan Pablo (resolución, cuadros por segundo, duración) y conviértelo a 30 fps si hace falta. Dime qué falta antes de seguir.
2. Transcribe: pasa el audio a 16 kHz mono con ffmpeg y transcribe con scripts/transcribir.sh palabra por palabra, con los nombres y siglas del guion en el --prompt. Guarda la transcripción y confirma que la duración cuadra con la duración final.
3. Planifica: muéstrame una tabla tiempo → frase → plano (A, S o B) → apoyo visual → bloques de subtítulo (marcando entrada en color, énfasis lima y cursiva) → gráficos → efecto de sonido. Debe cumplir el ritmo de un cambio de plano cada 2 a 4 s. Espera mi aprobación antes de construir.
4. Construye: crea src/jpr/ con las piezas y la composición del reel, cada elemento atado a su palabra. Corre la revisión de claves: todas las frases deben existir en la transcripción.
5. Sonoriza: escribe los eventos de sonido con los mismos fotogramas de las animaciones y genera la mezcla a −16 LUFS. Haz también la versión solo música.
6. Revisa antes de entregar: renderiza un fotograma por bloque de subtítulo y otro a mitad de cada animación, y arma las hojas con las zonas seguras marcadas. Verifica que nada se salga del rectángulo, que los subtítulos se lean en el celular y no tapen la cara, que no haya dos apoyos B seguidos de más de 5 s, que la proporción de color se parezca a la del manual y que el primer fotograma ya muestre un subtítulo y una imagen con gancho. Muéstrame las hojas junto a docs/referencia-estilo/ para comparar.
7. Renderiza y entrega en la carpeta out/:
   - [nombre]-mudo.mp4: versión completa sin sonido.
   - [nombre]-con-musica.mp4: música y efectos, sin voz.
   - [nombre]-graficos.mov: subtítulos y gráficos con transparencia (ProRes 4444), por si el editor del cliente quiere montarlos encima.
   - [nombre]-solo-musica.wav y [nombre]-musica-y-efectos.wav.
   Todo en 1080×1920, 30 fps y duración exacta; los MP4 en H.264.
8. Resumen final: lista de archivos con duración, sonoridad medida, decisiones que tomaste y cualquier cosa que el cliente deba revisar.
```

---

## Decisiones tomadas y pendientes

- **Cursiva**: el video usa una serif cursiva, pero el manual de Juan Pablo solo tiene Poppins y Open Sans, así que se usa Poppins Medium Italic. Si Juan Pablo acepta una serif de apoyo (por ejemplo, Instrument Serif Italic), basta con cambiarla en `src/jpr/marca.ts`.
- **Ámbar → lima**: el énfasis ámbar del video se pasa a lima porque el manual reserva el lima para "acento, palabras clave y botones".
- **Material de Juan Pablo**: este estilo necesita su clip hablando a cámara y los apoyos (capturas, grabaciones de pantalla, videos de archivo, íconos 3D). El código genera los gráficos, los subtítulos y el montaje, pero no inventa imágenes de archivo.
- **Pendiente**: guion de prueba y audio guía para armar la tabla del paso 3.
