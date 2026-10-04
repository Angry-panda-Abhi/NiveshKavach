import os
import base64
import logging
from io import BytesIO
from PIL import Image
import google.generativeai as genai

logger = logging.getLogger(__name__)

class OCRService:
    def __init__(self):
        # Gemini 1.5 Flash supports vision out of the box
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def extract_text(self, image_path: str) -> str:
        """Extract text from an image file using Gemini Vision."""
        try:
            image = Image.open(image_path)
            prompt = "Extract all the text from this image accurately. Preserve the language (Hindi, English, etc). Return ONLY the extracted text."
            response = self.model.generate_content([prompt, image])
            return response.text.strip()
        except Exception as e:
            logger.error(f"OCR File Error: {e}")
            return ""

    async def extract_text_from_base64(self, image_base64: str) -> str:
        """Extract text from a base64 encoded image."""
        try:
            # Handle data URL scheme if present
            if "," in image_base64:
                image_base64 = image_base64.split(",")[1]
                
            image_data = base64.b64decode(image_base64)
            image = Image.open(BytesIO(image_data))
            
            prompt = "Extract all the text from this image accurately. Preserve the language (Hindi, English, etc). Return ONLY the extracted text."
            response = self.model.generate_content([prompt, image])
            return response.text.strip()
        except Exception as e:
            logger.error(f"OCR Base64 Error: {e}")
            return ""
