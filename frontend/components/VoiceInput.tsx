"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
}

export default function VoiceInput({ onTranscript, language = "en-IN" }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  let recognition: any = null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSupported(false);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!supported) return;

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        className="p-3 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center cursor-not-allowed group relative"
      >
        <MicOff className="h-5 w-5" />
        <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded w-max">
          Voice input not supported
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleRecording}
      className={`p-3 rounded-full flex items-center justify-center transition-all ${
        isRecording
          ? "bg-red-100 text-danger animate-pulse ring-2 ring-danger"
          : "bg-primary/10 text-primary hover:bg-primary/20"
      }`}
      title="Voice Input"
    >
      <Mic className="h-5 w-5" />
    </button>
  );
}
