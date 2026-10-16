# Vista previa SOLO PARA REVISAR (no se publica): video base + capas + efectos, con marca de agua "PREVIEW".
# En los tramos de pantalla dividida simula lo que hará el editor: baja a JPR para que su cara quede abajo.
# Uso: python3 scripts/preview.py video.mov datos.json carpeta-out
import json, subprocess, sys, os
video, datos, out = sys.argv[1:4]
SIN_MARCA = len(sys.argv) > 4 and sys.argv[4] == 'sin-marca'  # versión para ver, sin marca de agua
d = json.load(open(datos)); fps = d['fps']; n = d['nombre']
f = d['formatos']; tramos, i = [], 0
while i < len(f):
    if f[i] == 'B':
        j = i
        while j < len(f) and f[j] == 'B': j += 1
        tramos.append((i / fps, j / fps)); i = j
    else: i += 1
enB = '+'.join(f'between(t,{a:.3f},{b - 0.001:.3f})' for a, b in tramos)
fuente = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
fc = (f"[0:v]scale=1080:1920:flags=lanczos,setsar=1,split[v1][v2];"
      f"[v2]pad=1080:2580:0:660:color=black,crop=1080:1920:0:0[baja];"
      f"[v1][baja]overlay=0:0:enable='{enB}'[base];"
      f"[base][1:v]overlay=0:0:format=auto[m];[m][2:v]overlay=0:0:format=auto,"
      + ("format=yuv420p[v];" if SIN_MARCA else
      f"drawtext=fontfile={fuente}:text='PREVIEW':fontsize=150:fontcolor=white@0.22:x=(w-tw)/2:y=(h-th)/2-560,"
      f"drawtext=fontfile={fuente}:text='PREVIEW · no publicar':fontsize=40:fontcolor=white@0.5:x=(w-tw)/2:y=1600,format=yuv420p[v];")
      + f"[0:a][3:a]amix=inputs=2:duration=first:normalize=0[a]")
cmd = ['ffmpeg', '-y', '-v', 'error', '-i', video, '-i', os.path.join(out, f'{n}-motion.mov'), '-i', os.path.join(out, f'{n}-subtitulos.mov'),
       '-i', os.path.join(out, f'{n}-efectos.wav'), '-filter_complex', fc, '-map', '[v]', '-map', '[a]',
       '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-r', str(fps), '-c:a', 'aac', '-b:a', '192k', '-t', f'{d["duracion"] / fps:.3f}',
       os.path.join(out, f'{n}-completo.mp4' if SIN_MARCA else f'{n}-preview.mp4')]
subprocess.run(cmd, check=True); print('preview listo')
