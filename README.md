<div align="center">
  <h1>🛡️ NiveshKavach (निवेश कवच) — Investment Shield</h1>
  <p><strong>Every Investor's Protection Shield | हर निवेशक का सुरक्षा कवच</strong></p>

  ![SANGYAN Hackathon](https://img.shields.io/badge/SANGYAN-Hackathon_2026-FF6B35?style=for-the-badge)
  ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
  ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
  ![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)

  <br />
  <p>Built for <b>SANGYAN Hackathon 2026</b> — SNTC IIT (BHU) × SEBI × NSDL</p>
</div>

---

## 🎯 What is NiveshKavach?

NiveshKavach is a **multilingual, AI-powered scam detection and investor protection platform** that works seamlessly across WhatsApp and Web. Users can forward suspicious messages, upload screenshots, or ask questions to our 24/7 Chatbot — and get instant scam risk analysis in their native language.

### Challenge Track: A + E (Digital Fraud & Scam Resilience + Misinformation & Content Literacy)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- OpenRouter API Key (free): https://openrouter.ai/
- Twilio Account (free sandbox): https://www.twilio.com/try-twilio

### 1. Clone & Setup Backend

```bash
cd backend
# Create a .env file and add your OpenRouter API Key
# OPENROUTER_API_KEY=your_key_here

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Open in Browser
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 🏗️ Architecture

```text
┌──────────────────────────────────────────────┐
│                 USER LAYER                    │
│  ┌───────────────┐  ┌────────────────────┐   │
│  │   WhatsApp     │  │   Web Dashboard    │   │
│  │  (Primary)     │  │  (With Chatbot)    │   │
│  └───────┬───────┘  └────────┬───────────┘   │
└──────────┼───────────────────┼───────────────┘
           │                   │
┌──────────▼───────────────────▼───────────────┐
│              API GATEWAY (FastAPI)             │
│  /analyze  /verify  /educate  /voice  /griev  │
└──────────┬───────────────────────────────────┘
           │
┌──────────▼───────────────────────────────────┐
│               AI ENGINE                       │
│  ┌─────────┐ ┌─────────┐ ┌──────────────┐   │
│  │  Scam   │ │  Qwen   │ │   Nemotron    │   │
│  │Detector │ │  27B    │ │ 3.5 Lightning │   │
│  └─────────┘ └─────────┘ └──────────────┘   │
│  ┌─────────┐ ┌─────────┐ ┌──────────────┐   │
│  │  SEBI   │ │ Vision  │ │  OpenRouter   │   │
│  │Verifier │ │   AI    │ │    Router     │   │
│  └─────────┘ └─────────┘ └──────────────┘   │
└──────────────────────────────────────────────┘
```

---

## 📱 Core Features

| Feature | Description |
|---------|-------------|
| 🔍 **Scam Detector** | Forward any suspicious message/SMS → Get an instant Risk Score (0-100). |
| 📷 **Screenshot Analysis** | Upload screenshots of suspicious messages or fake charts for deep Vision OCR. |
| 🤖 **Kavach Buddy** | A 24/7 floating AI chatbot embedded across the site to answer financial queries. |
| ✅ **SEBI Verifier** | Cross-check if an advisor/entity is officially SEBI registered. |
| 🌍 **Auto-Vernacular** | AI auto-detects Hindi/Hinglish/English phonetics and responds natively. |
| 🚨 **Grievance Navigator**| Step-by-step interactive wizard to file complaints (SCORES, Cybercrime). |
| 📚 **Education Hub** | Learn about scam patterns, investor rights, and safe investing. |

---

## 🌐 Supported Languages

| Language | Code | Status |
|----------|------|--------|
| हिन्दी / Hinglish (Hindi) | hi | ✅ Primary (Auto-Detected) |
| English | en | ✅ Primary (Auto-Detected) |
| मराठी (Marathi) | mr | ✅ Supported via LLM |
| বাংলা (Bengali) | bn | ✅ Supported via LLM |
| தமிழ் (Tamil) | ta | ✅ Supported via LLM |
| తెలుగు (Telugu) | te | ✅ Supported via LLM |

---

## 🛡️ Guardrails & Compliance

NiveshKavach is a **public-good, investor-protection tool**. It:

- ✅ Analyzes messages against strict anti-scam patterns.
- ✅ Verifies advisor registrations against public SEBI data.
- ✅ Educates about financial risks and rights.
- ✅ Uses privacy-by-design (hashed identifiers, no PII storage).
- ❌ **NEVER** gives stock tips or buy/sell/hold advice.
- ❌ **NEVER** predicts stock prices or returns.
- ❌ **NEVER** promotes any broker, fund, or scheme.
- ❌ **NEVER** collects OTPs, SMS data, or bank details.

---

## 🧰 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | FastAPI (Python 3.11), SQLite (for real-time scam metrics) |
| **Frontend** | Next.js 14, React, TailwindCSS, HTML5 Canvas |
| **AI LLM Routing**| OpenRouter API (Dynamic Model Selection) |
| **Primary Text AI** | `qwen/qwen3.8-27b:free` (Optimized for Indic languages) |
| **Fast Fallback** | `nvidia/nemotron-3.5-lightning:free` |
| **WhatsApp** | Twilio API (Webhook Integration) |

---

## 📂 Project Structure

```text
sangyan/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Environment config
│   │   ├── models/              # SQLite DB schemas
│   │   ├── routers/             # API endpoints (/analyze, /whatsapp)
│   │   ├── services/            # Core AI Logic (llm_service, scam_detector)
│   │   └── data/                # Hardcoded scam patterns & RAG docs
│   ├── requirements.txt
├── frontend/
│   ├── app/                     # Next.js pages (Check Scam, Grievance, etc.)
│   ├── components/              # ChatWidget, Navbar, RiskMeter
│   ├── tailwind.config.ts
└── README.md
```

---

## 👤 Target Users

- **Kavita, 39** — Tier-2 homemaker managing family savings, not fluent in English. Uses WhatsApp for updates.
- **Praveen, 22** — Tier-3 graduate, new to trading, highly exposed to Telegram "Pump and Dump" tips.
- **Babulal, 63** — Retired pensioner targeted by impersonators offering to demat old physical share certificates.

---

## 📊 Impact & Scalability

- WhatsApp has **500M+ Indian users** — zero distribution cost and no app downloads required.
- The Auto-Vernacular engine covers **80%+ of India's population**.
- **Zero download, zero registration, zero cost** for end users.
- Can be natively adopted by SEBI/NSDL as their official investor protection hotline.

---

## 🏆 Built for SANGYAN Hackathon 2026

Organised by **SNTC, IIT (BHU) Varanasi** in collaboration with **SEBI & NSDL**.

---

## ⚖️ Disclaimer

NiveshKavach is an investor protection and awareness tool. It does NOT provide financial advice, stock recommendations, or investment guidance. Always verify information independently through official SEBI channels.

---

## 📜 License

This project is submitted for SANGYAN Hackathon 2026. All intellectual property vests in NSDL upon submission, per hackathon Terms & Conditions.
