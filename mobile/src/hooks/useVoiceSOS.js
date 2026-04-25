import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Speech from "expo-speech";

export const DEMO_MODE = true;
const DEFAULT_KEYWORDS = ["help", "sos", "emergency"];

function normalize(text) {
  return String(text || "").trim().toLowerCase();
}

export default function useVoiceSOS({
  onVoiceDetected,
  keywords = DEFAULT_KEYWORDS,
  demoMode = DEMO_MODE,
  autoSpeak = true
} = {}) {
  const [isListening, setIsListening] = useState(false);
  const [lastHeardText, setLastHeardText] = useState("");
  const [error, setError] = useState("");
  const demoTimerRef = useRef(null);

  const normalizedKeywords = useMemo(
    () => keywords.map((item) => normalize(item)).filter(Boolean),
    [keywords]
  );

  const speak = useCallback(
    (message) => {
      if (!autoSpeak || !message) {
        return;
      }

      Speech.stop();
      Speech.speak(message, { language: "en" });
    },
    [autoSpeak]
  );

  const stopListening = useCallback(() => {
    if (demoTimerRef.current) {
      clearTimeout(demoTimerRef.current);
      demoTimerRef.current = null;
    }
    setIsListening(false);
  }, []);

  const processTranscript = useCallback(
    (rawTranscript) => {
      const transcript = normalize(rawTranscript);
      setLastHeardText(transcript);

      if (!transcript) {
        return false;
      }

      const matchedKeyword = normalizedKeywords.find((keyword) =>
        transcript.includes(keyword)
      );

      if (!matchedKeyword) {
        return false;
      }

      speak("Help Detected");
      stopListening();

      if (typeof onVoiceDetected === "function") {
        onVoiceDetected({
          keyword: matchedKeyword,
          transcript,
          source: "voice"
        });
      }

      return true;
    },
    [normalizedKeywords, onVoiceDetected, speak, stopListening]
  );

  const startListening = useCallback(() => {
    setError("");
    setIsListening(true);
    speak("Listening");

    if (demoMode) {
      if (demoTimerRef.current) {
        clearTimeout(demoTimerRef.current);
      }

      demoTimerRef.current = setTimeout(() => {
        processTranscript("help needed");
      }, 3000);
      return;
    }

    // Hook is intentionally modular. Integrate any speech-to-text engine here
    // and call processTranscript(transcribedText) when text is received.
    setError("Voice engine not connected. Enable DEMO_MODE or plug in STT provider.");
  }, [demoMode, processTranscript, speak]);

  useEffect(
    () => () => {
      if (demoTimerRef.current) {
        clearTimeout(demoTimerRef.current);
      }
      Speech.stop();
    },
    []
  );

  return {
    isListening,
    lastHeardText,
    error,
    startListening,
    stopListening,
    processTranscript
  };
}
