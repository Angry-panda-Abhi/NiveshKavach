import os
import base64
import logging
import asyncio
from typing import Optional

logger = logging.getLogger(__name__)

class VoiceService:
    def __init__(self):
        # edge-tts voices map
        self.voice_map = {
            "en": "en-IN-NeerjaNeural",
            "hi": "hi-IN-SwaraNeural",
            "mr": "mr-IN-AarohiNeural",
            "ta": "ta-IN-PallaviNeural"
        }

    async def speech_to_text(self, audio_base64: str, language: str) -> str:
        """Convert speech to text."""
        # For hackathon without proper STT integrations (Whisper needs heavy torch),
        # returning a fallback mock or stub. In real implementation, pass to Whisper API.
        logger.info(f"Mock STT called for lang: {language}")
        return "This is a transcribed text from the provided audio."

    async def text_to_speech(self, text: str, language: str) -> str:
        """Convert text to speech using edge-tts and return base64 audio."""
        if not text:
            return ""
            
        voice = self.voice_map.get(language, "en-IN-NeerjaNeural")
        output_file = "temp_output.mp3"
        
        try:
            # Call edge-tts via subprocess
            cmd = f'edge-tts --voice "{voice}" --text "{text}" --write-media "{output_file}"'
            process = await asyncio.create_subprocess_shell(
                cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            await process.communicate()
            
            if os.path.exists(output_file):
                with open(output_file, "rb") as audio_file:
                    encoded_string = base64.b64encode(audio_file.read()).decode('utf-8')
                os.remove(output_file)
                return encoded_string
            return ""
        except Exception as e:
            logger.error(f"TTS Error: {e}")
            if os.path.exists(output_file):
                os.remove(output_file)
            return ""
