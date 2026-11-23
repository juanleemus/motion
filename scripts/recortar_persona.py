# Quita el fondo del presentador (segmentación de personas de MediaPipe, modelo selfie multiclass) fotograma a fotograma.
# Salidas: video con fondo negro (H.264), máscara blanco/negro (H.264) y video transparente (WebM VP9 con alfa).
# Uso: python3 scripts/recortar_persona.py entrada.mp4 modelo.tflite salida_dir
import subprocess, sys, json
import numpy as np, mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions
ent, modelo, out = sys.argv[1:4]
import cv2
import os
COLOR = os.environ.get('COLOR', 'null')  # por defecto no toca el color
SOLO_MASCARA = os.environ.get('SOLO_MASCARA') == '1'
info = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height,nb_frames', '-of', 'json', ent], capture_output=True, text=True).stdout)['streams'][0]
W, H, N = int(info['width']), int(info['height']), int(info['nb_frames'])
seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(base_options=BaseOptions(model_asset_path=modelo), output_confidence_masks=True, running_mode=vision.RunningMode.VIDEO))
lee = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', ent, '-vf', COLOR, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
def escritor(args, pix):
    return subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', pix, '-s', f'{W}x{H}', '-r', '30', '-i', '-', *args], stdin=subprocess.PIPE)
negro = None if SOLO_MASCARA else escritor(['-c:v', 'libx264', '-crf', '17', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', f'{out}/miguel-fondo-negro.mp4'], 'rgb24')
masc = escritor(['-c:v', 'libx264', '-crf', '17', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', f'{out}/miguel-mascara.mp4'], 'gray')
alfa = None if SOLO_MASCARA else escritor(['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '6M', '-row-mt', '1', '-deadline', 'realtime', '-cpu-used', '8', f'{out}/miguel-transparente.webm'], 'rgba')
prev = None
for i in range(N):
    buf = lee.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    im = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    r = seg.segment_for_video(mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(im)), int(i * 1000 / 30))
    a = 1 - np.squeeze(r.confidence_masks[0].numpy_view()).astype(np.float32)
    # borde fino: filtro guiado con la imagen (sigue el pelo y el contorno) a media resolución
    pq = cv2.resize(im, (W // 2, H // 2), interpolation=cv2.INTER_AREA)
    aq = cv2.resize(a, (W // 2, H // 2), interpolation=cv2.INTER_AREA)
    aq = cv2.ximgproc.guidedFilter(pq, aq, 6, 1e-3)
    a = cv2.resize(aq, (W, H), interpolation=cv2.INTER_LINEAR)
    a = np.clip((a - 0.3) / 0.45, 0, 1)
    a = cv2.erode(a, np.ones((3, 3), np.uint8), iterations=1)   # quita el halo de la pared
    a = cv2.GaussianBlur(a, (0, 0), 1.2)
    if prev is not None: a = 0.8 * a + 0.2 * prev  # un poco de estabilidad sin dejar estela
    prev = a
    a8 = (a * 255).astype(np.uint8)
    masc.stdin.write(a8.tobytes())
    if not SOLO_MASCARA:
        negro.stdin.write((im * a[..., None]).astype(np.uint8).tobytes())
        alfa.stdin.write(np.dstack([im, a8]).tobytes())
    if i % 300 == 0: print(i, '/', N, flush=True)
for p in (negro, masc, alfa):
    if p: p.stdin.close(); p.wait()
print('listo', N)
