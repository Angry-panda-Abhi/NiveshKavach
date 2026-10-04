import re

BROKER_UPI_PATTERNS = {
    'zerodha': ['zerodha@icici', 'zerodha-client@icici'],
    'groww': ['groww@axisbank', 'growwpay@axisbank'],
    'angelone': ['angelone@yesbank', 'angelbroking@yesbank'],
    'upstox': ['upstox@rblbank'],
    'icici_direct': ['icicidirect@icici'],
    '5paisa': ['5paisa@icici'],
}

def validate_upi_destination(upi_vpa: str) -> dict:
    if not upi_vpa:
        return {
            "is_broker_account": False,
            "broker_name": None,
            "risk_level": "unknown",
            "message": "No VPA provided.",
            "regulatory_note": ""
        }
    
    upi_vpa_lower = upi_vpa.lower().strip()
    
    # Check known broker patterns
    for broker, patterns in BROKER_UPI_PATTERNS.items():
        if upi_vpa_lower in patterns:
            return {
                "is_broker_account": True,
                "broker_name": broker,
                "risk_level": "low",
                "message": f"This is a verified SEBI-registered broker account ({broker}).",
                "regulatory_note": "Under SEBI's Upstreaming of Client Funds circular, ALL investment money MUST go to designated Client Bank Accounts."
            }

    # Personal VPA indicators
    # 10 digits before @
    phone_pattern = re.compile(r'^\d{10}@')
    personal_banks = ['@paytm', '@ybl', '@apl', '@ibl', '@okicici', '@oksbi', '@okaxis', '@okhdfcbank']
    
    is_personal = False
    if phone_pattern.match(upi_vpa_lower):
        is_personal = True
    elif any(b in upi_vpa_lower for b in personal_banks):
        is_personal = True
    elif '.' in upi_vpa_lower.split('@')[0]: # firstname.lastname
        is_personal = True

    if is_personal:
         return {
            "is_broker_account": False,
            "broker_name": None,
            "risk_level": "high",
            "message": "Warning: This looks like a personal UPI account, NOT a business/broker account. Investing through personal accounts is 100% fraud.",
            "regulatory_note": "Under SEBI's Upstreaming of Client Funds circular, ALL investment money MUST go to designated Client Bank Accounts."
        }

    return {
        "is_broker_account": False,
        "broker_name": None,
        "risk_level": "medium",
        "message": "This does not match known SEBI broker accounts. Proceed with extreme caution.",
        "regulatory_note": "Under SEBI's Upstreaming of Client Funds circular, ALL investment money MUST go to designated Client Bank Accounts."
    }

def validate_bank_account(account_number: str, ifsc: str = None) -> dict:
    # Just a placeholder basic check for now
    return {
        "is_broker_account": False,
        "risk_level": "unknown",
        "message": "Bank account validation requires additional APIs.",
        "regulatory_note": "Under SEBI's Upstreaming of Client Funds circular, ALL investment money MUST go to designated Client Bank Accounts."
    }
