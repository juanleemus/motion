#!/bin/bash
# Prepara este contenedor (Linux) para editar los videos largos de Mateo Folador con su kit (pipeline-largo + mf-capas).
# Uso:  bash mateo/preparar.sh <ID o enlace del zip del paquete en Drive>
#   o:  bash mateo/preparar.sh <ruta a un .zip ya descargado>
# Si mateo/paquete/ ya existe, no descarga nada: solo instala lo que falte y aplica la adaptación a Linux.
set -e
AQUI="$(cd "$(dirname "$0")" && pwd)"
PAQ="$AQUI/paquete"
ok() { echo "  ✓ $1"; }

if [ ! -d "$PAQ/kit-edicion-v2" ]; then
  SRC="${1:?Falta el zip del paquete (ID o enlace de Drive, o ruta local). Pídeselo al usuario.}"
  TMP="$(mktemp -d)"
  if [ -f "$SRC" ]; then ZIP="$SRC"; else
    ID="$(echo "$SRC" | sed -E 's#.*/d/([^/?]+).*#\1#; s#.*[?&]id=([^&]+).*#\1#')"
    ZIP="$TMP/paquete.zip"
    echo "1/5 · Descargando el paquete de Drive ($ID)"
    curl -sS -L -o "$ZIP" "https://drive.usercontent.google.com/download?id=$ID&export=download&confirm=t"
  fi
  file "$ZIP" | grep -q "Zip archive" || { echo "✗ no es un zip: el archivo debe estar compartido como 'cualquier persona con el enlace'"; exit 1; }
  unzip -q -o "$ZIP" -x '__MACOSX/*' -d "$TMP/x"
  RAIZ="$(dirname "$(find "$TMP/x" -type d -name kit-edicion-v2 | head -1)")"
  mv "$RAIZ" "$PAQ"
  rm -rf "$TMP"
fi
ok "paquete en $PAQ"

echo "2/5 · Python: faster-whisper (reemplaza mlx-whisper), numpy, opencv, pillow"
python3 -c "import faster_whisper, numpy, cv2, PIL" 2>/dev/null || \
  python3 -m pip install --quiet --break-system-packages faster-whisper numpy opencv-python-headless pillow
ok "librerías de Python"

echo "3/5 · ffmpeg, Node y HyperFrames 0.8.147"
command -v ffmpeg >/dev/null || (apt-get update -qq && apt-get install -y -qq ffmpeg)
(cd "$PAQ/kit-edicion-v2/templates/mf-capas" && npx --yes hyperframes@0.8.147 --version >/dev/null)
ok "ffmpeg · node $(node -v) · hyperframes"

echo "4/5 · Adaptación a Linux"
bash "$AQUI/linux/aplicar.sh" "$PAQ"

echo "5/5 · Skill /video-largo"
mkdir -p "$HOME/.claude/skills" && rm -rf "$HOME/.claude/skills/video-largo"
cp -R "$PAQ/skill/video-largo" "$HOME/.claude/skills/video-largo"
ok "skill en ~/.claude/skills/video-largo (se carga en la próxima sesión; en esta, leer su SKILL.md)"
echo
echo "Listo. Proyectos en: $PAQ  (usar VIDEO_BASE=\"$PAQ\" con nuevo.py y rutas absolutas con run.py)"
