import json
import os
import re
from typing import Dict, Any, List
from .llm_service import LLMService

class ScamDetector:
    def __init__(self):
        self.llm_service = LLMService()
        self.patterns = []
        self._load_patterns()

    def _load_patterns(self):
        """Load patterns from JSON file."""
        try:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            file_path = os.path.join(base_dir, "data", "scam_patterns.json")
            if os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    self.patterns = json.load(f)
            else:
                # Fallback to empty list, will rely on LLM
                self.patterns = []
        except Exception as e:
            print(f"Error loading patterns: {e}")

    async def analyze(self, text: str, language: str, image_url: str = None) -> Dict[str, Any]:
        """Analyze text and/or image for scams using Rules + LLM."""
        detected_flags = []
        
        # 1. Rule-based detection
        text_lower = (text or "").lower()
        for item in self.patterns:
            pattern = item.get("pattern", "")
            if pattern and text_lower:
                try:
                    if re.search(pattern, text_lower, re.IGNORECASE):
                        detected_flags.append(item)
                except Exception:
                    pass

        # Calculate preliminary score
        score = self._calculate_risk_score(detected_flags)
        
        # 2. Extract and Validate UPI VPAs
        import re
        from .upi_validator import validate_upi_destination
        
        # Broad regex for UPI-like strings (e.g. name@bank)
        if text_lower:
            upi_matches = set(re.findall(r'[a-zA-Z0-9.\-_]+@[a-zA-Z]+', text_lower))
            for match in upi_matches:
                # Skip likely email addresses by ensuring no dot in the domain part for typical UPIs
                if '.' in match.split('@')[1]: 
                    continue
                    
                upi_result = validate_upi_destination(match)
                if upi_result.get("is_broker_account"):
                    # Safe SEBI broker account
                    detected_flags.append({
                        "type": "safe_broker_upi", 
                        "description_en": f"Verified SEBI Broker Account ({upi_result['broker_name']})", 
                        "description_hi": f"सत्यापित SEBI ब्रोकर खाता ({upi_result['broker_name']})"
                    })
                else:
                    if upi_result.get("risk_level") == "high":
                        score = 100 # Instantly max out risk
                        detected_flags.append({
                            "type": "personal_upi_fraud", 
                            "description_en": upi_result['message'],
                            "description_hi": "यह एक व्यक्तिगत UPI खाता है। SEBI नियमों के अनुसार, निवेश केवल ब्रोकर के बैंक खाते में होना चाहिए।"
                        })
        
        # 3. Extract and Validate URLs for Typosquatting
        from .url_analyzer import analyze_url
        
        # Broad regex for URLs
        if text_lower:
            url_matches = set(re.findall(r'https?://[a-zA-Z0-9.\-_]+[/\w\-\.]*', text_lower))
            for url in url_matches:
                url_result = analyze_url(url)
                if url_result.get("is_known_legitimate"):
                    detected_flags.append({
                        "type": "legitimate_domain", 
                        "description_en": f"Verified official link: {url_result['domain']}",
                        "description_hi": f"सत्यापित आधिकारिक लिंक: {url_result['domain']}"
                    })
                else:
                    if url_result.get("risk_level") in ["HIGH", "CRITICAL"]:
                        score = max(score, int(url_result["risk_score"] * 100))
                        for signal in url_result.get("signals", []):
                            detected_flags.append({
                                "type": "suspicious_url", 
                                "description_en": signal,
                                "description_hi": f"संदिग्ध लिंक मिला: {signal}"
                            })
        
        # 4. LLM deep analysis if flags detected or as fallback
        llm_result = await self.llm_service.analyze_scam(text or "", language, image_url)
        
        # Merge scores (take max of rule-based and LLM)
        final_score = max(score, llm_result.get("risk_score", 0))
        risk_level = self._get_risk_level(final_score)
        
        # Use LLM actions, fallback to rules if missing
        actions = llm_result.get("actions") or self._generate_actions(detected_flags, language)
        edu_tip = llm_result.get("educational_tip") or self._get_educational_tip(detected_flags, language)
        
        return {
            "risk_score": final_score,
            "risk_level": risk_level,
            "flags": [f.get(f"description_{language}", f.get("description_en", f["type"])) for f in detected_flags] + llm_result.get("flags", []),
            "explanation": llm_result.get("explanation", "Potential risk detected based on keywords."),
            "actions": actions,
            "educational_tip": edu_tip
        }

    def _calculate_risk_score(self, flags: List[Dict[str, Any]]) -> int:
        """Weigh different flags to produce a score 0-100."""
        score = 0
        for flag in flags:
            severity = flag.get("severity", "medium")
            if severity == "critical":
                score += 50
            elif severity == "high":
                score += 30
            elif severity == "medium":
                score += 15
            else:
                score += 5
        return min(100, score)

    def _get_risk_level(self, score: int) -> str:
        if score <= 30:
            return "safe"
        elif score <= 60:
            return "caution"
        else:
            return "danger"

    def _generate_actions(self, flags: List[Dict[str, Any]], language: str) -> List[str]:
        if language == "hi":
            actions = ["लिंक पर क्लिक न करें", "कोई व्यक्तिगत जानकारी साझा न करें"]
        else:
            actions = ["Do not click on any links", "Do not share personal information"]
            
        has_sebi = any(f["type"] == "fake_sebi" for f in flags)
        if has_sebi:
            if language == "hi":
                actions.append("SEBI पंजीकरण की पुष्टि करें")
            else:
                actions.append("Verify SEBI registration on official website")
                
        return actions

    def _get_educational_tip(self, flags: List[Dict[str, Any]], language: str) -> str:
        if not flags:
            return "SEBI रजिस्टर्ड एडवाइजर के माध्यम से ही निवेश करें।" if language == "hi" else "Always invest through SEBI registered advisors."
            
        primary_flag = flags[0]["type"]
        if "guarantee" in primary_flag:
            return "शेयर बाज़ार में रिटर्न की कोई गारंटी नहीं होती।" if language == "hi" else "Stock market returns are never guaranteed."
        return "सतर्क रहें, यह एक धोखाधड़ी हो सकती है।" if language == "hi" else "Stay vigilant, this could be a scam."
