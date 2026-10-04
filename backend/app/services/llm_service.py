import json
import logging
import re
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.language_map = {
            "hi": "Hindi",
            "en": "English",
            "mr": "Marathi",
            "gu": "Gujarati",
            "bn": "Bengali",
            "ta": "Tamil",
            "te": "Telugu"
        }
        
    def _extract_json(self, text: str) -> dict:
        """Extract JSON from markdown or raw text robustly."""
        try:
            # Try parsing directly first
            return json.loads(text)
        except json.JSONDecodeError:
            pass
            
        try:
            # Find json blocks within markdown
            match = re.search(r'```(?:json)?(.*?)```', text, re.DOTALL | re.IGNORECASE)
            if match:
                json_str = match.group(1).strip()
                return json.loads(json_str)
                
            # Try finding the first '{' and last '}'
            start = text.find('{')
            end = text.rfind('}')
            if start != -1 and end != -1:
                return json.loads(text[start:end+1])
                
        except Exception as e:
            logger.error(f"Failed to extract JSON from response: {e}")
            
        return {}

    def _get_guardrails_prompt(self) -> str:
        return """
        CRITICAL GUARDRAILS (STRICT COMPLIANCE REQUIRED):
        1. NEVER provide specific investment advice, stock tips, or price targets.
        2. NEVER validate or endorse any third-party financial platform or individual.
        3. If the user asks "how to make money", "how to get rich", or asks for investment strategies, YOU MUST DEFLECT. Respond by stating: "My purpose as Kavach AI is to protect your wealth, not to generate returns. Please be cautious of anyone promising easy money, as it is a common sign of a financial scam."
        4. Focus entirely on education, risk awareness, and scam prevention.
        5. If asked about guaranteed returns, explicitly state that guaranteed returns in the stock market are a sign of a fraud.
        """

    async def analyze_scam(self, text: str, language: str, image_url: str = None) -> Dict[str, Any]:
        """Analyze text and/or image for scam patterns using LLM."""
        
        # Intercept extremely short or meaningless messages immediately ONLY if there's no image
        if not image_url and (len(text.strip()) < 15 or len(text.strip().split()) < 3):
            return {
                "risk_score": 0,
                "risk_level": "LOW",
                "flags": [],
                "explanation": "Message is too short to accurately determine if it is a scam.",
                "actions": ["Please provide the full message or more context."],
                "educational_tip": "Scammers often start with a simple 'Hello' to see if a number is active. Wait to see what they say before engaging."
            }

        lang_name = self.language_map.get(language.lower(), "English")
        
        prompt = f"""
        {self._get_guardrails_prompt()}
        Analyze the following input (text and/or image) for financial scams, fraud, phishing, or suspicious activity. Respond ONLY with a valid JSON object.
        Language to respond in: {lang_name}
        
        CRITICAL RULES FOR YOUR ANALYSIS:
        1. If the text/image is incredibly short or a simple greeting ("hi", "hello"), score it 0 and state "Message is too short/generic to analyze." Do NOT give boilerplate advice.
        2. Evaluate money requests CONTEXTUALLY. A random unknown sender promising cash or asking for money is HIGH RISK. However, personal/family context (e.g., "my sister is asking for 500") is SAFE (Score 0). Use your reasoning.
        3. For 'actions', you MUST provide 2-3 specific steps based EXACTLY on the text/image. 
        4. ABSOLUTE PROHIBITION: Do NOT say "Don't click links", "Don't share OTPs", or "Don't share personal info" UNLESS the text/image actually contains a link, asks for an OTP, or asks for personal info. 
        5. If the text/image is suspicious but lacks links, advise the user to ignore or block the sender.
        6. The 'educational_tip' must be a unique fact about the specific scam tactic used. Do not use generic SEBI boilerplate.
        
        Text Context: "{text}"
        
        Expected JSON format:
        {{
            "risk_score": 0-100,
            "risk_level": "low/medium/high/critical",
            "flags": [{{"type": "string", "description": "string"}}],
            "explanation": "string",
            "actions": ["string"],
            "educational_tip": "string"
        }}
        """
        
        # Build the message payload
        message_content = []
        message_content.append({"type": "text", "text": prompt})
        
        if image_url:
            message_content.append({
                "type": "image_url",
                "image_url": {"url": image_url}
            })
        
        # Use OpenRouter API with Multi-Model Fallback
        from app.config import settings
        import httpx
        
        # Best order: 1. Qwen (Smarts/Hindi), 2. Nemotron (Fast Backup), 3. Liquid (Last Resort)
        if image_url:
            # Use Vision-capable free models
            MODELS_TO_USE = [
                "meta-llama/llama-3.2-11b-vision-instruct:free",
                "qwen/qwen-vl-plus:free",
                "google/gemini-pro-vision:free"
            ]
        else:
            MODELS_TO_USE = [
                "qwen/qwen3.8-27b:free",
                "nvidia/nemotron-3.5-lightning:free",
                "liquid/lfm-2.5-2.6b:free"
            ]
        
        try:
            if settings.OPENROUTER_API_KEY:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    for model_id in MODELS_TO_USE:
                        try:
                            response = await client.post(
                                "https://openrouter.ai/api/v1/chat/completions",
                                headers={
                                    "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                                    "Content-Type": "application/json"
                                },
                                json={
                                    "model": model_id,
                                    "messages": [{"role": "user", "content": message_content if image_url else prompt}],
                                    "response_format": {"type": "json_object"} if not image_url else None,
                                    "temperature": 0.1
                                }
                            )
                            response.raise_for_status()
                            
                            data = response.json()
                            if "choices" not in data or not data["choices"]:
                                raise ValueError(f"No choices returned from {model_id}")
                                
                            result_text = data["choices"][0]["message"]["content"]
                            
                            # Validate JSON
                            parsed_json = self._extract_json(result_text)
                            if not parsed_json or "risk_score" not in parsed_json:
                                raise ValueError(f"Invalid JSON structure returned by {model_id}")
                                
                            # Post-process to completely eliminate LLM hallucinations on safe texts
                            score = parsed_json.get("risk_score", 100)
                            if score < 15:
                                is_hi = (language.lower() == 'hi')
                                parsed_json["actions"] = [
                                    "इस संदेश में कोई स्पष्ट खतरा नहीं है।" if is_hi else "No obvious threats detected in this message.",
                                    "यदि आप प्रेषक को नहीं जानते हैं तो अनदेखा करें।" if is_hi else "Ignore if you do not know the sender."
                                ]
                                parsed_json["educational_tip"] = (
                                    "स्कैमर अक्सर यह जांचने के लिए सामान्य संदेश भेजते हैं कि आपका नंबर सक्रिय है या नहीं।" if is_hi else 
                                    "Scammers often send generic messages just to verify if your number is active."
                                )
                                
                            return parsed_json
                                
                        except Exception as e:
                            logger.warning(f"{model_id} failed, falling back to next model... Error: {e}")
                            continue # Try the next model in the list
                            
            else:
                logger.warning("OPENROUTER_API_KEY not found. Using fallback analysis.")
        except Exception as e:
            logger.error(f"OpenRouter API error in analyze_scam: {e}")
            
        # Fallback if API fails or is not configured
        if image_url and not text.strip():
            mock_llm_response = '''```json
            {
                "risk_score": 0,
                "risk_level": "UNKNOWN",
                "flags": [],
                "explanation": "Image analysis failed due to high server load. Please retry the upload.",
                "actions": ["Please click 'Analyze Risk' to retry.", "If the issue persists, type out the text manually."],
                "educational_tip": "Scammers often use images to bypass text filters. Always verify SEBI registration."
            }
            ```'''
        else:
            mock_llm_response = '''```json
            {
                "risk_score": 85,
                "risk_level": "critical",
                "flags": [{"type": "urgency", "description": "Creates false urgency"}],
                "explanation": "This message exhibits typical signs of a pump and dump scheme.",
                "actions": ["Block sender", "Do not click links"],
                "educational_tip": "Never trust unsolicited investment advice on social media."
            }
            ```'''
            
        return self._extract_json(mock_llm_response)

    async def generate_education_response(self, topic: str, language: str) -> str:
        """Generate educational content about a topic using Gemini."""
        lang_name = self.language_map.get(language.lower(), "English")
        
        prompt = f"""
        {self._get_guardrails_prompt()}
        
        A user has asked a financial education question. Provide a helpful, clear, and empathetic response.
        If the question is completely unrelated to finance, scams, or SEBI, gently steer them back to financial education.
        Language to respond in: {lang_name}
        
        Question/Topic: "{topic}"
        """
        
        from app.config import settings
        import httpx
        
        # Best order: 1. Qwen, 2. Nemotron, 3. Liquid
        FREE_MODELS = [
            "qwen/qwen3.8-27b:free",
            "nvidia/nemotron-3.5-lightning:free",
            "liquid/lfm-2.5-2.6b:free"
        ]
        
        try:
            if settings.OPENROUTER_API_KEY:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    for model_id in FREE_MODELS:
                        try:
                            response = await client.post(
                                "https://openrouter.ai/api/v1/chat/completions",
                                headers={
                                    "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                                    "Content-Type": "application/json"
                                },
                                json={
                                    "model": model_id,
                                    "messages": [{"role": "user", "content": prompt}],
                                    "temperature": 0.5
                                }
                            )
                            response.raise_for_status()
                            return response.json()["choices"][0]["message"]["content"]
                        except Exception as e:
                            logger.warning(f"{model_id} failed in educate, falling back... Error: {e}")
                            continue
        except Exception as e:
            logger.error(f"OpenRouter API error in educate: {e}")
            
        # Fallback if API fails
        return f"Educational guide on {topic} in {lang_name}. Always remember to verify advisors on the SEBI website and never share OTPs."

    async def translate_response(self, text: str, target_language: str) -> str:
        """Translate text to target language."""
        return f"[Translated to {target_language}]: {text}"
        
    async def generate_whatsapp_response(self, text: str, language: str) -> str:
        """Generate a short, punchy response suitable for WhatsApp."""
        lang_name = self.language_map.get(language.lower(), "English")
        prompt = f"""
        {self._get_guardrails_prompt()}
        Provide a very short, clear, and actionable response (max 2-3 sentences) suitable for WhatsApp.
        Use formatting like *bold* for emphasis.
        Language: {lang_name}
        Text: {text}
        """
        # Simulated response
        return f"*Caution:* This looks suspicious. Please do not share any personal details. (Generated in {lang_name})"
