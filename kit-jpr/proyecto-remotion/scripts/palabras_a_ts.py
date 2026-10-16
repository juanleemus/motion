# Convierte el JSON de palabras con tiempos (alineador o whisper) en src/reels/<reel>/palabras.ts
# Uso: python3 scripts/palabras_a_ts.py palabras.json src/reels/contenido5/palabras.ts
import json, sys
p = json.load(open(sys.argv[1], encoding='utf-8'))
filas = ',\n'.join(f"  {{w: {json.dumps(x['w'], ensure_ascii=False)}, t0: {x['t0']:.2f}, t1: {x['t1']:.2f}}}" for x in p)
open(sys.argv[2], 'w', encoding='utf-8').write(
    '// Generado por scripts/palabras_a_ts.py: cada palabra dicha con su inicio y fin (segundos).\n'
    'export const PALABRAS: {w: string; t0: number; t1: number}[] = [\n' + filas + ',\n];\n')
print(len(p), 'palabras')
