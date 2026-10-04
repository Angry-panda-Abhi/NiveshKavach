"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "te", name: "తెలుగు (Telugu)" },
];

interface LanguageSelectorProps {
  onSelect?: (code: string) => void;
}

export default function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("nk_lang") || "en";
    setLang(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLang(newLang);
    localStorage.setItem("nk_lang", newLang);
    if (onSelect) onSelect(newLang);
  };

  return (
    <div className="flex items-center space-x-2 text-secondary">
      <Globe className="h-5 w-5" />
      <select
        value={lang}
        onChange={handleChange}
        className="form-select bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-primary focus:border-primary"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
    </div>
  );
}
