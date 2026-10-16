# Escribe el SRT de subtítulos y la hoja de montaje para el editor.
# Uso: python3 scripts/textos.py datos.json carpeta-salida
import json, sys, os
d = json.load(open(sys.argv[1])); out = sys.argv[2]; fps = d['fps']; n = d['nombre']
def srt(f):
    ms = round(f / fps * 1000); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'
def tc(f):
    s, fr = divmod(f, fps); m, s = divmod(s, 60)
    return f'00:{m:02}:{s:02}:{fr:02}'
with open(os.path.join(out, f'{n}-subtitulos.srt'), 'w', encoding='utf-8') as fh:
    for i, b in enumerate(d['subtitulos'], 1):
        fh.write(f"{i}\n{srt(b['desde'])} --> {srt(b['hasta'])}\n{b['texto']}\n\n")
QUE = {'A': 'JPR a cámara (capa transparente, solo subtítulos)',
       'B': 'PANTALLA DIVIDIDA -> BAJA A JPR a la mitad de abajo (y 960-1920)',
       'C': 'Gráfico completo (tapa todo el video)', 'D': 'Captura completa (tapa todo el video)'}
L = [f'HOJA DE MONTAJE · {n}', '',
     f'Duración: {d["duracion"]} fotogramas = {d["duracion"] / fps:.2f} s a {fps} fps. Todo empieza en 00:00:00:00.',
     'Pistas: V3 = subtitulos.mov · V2 = motion.mov · V1 = video de JPR (sin tocar) · A1 voz · A2 efectos.wav',
     'Código de tiempo en HH:MM:SS:FF (FF = fotograma, 25 por segundo).', '',
     f'{"ESCENA":<7}{"DESDE":<13}{"HASTA":<13}{"SEG":>6}  FORMATO / QUÉ HACE EL EDITOR', '-' * 110]
for e in d['escenas']:
    L.append(f'{e["id"]:<7}{tc(e["desde"]):<13}{tc(e["hasta"]):<13}{(e["hasta"] - e["desde"]) / fps:>6.2f}  {e["formato"]} · {QUE[e["formato"]]}')
    L.append(f'{"":<39}Frase: {e["frase"]}')
    L.append(f'{"":<39}Animación: {e["animacion"]}'); L.append('')
L += ['TRAMOS DONDE SE BAJA A JPR (pantalla dividida):']
for e in d['escenas']:
    if e['formato'] == 'B':
        L.append(f'  {tc(e["desde"])} -> {tc(e["hasta"])}  ({e["id"]}): escala o mueve a JPR para que su cara quede en la mitad de abajo.'
                 ' La mitad de arriba baja desde arriba en 8 fotogramas: haz el movimiento de JPR en esos mismos 8 fotogramas.')
L += ['', 'Notas:', '- C3 empieza 6 fotogramas antes de que termine B3 (el gráfico completo entra por debajo mientras la mitad de arriba sube).',
      '- Los tiempos se calcularon alineando el guion con las pausas de la voz (sin whisper); pueden variar ±0,2 s por palabra.']
open(os.path.join(out, f'{n}-hoja-de-montaje.txt'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print('srt y hoja listos')
