# 🛡️ NiveshKavach (निवेश कवच) — Investment Shield

> **Every Investor's Protection Shield | हर निवेशक का सुरक्षा कवच**

Built for **SANGYAN Hackathon 2026** — SNTC IIT (BHU) × SEBI × NSDL

---

## 🎯 What is NiveshKavach?

NiveshKavach is a **multilingual, voice-enabled scam detection and investor protection platform** that works on WhatsApp and Web. Users can forward suspicious messages, screenshots, or ask questions by voice — and get instant scam risk analysis in their language.

### Challenge Track: A + E (Digital Fraud & Scam Resilience + Misinformation & Content Literacy)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- Google Gemini API Key (free): https://makersuite.google.com/app/apikey
- Twilio Account (free sandbox): https://www.twilio.com/try-twilio

### 1. Clone & Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your API keys

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
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### 4. (Optional) Docker

```bash
docker-compose up --build
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────┐
│                 USER LAYER                    │
│  ┌───────────────┐  ┌────────────────────┐   │
│  │   WhatsApp     │  │   Web Dashboard    │   │
│  │  (Primary)     │  │   (Demo/Admin)     │   │
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
│  │  Scam   │ │ Gemini  │ │    Voice      │   │
│  │Detector │ │  LLM    │ │  STT / TTS    │   │
│  └─────────┘ └─────────┘ └──────────────┘   │
│  ┌─────────┐ ┌─────────┐ ┌──────────────┐   │
│  │  SEBI   │ │   RAG   │ │     OCR      │   │
│  │Verifier │ │ Engine  │ │  (Gemini V)  │   │
│  └─────────┘ └─────────┘ └──────────────┘   │
└──────────────────────────────────────────────┘
```

---

## 📱 Features

| Feature | Description |
|---------|-------------|
| 🔍 Scam Detector | Forward any suspicious message → Get instant risk analysis |
| ✅ SEBI Verifier | Check if an advisor/entity is SEBI registered |
| 🎙️ Voice Support | Ask questions by voice in Hindi + 5 regional languages |
| 📚 Education Hub | Learn about scam patterns, investor rights, and safe investing |
| 🚨 Grievance Navigator | Step-by-step guide to file complaints (SCORES, Cybercrime) |
| 📷 Screenshot Analysis | Upload screenshot of suspicious message for OCR + analysis |

---

## 🌐 Supported Languages

| Language | Code | Status |
|----------|------|--------|
| हिन्दी (Hindi) | hi | ✅ Primary |
| English | en | ✅ |
| मराठी (Marathi) | mr | ✅ |
| বাংলা (Bengali) | bn | ✅ |
| தமிழ் (Tamil) | ta | ✅ |
| తెలుగు (Telugu) | te | ✅ |

---

## 🛡️ Guardrails & Compliance

NiveshKavach is a **public-good, investor-protection tool**. It:

- ✅ Analyzes messages for scam patterns
- ✅ Verifies advisor registrations against public SEBI data
- ✅ Educates about financial risks and rights
- ✅ Uses privacy-by-design (hashed identifiers, no PII storage)
- ❌ NEVER gives stock tips or buy/sell/hold advice
- ❌ NEVER predicts stock prices or returns
- ❌ NEVER promotes any broker, fund, or scheme
- ❌ NEVER collects OTPs, SMS data, or bank details

---

## 🧰 Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | FastAPI (Python 3.11) |
| Frontend | Next.js 14 + TailwindCSS |
| LLM | Google Gemini API |
| Voice STT | Web Speech API / Whisper |
| Voice TTS | Edge TTS |
| Database | SQLite (hackathon) |
| WhatsApp | Twilio API (sandbox) |
| Deployment | Railway / Render |

---

## 📂 Project Structure

```
sangyan/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Environment config
│   │   ├── models/              # Pydantic + DB models
│   │   ├── routers/             # API endpoints
│   │   ├── services/            # Business logic
│   │   └── data/                # Scam patterns + education content
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/                     # Next.js pages
│   ├── components/              # React components
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 👤 Target Users

- **Kavita, 39** — Tier-2 homemaker managing family savings, not fluent in English
- **Praveen, 22** — Tier-3 graduate, new to trading, exposed to Telegram tips
- **Babulal, 63** — Retired pensioner with old physical share certificates

---

## 📊 Impact

- WhatsApp has **500M+ Indian users** — zero distribution cost
- Supports **6 languages** covering 80%+ of India's population
- **Zero download, zero registration, zero cost** for users
- Can be adopted by SEBI/NSDL as official investor protection tool

---

## 🏆 Built for SANGYAN Hackathon 2026

Organised by **SNTC, IIT (BHU) Varanasi** in collaboration with **SEBI & NSDL**

---

## ⚖️ Disclaimer

NiveshKavach is an investor protection and awareness tool. It does NOT provide financial advice, stock recommendations, or investment guidance. Always verify information independently through official SEBI channels.

---

## 📜 License

This project is submitted for SANGYAN Hackathon 2026. All intellectual property vests in NSDL upon submission, per hackathon Terms & Conditions.
