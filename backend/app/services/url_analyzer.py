import urllib.parse
import logging
from difflib import SequenceMatcher

logger = logging.getLogger(__name__)

# Known legitimate Indian financial domains
LEGITIMATE_DOMAINS = {
    "zerodha.com", "groww.in", "angelone.in", "upstox.com",
    "icicibank.com", "hdfcbank.com", "sbi.co.in", "icicidirect.com",
    "kotaksecurities.com", "hdfc.com", "axisbank.com",
    "motilaloswalsecurities.com", "sharekhan.com",
    "5paisa.com", "paytmmoney.com", "mstock.com",
    "bajajfinserv.in", "nipponindiaim.com",
    "sebi.gov.in", "bseindia.com", "nseindia.com",
    "nsdl.co.in", "cdslindia.com", "amfiindia.com",
    "scores.gov.in", "cybercrime.gov.in",
    "mutualfundssahihai.com", "moneycontrol.com",
}

# Common typosquatting patterns
SUSPICIOUS_TLDS = {".xyz", ".top", ".info", ".click", ".link", ".online", ".site", ".store", ".buzz", ".icu"}


def similarity(a: str, b: str) -> float:
    """Calculate string similarity ratio."""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def extract_domain(url: str) -> str:
    """Extract clean domain from a URL string."""
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    parsed = urllib.parse.urlparse(url)
    domain = parsed.netloc or parsed.path
    # Remove www. prefix
    if domain.startswith("www."):
        domain = domain[4:]
    # Remove port
    if ":" in domain:
        domain = domain.split(":")[0]
    return domain.lower()


def check_typosquatting(domain: str) -> dict:
    """Check if domain is a typosquat of a known legitimate domain."""
    results = []
    domain_base = domain.split(".")[0]  # e.g., "zer0dha" from "zer0dha.com"
    
    for legit in LEGITIMATE_DOMAINS:
        legit_base = legit.split(".")[0]
        sim = similarity(domain_base, legit_base)
        
        if 0.65 < sim < 1.0:  # Similar but not identical
            results.append({
                "legitimate_domain": legit,
                "similarity": round(sim, 2),
                "warning": f"This domain looks similar to {legit} — possible typosquatting"
            })
    
    return results


def analyze_url(url: str) -> dict:
    """Comprehensive URL risk analysis."""
    try:
        domain = extract_domain(url)
        
        risk_signals = []
        risk_score = 0.0
        
        # Check 1: Is it a known legitimate domain?
        if domain in LEGITIMATE_DOMAINS:
            return {
                "domain": domain,
                "risk_level": "LOW",
                "risk_score": 0.1,
                "is_known_legitimate": True,
                "signals": ["Domain matches a known legitimate financial institution"],
                "message": f"{domain} is a recognized legitimate financial domain."
            }
        
        # Check 2: Typosquatting detection
        typosquat_matches = check_typosquatting(domain)
        if typosquat_matches:
            risk_score += 0.4
            for match in typosquat_matches:
                risk_signals.append(
                    f"⚠️ Domain '{domain}' is suspiciously similar to '{match['legitimate_domain']}' "
                    f"(similarity: {match['similarity']*100:.0f}%)"
                )
        
        # Check 3: Suspicious TLD
        domain_tld = "." + domain.split(".")[-1] if "." in domain else ""
        if domain_tld in SUSPICIOUS_TLDS:
            risk_score += 0.2
            risk_signals.append(f"Domain uses suspicious TLD: {domain_tld}")
        
        # Check 4: Excessive subdomain depth
        subdomain_count = domain.count(".")
        if subdomain_count > 2:
            risk_score += 0.15
            risk_signals.append(f"Domain has unusually deep subdomains ({subdomain_count} levels)")
        
        # Check 5: Contains financial keywords in non-standard domain
        financial_keywords = ["sebi", "nsdl", "bse", "nse", "trading", "invest", "broker", "mutual", "stock", "share"]
        for kw in financial_keywords:
            if kw in domain and domain not in LEGITIMATE_DOMAINS:
                risk_score += 0.1
                risk_signals.append(f"Domain contains financial keyword '{kw}' but is not a recognized institution")
                break
        
        # Check 6: IP-based URL
        import re
        if re.match(r"^\d+\.\d+\.\d+\.\d+", domain):
            risk_score += 0.3
            risk_signals.append("URL uses an IP address instead of a domain name — highly suspicious")
        
        # Cap risk score
        risk_score = min(risk_score, 1.0)
        
        # Determine risk level
        if risk_score < 0.25:
            risk_level = "LOW"
        elif risk_score < 0.5:
            risk_level = "MEDIUM"
        elif risk_score < 0.75:
            risk_level = "HIGH"
        else:
            risk_level = "CRITICAL"
        
        return {
            "domain": domain,
            "risk_level": risk_level,
            "risk_score": round(risk_score, 2),
            "is_known_legitimate": False,
            "signals": risk_signals if risk_signals else ["No specific risk signals detected from URL structure"],
            "typosquatting_matches": typosquat_matches,
            "message": f"URL risk assessment: {risk_level} (score: {risk_score:.2f})"
        }
        
    except Exception as e:
        logger.error(f"URL analysis failed: {e}")
        return {
            "domain": url,
            "risk_level": "UNKNOWN",
            "risk_score": 0.5,
            "signals": [f"Could not fully analyze URL: {str(e)}"],
            "message": "URL analysis incomplete"
        }
