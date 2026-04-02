import { useCallback, useEffect, useRef, useState } from 'react';

type SupportedLanguage = 'en-US' | 'hi-IN' | 'mr-IN';

interface SpeakOptions {
  lang?: SupportedLanguage;
  messageId?: string;
}

const DEFAULT_LANGUAGE: SupportedLanguage = 'en-US';

export const useTextToSpeech = (defaultLanguage: SupportedLanguage = DEFAULT_LANGUAGE) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [errorMessageId, setErrorMessageId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const speakTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance !== 'undefined';

    setIsSupported(supported);

    if (!supported) {
      return;
    }

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      if (supported) {
        if (speakTimeoutRef.current !== null) {
          window.clearTimeout(speakTimeoutRef.current);
        }
        window.speechSynthesis.cancel();
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
    };
  }, []);

  const getBestVoice = useCallback((lang: SupportedLanguage) => {
    const voices = voicesRef.current;
    if (!voices.length) return null;

    const normalizedLang = lang.toLowerCase();
    const baseLang = normalizedLang.split('-')[0];

    return (
      voices.find((voice) => voice.lang.toLowerCase() === normalizedLang) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith(`${baseLang}-`)) ||
      (baseLang !== 'en'
        ? voices.find((voice) => voice.lang.toLowerCase().startsWith('hi-'))
        : null) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith('en-')) ||
      voices.find((voice) => voice.default) ||
      voices[0]
    );
  }, []);

  const stop = useCallback(() => {
    if (!isSupported) return;

    if (speakTimeoutRef.current !== null) {
      window.clearTimeout(speakTimeoutRef.current);
      speakTimeoutRef.current = null;
    }

    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
    setActiveMessageId(null);
  }, [isSupported]);

  const speak = useCallback(
    (text: string, options?: SpeakOptions) => {
      if (!isSupported || !text.trim()) return;

      setLastError(null);
      setErrorMessageId(null);
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const selectedLang = options?.lang || defaultLanguage;
      const selectedVoice = getBestVoice(selectedLang);

      utterance.lang = selectedVoice?.lang || selectedLang;
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setActiveMessageId(options?.messageId ?? null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setActiveMessageId(null);
        utteranceRef.current = null;
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setActiveMessageId(null);
        utteranceRef.current = null;
        setLastError('Speech playback failed');
        setErrorMessageId(options?.messageId ?? null);
      };

      utteranceRef.current = utterance;

      if (speakTimeoutRef.current !== null) {
        window.clearTimeout(speakTimeoutRef.current);
      }

      speakTimeoutRef.current = window.setTimeout(() => {
        try {
          window.speechSynthesis.resume();
          window.speechSynthesis.speak(utterance);
        } catch (error) {
          setIsSpeaking(false);
          setActiveMessageId(null);
          utteranceRef.current = null;
          setLastError('Speech playback failed');
          setErrorMessageId(options?.messageId ?? null);
          console.error('Speech synthesis error:', error);
        } finally {
          speakTimeoutRef.current = null;
        }
      }, 80);
    },
    [defaultLanguage, getBestVoice, isSupported]
  );

  return {
    isSupported,
    isSpeaking,
    activeMessageId,
    lastError,
    errorMessageId,
    speak,
    stop,
  };
};

export type { SupportedLanguage };
