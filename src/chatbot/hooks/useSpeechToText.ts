import { useState, useRef, useEffect } from 'react';

export const useSpeechToText = (onResult: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');
  const isSessionActiveRef = useRef(false);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  const stopListening = () => {
    isSessionActiveRef.current = false;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setIsListening(false);
  };

  const clearTranscript = () => {
    finalTranscriptRef.current = '';
    onResult('');
  };

  const createNewRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'mr-IN';

    recognition.onresult = (event: any) => {
      if (!isSessionActiveRef.current) return;

      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcriptPart = result[0]?.transcript ?? '';

        if (result.isFinal) {
          finalTranscriptRef.current += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }

      onResult(`${finalTranscriptRef.current}${interimTranscript}`.trim());
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') setError("Please allow mic access");
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    return recognition;
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      setError(null);
      clearTranscript();
      isSessionActiveRef.current = true;
      try {
        recognitionRef.current = createNewRecognition();
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error("Mic start error:", err);
      }
    }
  };

  return { isListening, toggleListening, stopListening, clearTranscript, error };
};
