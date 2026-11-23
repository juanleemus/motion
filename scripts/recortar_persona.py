# Quita el fondo del presentador (segmentación de personas de MediaPipe, modelo selfie multiclass) fotograma a fotograma.
# Salidas: video con fondo negro (H.264), máscara blanco/negro (H.264) y video transparente (WebM VP9 con alfa).
# Uso: python3 scripts/recortar_persona.py entrada.mp4 modelo.tflite salida_dir
import subprocess, sys, json
import numpy as np, mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions
ent, modelo, out = sys.argv[1:4]
info = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height,nb_frames', '-of', 'json', ent], capture_output=True, text=True).stdout)['streams'][0]
W, H, N = int(info['width']), int(info['height']), int(info['nb_frames'])
seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(base_options=BaseOptions(model_asset_path=modelo), output_confidence_masks=True, running_mode=vision.RunningMode.VIDEO))
lee = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', ent, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
def escritor(args, pix):
    return subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', pix, '-s', f'{W}x{H}', '-r', '30', '-i', '-', *args], stdin=subprocess.PIPE)
negro = escritor(['-c:v', 'libx264', '-crf', '17', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', f'{out}/miguel-fondo-negro.mp4'], 'rgb24')
masc = escritor(['-c:v', 'libx264', '-crf', '17', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', f'{out}/miguel-mascara.mp4'], 'gray')
alfa = escritor(['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '6M', '-row-mt', '1', '-deadline', 'realtime', '-cpu-used', '8', f'{out}/miguel-transparente.webm'], 'rgba')
prev = None
for i in range(N):
    buf = lee.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    im = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    r = seg.segment_for_video(mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(im)), int(i * 1000 / 30))
    a = 1 - np.squeeze(r.confidence_masks[0].numpy_view())
    a = np.clip((a - 0.25) / 0.5, 0, 1)            # quita el "fantasma" de la pared y endurece el borde
    if prev is not None: a = 0.65 * a + 0.35 * prev  # suaviza el parpadeo entre fotogramas
    prev = a
    a8 = (a * 255).astype(np.uint8)
    negro.stdin.write((im * a[..., None]).astype(np.uint8).tobytes())
    masc.stdin.write(a8.tobytes())
    alfa.stdin.write(np.dstack([im, a8]).tobytes())
    if i % 300 == 0: print(i, '/', N, flush=True)
for p in (negro, masc, alfa): p.stdin.close(); p.wait()
print('listo', N)
