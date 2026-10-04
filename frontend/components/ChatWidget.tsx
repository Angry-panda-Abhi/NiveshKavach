"use client";

import { useState } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Hello! I am Kavach AI. Ask me any question about SEBI rules, avoiding scams, or filing a grievance." }
  ]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setChatMessage("");
    setChatLoading(true);

    fetch("http://localhost:8000/api/v1/educate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: userMsg, language: "en" })
    })
      .then(res => res.json())
      .then(data => {
        setChatHistory(prev => [...prev, { role: "assistant", content: data.response || "Sorry, I could not generate a response." }]);
        setChatLoading(false);
      })
      .catch(err => {
        console.error(err);
        setChatHistory(prev => [...prev, { role: "assistant", content: "Error connecting to the AI server. Is the backend running?" }]);
        setChatLoading(false);
      });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-slideUp" style={{ height: '500px', maxHeight: '70vh' }}>
          {/* Header */}
          <div className="bg-secondary p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v3M10 2h4" strokeWidth="2" strokeLinecap="round" />
                  <rect x="5" y="5" width="14" height="12" rx="4" strokeWidth="2" />
                  <path d="M8 9c.5-.8 1.5-.8 2 0M14 9c.5-.8 1.5-.8 2 0" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 13c1 1.5 4 1.5 5 0" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-sm">Kavach AI</h3>
                <p className="text-[10px] text-gray-300">Financial Safety Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    msg.role === "user" 
                      ? "bg-primary text-white rounded-br-none" 
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                  dangerouslySetInnerHTML={{ 
                    __html: msg.content
                      .replace(/### (.*?)\n/g, '<h3 class="font-bold text-sm mt-2 mb-1">$1</h3>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n\s*\*\s/g, '<br/>• ')
                      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 underline">$1</a>')
                      .replace(/\n/g, '<br/>') 
                  }}
                />
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask a question..."
              className="flex-grow px-3 py-2 bg-gray-100 text-sm border-transparent focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={!chatMessage.trim() || chatLoading}
              className="bg-primary text-white p-2 rounded-xl hover:bg-[#e65a29] transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-secondary' : 'bg-primary'} hover:scale-110 transition-transform duration-300 text-white p-4 rounded-full shadow-2xl flex items-center justify-center relative ${!isOpen ? 'animate-bounce' : ''}`}
        style={{ animationDuration: '3s' }}
      >
        {/* Notification Dot */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
          </span>
        )}
        
        {isOpen ? (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {/* Cute Robot Mascot */}
            <path d="M12 2v3M10 2h4" strokeWidth="2" strokeLinecap="round" />
            <rect x="5" y="5" width="14" height="12" rx="4" strokeWidth="2" fill="rgba(255,255,255,0.2)" />
            {/* Kawaii Eyes ^^ */}
            <path d="M8 9c.5-.8 1.5-.8 2 0M14 9c.5-.8 1.5-.8 2 0" strokeWidth="2" strokeLinecap="round" />
            {/* Blushing cheeks */}
            <circle cx="7.5" cy="11.5" r="1" fill="currentColor" stroke="none" opacity="0.6" />
            <circle cx="16.5" cy="11.5" r="1" fill="currentColor" stroke="none" opacity="0.6" />
            {/* Happy Smile */}
            <path d="M9 13c1 1.5 4 1.5 5 0" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
