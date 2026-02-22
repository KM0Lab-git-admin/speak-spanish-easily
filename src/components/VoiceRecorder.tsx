import { useState, useEffect, useRef, useCallback } from "react";
import { Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  onCancel: () => void;
  lang?: string;
}

const langMap: Record<string, string> = {
  ca: "ca-ES",
  es: "es-ES",
  en: "en-GB",
};

const BAR_COUNT = 5;

const VoiceRecorder = ({ onTranscript, onCancel, lang = "es" }: VoiceRecorderProps) => {
  const [listening, setListening] = useState(false);
  const [partialText, setPartialText] = useState("");
  const recognitionRef = useRef<any>(null);
  const finalTextRef = useRef("");

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
    const result = (finalTextRef.current + " " + partialText).trim();
    if (result) {
      onTranscript(result);
    } else {
      onCancel();
    }
  }, [partialText, onTranscript, onCancel]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz.");
      onCancel();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langMap[lang] || "es-ES";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let final = "";
      for (let i = 0; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + " ";
        } else {
          interim += transcript;
        }
      }
      if (final) finalTextRef.current = final.trim();
      setPartialText(interim);
    };

    recognition.onerror = () => {
      setListening(false);
      onCancel();
    };

    recognition.onend = () => {
      // Only handle if still in listening mode (browser auto-stopped)
      setListening(false);
    };

    recognition.start();
    setListening(true);

    return () => {
      recognition.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="flex items-center gap-3 bg-card rounded-full border border-border px-3 py-2 shadow-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {/* Listening label */}
        <span className="font-body text-sm text-primary font-semibold ml-1 whitespace-nowrap">
          Escuchando…
        </span>

        {/* Animated bars */}
        <div className="flex items-center gap-[3px] flex-1 justify-center">
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <motion.span
              key={i}
              className="w-[4px] rounded-full bg-accent"
              animate={
                listening
                  ? {
                      height: ["8px", "22px", "12px", "20px", "8px"],
                    }
                  : { height: "8px" }
              }
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
              style={{ height: 8 }}
            />
          ))}
        </div>

        {/* Partial transcript preview */}
        {(finalTextRef.current || partialText) && (
          <span className="font-body text-xs text-muted-foreground truncate max-w-[100px]">
            {(finalTextRef.current + " " + partialText).trim().slice(-40)}
          </span>
        )}

        {/* Stop button */}
        <button
          onClick={stop}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity shrink-0"
          aria-label="Stop recording"
        >
          <Square size={16} fill="currentColor" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceRecorder;
