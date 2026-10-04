# Solution Overview — NiveshKavach (निवेश कवच)

## How It Works

NiveshKavach is a **multilingual, voice-enabled scam detection and investor protection platform** accessible via WhatsApp and Web. The core user action is dead simple:

> **Forward a suspicious message → Get instant scam risk analysis in your language**

---

## Solution Architecture

### 1. Scam Detection Engine (Core Feature)

When a user forwards a message, NiveshKavach runs a **multi-layer analysis**:

**Layer 1 — Rule-Based Detection (instant, <100ms)**
- 100+ regex patterns matching known scam indicators
- Covers English AND Hindi patterns
- Categories: guaranteed returns, urgency, fake SEBI claims, Ponzi signals, pump-and-dump, phishing, impersonation

**Layer 2 — AI-Powered Analysis (Gemini LLM)**
- Contextual understanding of the message
- Detects subtle manipulation tactics
- Generates natural-language explanation in user's language
- Enforced guardrails: NEVER gives financial advice

**Layer 3 — Verification**
- Checks claimed SEBI registration numbers against database
- Analyzes URLs for suspicious patterns (domain age, TLD, shorteners)
- Cross-references known scam databases

**Output: Risk Score (0-100) + Evidence-Based Explanation**
```
🛡️ NiveshKavach Analysis
🔴 RISK LEVEL: HIGH (87/100)

⚠️ Red Flags Found:
├─ Claims "guaranteed 50% returns" → No legitimate investment guarantees returns
├─ SEBI registration INA000XXXX → ❌ NOT found in SEBI database
├─ Uses urgency: "Last 5 seats" → Classic pressure tactic
└─ Suspicious link: bit.ly/invest → Domain registered 3 days ago

📋 What You Should Do:
1. ❌ Do NOT send any money
2. 🚫 Block this number
3. 📝 Report to SEBI: scores.gov.in
```

### 2. Multilingual Voice Interface

For users who aren't comfortable typing:
- **Voice input** → Whisper/Web Speech API → Text → Analysis → Voice response
- Supports Hindi, English, Marathi, Bengali, Tamil, Telugu
- Edge TTS for natural-sounding voice responses

### 3. SEBI Advisor Verification

- User enters advisor name or registration number
- System checks against SEBI's registered intermediary database
- Returns: found/not found, entity type, validity, warnings

### 4. Investor Education (RAG-Powered)

- Knowledge base built from SEBI/NSDL investor education materials
- Users can ask questions in any supported language
- Topics: scam patterns, investor rights, F&O risks, complaint filing
- **Guardrail: NEVER recommends specific investments**

### 5. Grievance Navigator

- Step-by-step guided wizard
- Helps users file complaints on SCORES, cybercrime.gov.in, IEPF
- Generates complaint draft templates
- Available in Hindi and English

---

## Technology Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| Backend | FastAPI (Python) | Async, fast, ML-friendly |
| Frontend | Next.js 14 + Tailwind | Modern, responsive |
| LLM | Google Gemini API | Multilingual, free tier |
| Voice | Web Speech API + Edge TTS | Free, Indian language support |
| Database | SQLite | Zero config, portable |
| WhatsApp | Twilio API | 500M Indian users |
| OCR | Gemini Vision | Mixed Hindi/English screenshots |

---

## How NiveshKavach Improves Investor Resilience

1. **Intercepts scams before money changes hands** — real-time detection at point of exposure
2. **Works where users already are** — WhatsApp, no app download needed
3. **Speaks their language** — Hindi-first, 6 languages supported
4. **Educates through experience** — every analysis teaches a scam pattern
5. **Empowers action** — direct links to SEBI, SCORES, cybercrime portals
6. **Privacy-first** — no PII stored, hashed identifiers, auto-delete

---

## Guardrail Compliance

| Rule | Implementation |
|------|---------------|
| No stock tips | System prompt enforced, response filtering |
| No price predictions | LLM guardrails, output validation |
| No broker promotion | Hardcoded blocklist in responses |
| Privacy by design | Hashed phone numbers, no PII storage |
| Uncertainty disclosure | Always says "appears risky" not "is a scam" |
| Non-commercial | No monetization, no upsells, public-good tool |
