"use client";

import { useState } from "react";

const educationData = [
  {
    id: 1,
    category: "Scam Awareness",
    title: "Pump and Dump Schemes",
    content: {
      en: "In a pump-and-dump scheme, fraudsters buy cheap stocks, spread fake positive news (on Telegram/WhatsApp) to drive up the price (pump), and then sell their shares at the peak (dump). Retail investors are left with worthless shares when the price crashes.",
      hi: "पंप एंड डंप योजना में, जालसाज सस्ते शेयर खरीदते हैं, कीमत बढ़ाने के लिए (टेलीग्राम/व्हाट्सएप पर) फर्जी सकारात्मक खबरें फैलाते हैं, और फिर अपने शेयर ऊंचे दाम पर बेच देते हैं। जब कीमत गिरती है तो खुदरा निवेशकों के पास बेकार शेयर रह जाते हैं।"
    }
  },
  {
    id: 2,
    category: "Rights",
    title: "Your Rights as an Investor",
    content: {
      en: "1. Right to receive the Best Execution of trades.\n2. Right to receive Contract Notes within 24 hours.\n3. Right to file complaints on SCORES if the broker ignores your grievance.\n4. Right to receive dividends and corporate benefits on time.",
      hi: "1. ट्रेडों का सर्वोत्तम निष्पादन प्राप्त करने का अधिकार।\n2. 24 घंटे के भीतर कॉन्ट्रैक्ट नोट प्राप्त करने का अधिकार।\n3. यदि ब्रोकर आपकी शिकायत को अनदेखा करता है तो SCORES पर शिकायत दर्ज करने का अधिकार।\n4. समय पर लाभांश और कॉर्पोरेट लाभ प्राप्त करने का अधिकार।"
    }
  },
  {
    id: 3,
    category: "Basics",
    title: "What is a SEBI RIA?",
    content: {
      en: "RIA stands for Registered Investment Advisor. Under SEBI regulations, only RIAs are legally allowed to charge you a fee for providing personalized financial planning and investment advice. Always check their registration number starting with 'INA'.",
      hi: "RIA का मतलब रजिस्टर्ड इन्वेस्टमेंट एडवाइजर है। SEBI के नियमों के तहत, केवल RIA को ही व्यक्तिगत वित्तीय योजना और निवेश सलाह देने के लिए आपसे शुल्क लेने की कानूनी अनुमति है। हमेशा उनका पंजीकरण नंबर जांचें जो 'INA' से शुरू होता है।"
    }
  }
];

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [lang, setLang] = useState<"en" | "hi">("en");
  
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Hello! I am your AI financial safety assistant. Ask me any question about SEBI rules, avoiding scams, or filing a grievance." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const tabs = ["All", "Scam Awareness", "Rights", "Basics"];

  const filteredData = activeTab === "All" 
    ? educationData 
    : educationData.filter(d => d.category === activeTab);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatHistory([...chatHistory, { role: "user", content: userMsg }]);
    setChatMessage("");
    setChatLoading(true);

    // Call the real FastAPI backend
    fetch("http://localhost:8000/api/v1/educate/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: userMsg, language: lang })
    })
      .then(res => res.json())
      .then(data => {
        setChatHistory(prev => [...prev, { role: "assistant", content: data.response || "Sorry, I could not generate a response." }]);
        setChatLoading(false);
      })
      .catch(err => {
        console.error(err);
        setChatHistory(prev => [...prev, { role: "assistant", content: "Error connecting to the AI server. Please make sure the backend is running." }]);
        setChatLoading(false);
      });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 md:py-20 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-secondary mb-4">Investor Education Hub</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Knowledge is your best shield against financial fraud. Learn how to spot scams, understand your rights, and invest safely.
        </p>
      </div>

      {/* AI Chat Interface has been moved to a global floating widget */}

      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab 
                  ? "bg-primary text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => setLang("en")}
            className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${lang === "en" ? "bg-white shadow text-primary" : "text-gray-500"}`}
          >
            English
          </button>
          <button 
            onClick={() => setLang("hi")}
            className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${lang === "hi" ? "bg-white shadow text-primary" : "text-gray-500"}`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-4 mb-16">
        {filteredData.map((item) => (
          <div key={item.id} className="glass rounded-xl overflow-hidden shadow-sm transition-all duration-300">
            <button 
              onClick={() => toggleExpand(item.id)}
              className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
            >
              <div>
                <span className="text-xs font-bold text-primary uppercase mb-1 block">{item.category}</span>
                <h3 className="text-lg font-bold text-secondary">{item.title}</h3>
              </div>
              <svg 
                className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${expandedId === item.id ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div 
              className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${expandedId === item.id ? "max-h-96 pb-6 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {item.content[lang]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
