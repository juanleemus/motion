#!/bin/bash
# Adapta kit-edicion-v2/pipeline-largo a Linux (whisper con faster-whisper, borrador con libx264). Idempotente.
# Uso: bash mateo/linux/aplicar.sh [carpeta del paquete]   (por defecto mateo/paquete)
set -e
AQUI="$(cd "$(dirname "$0")" && pwd)"
PAQ="${1:-$AQUI/../paquete}"
PL="$PAQ/kit-edicion-v2/pipeline-largo"
[ -f "$PL/run.py" ] || { echo "✗ no encuentro $PL/run.py"; exit 1; }
cp "$AQUI/asr.py" "$PL/asr.py"
# 1 · whisper: mlx_whisper.transcribe → asr.transcribe (asr usa mlx en la Mac y faster-whisper en Linux)
for f in "$PL"/*.py; do
  [ "$(basename "$f")" = asr.py ] && continue
  sed -i -e 's/^\( *\)import mlx_whisper$/\1import asr/' -e 's/mlx_whisper\.transcribe(/asr.transcribe(/g' "$f"
done
# 2 · borrador: VideoToolbox solo existe en la Mac
python3 - "$PL/perfil.py" <<'PY'
import sys
p = sys.argv[1]; s = open(p).read()
viejo = 'ENC_RAPIDO = ["-c:v", "h264_videotoolbox", "-b:v", "3M", "-allow_sw", "1"]\n'
nuevo = ('import sys as _sys\n'
         'ENC_RAPIDO = (["-c:v", "h264_videotoolbox", "-b:v", "3M", "-allow_sw", "1"] if _sys.platform == "darwin"\n'
         '              else ["-c:v", "libx264", "-preset", "veryfast", "-crf", "23"])  # Linux: sin VideoToolbox\n')
if viejo in s:
    open(p, "w").write(s.replace(viejo, nuevo))
PY
# 3 · modo burbuja (video sin cámara a cuadro completo: Mateo en un círculo fijo, ver mateo/LEEME.md)
cp "$AQUI/burbuja.py" "$PL/burbuja.py"
if ! grep -q BURBUJA "$PL/escenas.py"; then
  (cd "$PAQ/kit-edicion-v2" && patch -p0 --forward --quiet < "$AQUI/burbuja.patch")
fi
if grep -rn "mlx_whisper" "$PL"/*.py | grep -v "^$PL/asr.py"; then echo "✗ quedan usos de mlx_whisper"; exit 1; fi
echo "✓ pipeline adaptado a Linux en $PL"
