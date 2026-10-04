import re
from urllib.parse import urlparse
from typing import Dict, Any, List

class URLChecker:
    def __init__(self):
        self.suspicious_tlds = ['.xyz', '.top', '.pw', '.tk', '.ml', '.ga', '.cf', '.gq', '.loan', '.click']
        self.shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 'ow.ly', 'cutt.ly']
        self.financial_keywords = ['login', 'verify', 'bank', 'secure', 'update', 'account', 'kyc', 'sebi', 'nsdl', 'cdsl', 'auth']

    def check_url(self, url: str) -> Dict[str, Any]:
        """Analyze a URL for safety and phishing characteristics."""
        if not url.startswith(('http://', 'https://')):
            url = 'http://' + url

        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower()
            path = parsed.path.lower()
            
            risk_factors: List[str] = []
            
            # Check TLD
            if any(domain.endswith(tld) for tld in self.suspicious_tlds):
                risk_factors.append("Suspicious Top-Level Domain (TLD)")
                
            # Check Shorteners
            if any(shortener in domain for shortener in self.shorteners):
                risk_factors.append("Uses URL shortener (often used to hide real destination)")
                
            # Check IP Address domain
            if re.match(r"^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$", domain):
                risk_factors.append("Uses IP address instead of domain name")
                
            # Check for excessive subdomains
            if len(domain.split('.')) > 3 and "www" not in domain:
                risk_factors.append("Excessive subdomains (possible phishing)")
                
            # Check for financial keywords in non-standard domains
            if any(kw in domain or kw in path for kw in self.financial_keywords):
                # Simple check: if it's not a major bank, flag it
                if not any(trusted in domain for trusted in ['hdfc', 'sbi', 'icici', 'zerodha', 'groww', 'upstox']):
                    risk_factors.append("Contains financial keywords but is not a recognized major institution")

            is_safe = len(risk_factors) == 0
            
            return {
                "url": url,
                "is_safe": is_safe,
                "risk_factors": risk_factors,
                "message": "URL appears safe." if is_safe else "Suspicious URL detected. Do not click or share personal info."
            }
            
        except Exception as e:
            return {
                "url": url,
                "is_safe": False,
                "risk_factors": ["Malformed or invalid URL format"],
                "message": "Could not parse URL properly."
            }
