# Tiempos PROVISIONALES: reparte las palabras del guion sobre los tramos con voz
# (sin silencios), en proporción a su largo. Se reemplaza con whisper.cpp.
import json, re, subprocess, sys
wav, guion, salida = sys.argv[1:4]
txt = open(guion, encoding='utf-8').read()
words = txt.split()
out = subprocess.run(['ffmpeg','-i',wav,'-af','silencedetect=noise=-35dB:d=0.18','-f','null','-'],capture_output=True,text=True).stderr
ss=[float(x) for x in re.findall(r'silence_start: ([0-9.]+)',out)]
se=[float(x) for x in re.findall(r'silence_end: ([0-9.]+)',out)]
dur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',wav],capture_output=True,text=True).stdout)
segs=[]; cur=0.0
for a,b in zip(ss,se):
    if a>cur: segs.append((cur,a))
    cur=b
if cur<dur: segs.append((cur,dur))
segs=[s for s in segs if s[1]-s[0]>0.05]
total=sum(b-a for a,b in segs)
w=[len(re.sub(r'\W','',x))+2 for x in words]; W=sum(w)
def at(pos):  # pos en segundos de voz -> segundos reales
    for a,b in segs:
        if pos<=b-a: return a+pos
        pos-=b-a
    return segs[-1][1]
acc=0; res=[]
for x,l in zip(words,w):
    t0=at(acc/W*total); acc+=l; t1=at(acc/W*total)
    res.append({'w':x,'t0':round(t0,2),'t1':round(t1,2)})
json.dump(res,open(salida,'w',encoding='utf-8'),ensure_ascii=False,indent=0)
print(len(res),'palabras; voz', round(total,1),'s')
