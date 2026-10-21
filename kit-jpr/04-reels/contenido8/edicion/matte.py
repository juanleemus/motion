# Saca la silueta (alfa) de Juan Pablo cuadro por cuadro con Robust Video Matting.
import sys, subprocess, numpy as np, torch, time
sys.path.insert(0, sys.argv[1]); from model import MattingNetwork
pesos, entrada, salida = sys.argv[2:5]; limite = int(sys.argv[5]) if len(sys.argv) > 5 else 0
torch.set_num_threads(4)
m = MattingNetwork('mobilenetv3').eval(); m.load_state_dict(torch.load(pesos, map_location='cpu'))
W, H = 1080, 1920
dec = subprocess.Popen(['ffmpeg','-v','error','-i',entrada,'-f','rawvideo','-pix_fmt','rgb24','-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','gray','-s',f'{W}x{H}','-r','60','-i','-','-c:v','libx264','-preset','fast','-crf','12','-pix_fmt','yuv420p',salida], stdin=subprocess.PIPE)
rec = [None]*4; n = 0; t0 = time.time()
with torch.no_grad():
    while True:
        b = dec.stdout.read(W*H*3)
        if len(b) < W*H*3: break
        x = torch.from_numpy(np.frombuffer(b, np.uint8).reshape(H, W, 3).copy()).permute(2,0,1)[None].float()/255
        fgr, pha, *rec = m(x, *rec, downsample_ratio=0.2)
        enc.stdin.write((pha[0,0].clamp(0,1)*255).byte().numpy().tobytes())
        n += 1
        if limite and n >= limite: break
        if n % 300 == 0: print(n, f'{n/(time.time()-t0):.1f} fps', flush=True)
enc.stdin.close(); enc.wait(); dec.kill()
print('listo', n, f'{time.time()-t0:.0f} s')
