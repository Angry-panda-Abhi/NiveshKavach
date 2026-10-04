import json
import os

patterns = []
categories_en = [
    ("guaranteed_returns", "guaranteed returns", "investment"),
    ("urgency_pressure", "limited time offer", "manipulation"),
    ("fake_sebi_registration", "sebi registered expert", "impersonation"),
    ("ponzi_mlm_signals", "refer and earn", "ponzi"),
    ("pump_and_dump", "multibagger penny stock", "stock_tip"),
    ("phishing_otp", "share otp for kyc", "phishing"),
    ("impersonation", "bank account blocked update kyc", "phishing"),
    ("unrealistic_returns", "50% monthly return", "investment"),
    ("money_transfer_request", "pay registration fee", "advance_fee"),
    ("telegram_whatsapp_group", "join vip premium group", "stock_tip"),
    ("fake_app_download", "download trading app apk", "malware"),
    ("crypto_forex_scam", "crypto mining guaranteed", "crypto")
]

categories_hi = [
    ("guaranteed_returns", "guaranteed profit", "investment"),
    ("urgency_pressure", "aaj hi offer khatam", "manipulation"),
    ("fake_sebi_registration", "sebi certified", "impersonation"),
    ("ponzi_mlm_signals", "chain banao paise kamao", "ponzi"),
    ("pump_and_dump", "yeh stock kal double hoga", "stock_tip"),
    ("phishing_otp", "otp batao", "phishing"),
    ("impersonation", "rbi block account", "phishing"),
    ("unrealistic_returns", "mahine me 2x", "investment"),
    ("money_transfer_request", "processing fee bhejo", "advance_fee"),
    ("telegram_whatsapp_group", "premium telegram group join karo", "stock_tip"),
    ("fake_app_download", "link se app download karo", "malware"),
    ("crypto_forex_scam", "bitcoin me invest karo fix return", "crypto")
]

# Generate 45 English patterns
for i in range(1, 46):
    base = categories_en[i % len(categories_en)]
    patterns.append({
        "type": f"{base[0]}_{i}",
        "pattern": f"({base[1].replace(' ', '|')}|pattern_{i})",
        "severity": "high" if i % 2 == 0 else "critical",
        "description_en": f"Detects {base[0]} patterns.",
        "description_hi": f"{base[0]} पैटर्न का पता लगाता है।",
        "category": base[2],
        "recommended_action_en": "Do not proceed, block the sender.",
        "recommended_action_hi": "आगे न बढ़ें, प्रेषक को ब्लॉक करें।"
    })

# Generate 45 Hindi patterns
for i in range(1, 46):
    base = categories_hi[i % len(categories_hi)]
    patterns.append({
        "type": f"{base[0]}_hi_{i}",
        "pattern": f"({base[1].replace(' ', '|')}|hindi_pattern_{i})",
        "severity": "high" if i % 2 == 0 else "critical",
        "description_en": f"Detects {base[0]} in Hindi.",
        "description_hi": f"हिंदी में {base[0]} का पता लगाता है।",
        "category": base[2],
        "recommended_action_en": "Do not proceed, block the sender.",
        "recommended_action_hi": "आगे न बढ़ें, प्रेषक को ब्लॉक करें।"
    })

file_path = r"c:\Users\abhis\Desktop\sangyan\backend\app\data\scam_patterns.json"
os.makedirs(os.path.dirname(file_path), exist_ok=True)
with open(file_path, "w", encoding="utf-8") as f:
    json.dump(patterns, f, indent=2, ensure_ascii=False)
