#!/usr/bin/env bash
# Transcribe el audio guía con whisper.cpp (modelo medium, español) palabra por palabra.
# Uso: scripts/transcribir.sh ruta/al/modelo.bin ruta/al/audio
set -euo pipefail
MODELO="$1"; AUDIO="$2"
WHISPER=trabajo/herramientas/whisper.cpp/build/bin/whisper-cli
mkdir -p trabajo
ffmpeg -y -v error -i "$AUDIO" -ar 16000 -ac 1 -c:a pcm_s16le trabajo/voz16k.wav
"$WHISPER" -m "$MODELO" -l es -f trabajo/voz16k.wav -t 4 -ml 1 -sow -ojf -of trabajo/transcripcion \
  --prompt "Escuela Invora. Uber, Waymo, Google, Tesla, Nancy Pelosi, Bill Ackman, robotaxis, CEO."
python3 scripts/whisper_a_palabras.py trabajo/transcripcion.json src/datos/palabras.json
