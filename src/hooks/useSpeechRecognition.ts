// src/hooks/useSpeechRecognition.ts
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";

export const useSpeechRecognition = (onTranscript: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn("Speech recognition is not supported by this browser.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript); // Use the callback to update parent state
    };

    recognition.onerror = (event: any) => {
      toast.error(`Speech recognition error: ${event.error}`);
    };
    
    // onend handles both successful and stopped recognition
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
      recognition.stop();
    };
  }, [onTranscript]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  return { isListening, toggleListening };
};