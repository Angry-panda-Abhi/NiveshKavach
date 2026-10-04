import os
import google.generativeai as genai
import logging
import json

logger = logging.getLogger(__name__)

class Translator:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Supported languages mapping
        self.supported_langs = {
            "en": "English",
            "hi": "Hindi",
            "mr": "Marathi",
            "bn": "Bengali",
            "ta": "Tamil",
            "te": "Telugu"
        }

    async def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        """Translate text using Gemini API."""
        if not text:
            return text
            
        source_name = self.supported_langs.get(source_lang, source_lang)
        target_name = self.supported_langs.get(target_lang, target_lang)
        
        prompt = f"Translate the following text from {source_name} to {target_name}. Return ONLY the translated text.\n\nText: {text}"
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Translation error: {e}")
            return text

    async def detect_language(self, text: str) -> str:
        """Detect language using Gemini API."""
        if not text:
            return "en"
            
        prompt = "Detect the language of this text. Return ONLY the 2-letter ISO 639-1 language code (e.g., 'en', 'hi', 'mr', 'bn', 'ta', 'te').\n\nText: " + text[:200]
        
        try:
            response = self.model.generate_content(prompt)
            code = response.text.strip().lower()
            if code in self.supported_langs:
                return code
            return "en"
        except Exception as e:
            logger.error(f"Language detection error: {e}")
            return "en"
