"use client";

import { useState, useRef, useEffect } from "react";

export default function WhatsAppSimulator() {
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: "Hi, I am NiveshKavach Bot. Forward me any suspicious message and I'll analyze it for you!", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInput("");
    setLoading(true);

    try {
      // Simulate Twilio Form Data Payload
      const formData = new URLSearchParams();
      formData.append("Body", userMsg);
      formData.append("From", "whatsapp:+1234567890");

      const res = await fetch("http://localhost:8000/api/v1/webhook/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!res.ok) throw new Error("Backend failed");

      // Twilio webhooks return XML
      const xmlText = await res.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const botReply = xmlDoc.getElementsByTagName("Message")[0]?.textContent || "Could not parse response.";

      setMessages(prev => [...prev, { text: botReply, isBot: true }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { text: "Error connecting to backend.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  const formatWhatsAppText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\*(.*?)\*/g, "<strong>$1</strong>") // Bold
      .replace(/_(.*?)_/g, "<em>$1</em>")          // Italic
      .replace(/~(.*?)~/g, "<del>$1</del>");       // Strikethrough
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#ece5dd] flex items-center justify-center p-4 font-sans overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full md:h-[90vh]">
        
        {/* WhatsApp Header */}
        <div className="bg-[#075e54] text-white p-4 flex items-center gap-3 shadow-md z-10">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <svg className="w-6 h-6 text-[#075e54]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <div>
            <h2 className="font-bold text-lg">NiveshKavach Bot</h2>
            <p className="text-xs text-[#d9ebd9]">🟢 Online - Official Check</p>
          </div>
        </div>

        {/* Chat Area (WhatsApp Background pattern simulated with color) */}
        <div className="flex-1 bg-[#efe7dd] p-4 overflow-y-auto flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`max-w-[85%] p-3 rounded-lg shadow-sm whitespace-pre-wrap ${msg.isBot ? 'bg-white self-start rounded-tl-none' : 'bg-[#dcf8c6] self-end rounded-tr-none'}`}>
              <p className="text-sm text-gray-800" dangerouslySetInnerHTML={{ __html: formatWhatsAppText(msg.text) }} />
              <p className="text-[10px] text-gray-400 text-right mt-1">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          ))}
          {loading && (
            <div className="max-w-[85%] p-3 rounded-lg bg-white self-start rounded-tl-none shadow-sm">
              <p className="text-sm text-gray-500 italic flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-[#075e54]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                typing...
              </p>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-[#f0f0f0] p-3 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 rounded-full px-4 py-2 border-none focus:ring-0 focus:outline-none text-sm text-gray-800"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-10 h-10 bg-[#075e54] text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50"
          >
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
