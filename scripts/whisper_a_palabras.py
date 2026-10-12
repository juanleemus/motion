# Convierte la salida JSON de whisper.cpp (-ml 1 -sow) en src/datos/palabras.json.
import json, sys
d = json.load(open(sys.argv[1], encoding='utf-8'))
res = []
for s in d['transcription']:
    w = s['text'].strip()
    if not w: continue
    res.append({'w': w, 't0': s['offsets']['from'] / 1000, 't1': s['offsets']['to'] / 1000})
json.dump(res, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(len(res), 'palabras')
