import os
import hashlib
from gtts import gTTS
from pydub import AudioSegment
# pydub no tiene pitch_shift nativo, usaremos manipulación de frame_rate
import random


class TTSEngine:
    """Motor de texto a voz con personalización de voz"""
    
    def __init__(self, audio_dir: str = "static/audio", reference_audio_dir: str = "audio_samples"):
        self.audio_dir = audio_dir
        self.reference_audio_dir = reference_audio_dir
        os.makedirs(audio_dir, exist_ok=True)
        
        # Parámetros de voz basados en análisis de muestras
        # Estos valores simulan características de voz femenina joven
        self.voice_params = {
            "speed": 1.1,  # Ligeramente más rápido
            "pitch_shift": 2,  # Tono más alto (voz femenina)
            "emotion_modifiers": {
                "feliz": {"speed": 1.15, "pitch": 3},
                "triste": {"speed": 0.9, "pitch": -1},
                "enojada": {"speed": 1.2, "pitch": 1},
                "emocionada": {"speed": 1.25, "pitch": 4},
                "neutral": {"speed": 1.1, "pitch": 2},
                "cariñosa": {"speed": 1.0, "pitch": 3},
                "juguetona": {"speed": 1.2, "pitch": 3},
                "preocupada": {"speed": 0.95, "pitch": 1},
                "sorprendida": {"speed": 1.15, "pitch": 4}
            }
        }
    
    def generate_audio_filename(self, text: str) -> str:
        """Genera un nombre de archivo único basado en el texto y timestamp"""
        import time
        timestamp = str(int(time.time() * 1000))
        text_hash = hashlib.md5((text + timestamp).encode()).hexdigest()[:8]
        return f"lily_{timestamp}_{text_hash}.mp3"
    
    def text_to_speech(self, text: str, emotion: str = "neutral", save: bool = True) -> str:
        """
        Convierte texto a voz con características emocionales
        
        Args:
            text: Texto a convertir
            emotion: Emoción para modular la voz
            save: Si guardar el archivo o no
            
        Returns:
            Ruta del archivo de audio generado
        """
        try:
            # Generar nombre de archivo
            filename = self.generate_audio_filename(f"{text}_{emotion}")
            output_path = os.path.join(self.audio_dir, filename)
            
            # Si ya existe, retornar
            if os.path.exists(output_path):
                return f"/static/audio/{filename}"
            
            # Generar audio base con gTTS
            temp_file = os.path.join(self.audio_dir, f"temp_{filename}")
            tts = gTTS(text=text, lang='es', slow=False)
            tts.save(temp_file)
            
            # Cargar audio con pydub
            audio = AudioSegment.from_mp3(temp_file)
            
            # Obtener parámetros de emoción
            emotion_params = self.voice_params["emotion_modifiers"].get(
                emotion, 
                self.voice_params["emotion_modifiers"]["neutral"]
            )
            
            # Aplicar modificaciones de velocidad
            if emotion_params["speed"] != 1.0:
                # Cambiar velocidad manteniendo el pitch
                audio = audio._spawn(
                    audio.raw_data,
                    overrides={
                        "frame_rate": int(audio.frame_rate * emotion_params["speed"])
                    }
                ).set_frame_rate(audio.frame_rate)
            
            # Aplicar cambio de pitch (simulación de voz femenina)
            # Nota: pydub no tiene pitch_shift nativo, usamos cambio de velocidad
            # Para pitch real se necesitaría librosa o similar
            
            # Ajustar volumen según emoción
            volume_adjustments = {
                "feliz": 2,
                "enojada": 3,
                "emocionada": 4,
                "triste": -2,
                "preocupada": -1
            }
            
            volume_change = volume_adjustments.get(emotion, 0)
            if volume_change != 0:
                audio = audio + volume_change
            
            # Exportar audio procesado
            audio.export(output_path, format="mp3", bitrate="128k")
            
            # Limpiar archivo temporal
            if os.path.exists(temp_file):
                os.remove(temp_file)
            
            return f"/static/audio/{filename}"
            
        except Exception as e:
            print(f"Error generando audio: {e}")
            return None
    
    def generate_speech_async(self, text: str, emotion: str = "neutral"):
        """
        Versión asíncrona para generar voz en background
        """
        # Para implementación futura con threading o asyncio
        return self.text_to_speech(text, emotion)
    
    def delete_audio_file(self, audio_url: str) -> bool:
        """Elimina un archivo de audio específico"""
        try:
            if audio_url:
                # Convertir URL a ruta de archivo
                audio_path = audio_url.replace("/static/audio/", "")
                full_path = os.path.join(self.audio_dir, audio_path)
                
                if os.path.exists(full_path):
                    os.remove(full_path)
                    print(f"Audio eliminado: {audio_path}")
                    return True
            return False
        except Exception as e:
            print(f"Error eliminando archivo de audio: {e}")
            return False
    
    def clean_old_audio_files(self, max_age_seconds: int = 300):
        """Limpia archivos de audio más antiguos que max_age_seconds (default: 5 minutos)"""
        try:
            import time
            current_time = time.time()
            audio_files = [
                f for f in os.listdir(self.audio_dir) 
                if f.startswith("lily_") and f.endswith(".mp3")
            ]
            
            deleted_count = 0
            for file in audio_files:
                file_path = os.path.join(self.audio_dir, file)
                file_age = current_time - os.path.getmtime(file_path)
                
                if file_age > max_age_seconds:
                    os.remove(file_path)
                    deleted_count += 1
            
            if deleted_count > 0:
                print(f"Limpiados {deleted_count} archivos de audio antiguos")
                
        except Exception as e:
            print(f"Error limpiando archivos de audio: {e}")
    
    def analyze_reference_audio(self):
        """
        Analiza los archivos de audio de referencia para extraer características
        (Implementación básica - para análisis avanzado se necesitaría librosa)
        """
        try:
            lily_audio = os.path.join(self.reference_audio_dir, "LILY.wav")
            lily2_audio = os.path.join(self.reference_audio_dir, "LILY2.wav")
            
            if os.path.exists(lily_audio):
                audio = AudioSegment.from_wav(lily_audio)
                duration = len(audio) / 1000.0  # en segundos
                
                print(f"Análisis de LILY.wav:")
                print(f"  - Duración: {duration:.2f}s")
                print(f"  - Canales: {audio.channels}")
                print(f"  - Frame rate: {audio.frame_rate}Hz")
                print(f"  - Sample width: {audio.sample_width} bytes")
                
            if os.path.exists(lily2_audio):
                audio = AudioSegment.from_wav(lily2_audio)
                duration = len(audio) / 1000.0
                
                print(f"Análisis de LILY2.wav:")
                print(f"  - Duración: {duration:.2f}s")
                print(f"  - Canales: {audio.channels}")
                print(f"  - Frame rate: {audio.frame_rate}Hz")
                print(f"  - Sample width: {audio.sample_width} bytes")
                
        except Exception as e:
            print(f"Error analizando audio de referencia: {e}")


# Instancia global
tts_engine = TTSEngine()

