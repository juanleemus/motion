"""Whisper para el pipeline-largo en Mac y en Linux.

En la Mac usa mlx-whisper (como el kit original). En Linux, o donde no esté mlx, usa faster-whisper con el mismo
modelo (large-v3-turbo) y devuelve el MISMO formato que mlx_whisper.transcribe: {"text", "segments": [{"words": [...]}]},
con cada palabra como {"word", "start", "end", "probability"}. Así los scripts no cambian su lectura del resultado.

Variables opcionales: ASR_MODELO (por defecto large-v3-turbo), ASR_COMPUTE (por defecto int8 en CPU).
"""
import os
import sys

MLX = "mlx-community/whisper-large-v3-turbo"
_modelo = None


def _mlx():
    if sys.platform != "darwin":
        return None
    try:
        import mlx_whisper
        return mlx_whisper
    except ImportError:
        return None


def _fw():
    global _modelo
    if _modelo is None:
        from faster_whisper import WhisperModel
        try:
            import torch
            cuda = torch.cuda.is_available()
        except ImportError:
            cuda = False
        _modelo = WhisperModel(os.environ.get("ASR_MODELO", "large-v3-turbo"), device="cuda" if cuda else "cpu",
                               compute_type=os.environ.get("ASR_COMPUTE", "float16" if cuda else "int8"),
                               cpu_threads=os.cpu_count() or 4)
    return _modelo


def _pcm(audio: str):
    """Audio a float32 mono 16 kHz con ffmpeg (no depende de la versión de PyAV que trae faster-whisper)."""
    import subprocess
    import numpy as np
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", audio, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)


def transcribe(audio: str, path_or_hf_repo: str = MLX, language: str = "es", word_timestamps: bool = False,
               initial_prompt: str | None = None, condition_on_previous_text: bool = True, **kw) -> dict:
    m = _mlx()
    if m is not None:
        return m.transcribe(audio, path_or_hf_repo=path_or_hf_repo, language=language, word_timestamps=word_timestamps,
                            initial_prompt=initial_prompt, condition_on_previous_text=condition_on_previous_text, **kw)
    segs, _ = _fw().transcribe(_pcm(audio), language=language, word_timestamps=word_timestamps, initial_prompt=initial_prompt,
                               condition_on_previous_text=condition_on_previous_text, vad_filter=False, beam_size=5)
    out, texto = [], []
    for s in segs:
        texto.append(s.text)
        out.append({"start": float(s.start), "end": float(s.end), "text": s.text,
                    "words": [{"word": w.word, "start": float(w.start), "end": float(w.end), "probability": float(w.probability)}
                              for w in (s.words or [])]})
    return {"text": "".join(texto).strip(), "segments": out, "language": language}
