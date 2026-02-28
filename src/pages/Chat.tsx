import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Mic, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Km0Logo from "@/components/Km0Logo";
import NotificationBell from "@/components/NotificationBell";
import VoiceRecorder from "@/components/VoiceRecorder";
import EventCard from "@/components/EventCard";
import robotIcon from "@/assets/km0_robot_icon_v2.png";
import chatLogo from "@/assets/km0_chat_blue.png";
import xatLogo from "@/assets/km0_xat_blue.png";
import { queryEvents, type Evento } from "@/services/eventQueryApi";

type Lang = "ca" | "es" | "en";

const i18n = {
  ca: {
    greeting: (city: string) =>
      `¡Hola! Sóc el teu assistent local de ${city}. En què et puc ajudar avui?`,
    placeholder: "Escriu un missatge...",
    dateLabel: () => {
      const d = new Date();
      return d.toLocaleDateString("ca-ES", { day: "numeric", month: "long", year: "numeric" });
    },
  },
  es: {
    greeting: (city: string) =>
      `¡Hola! Soy tu asistente local de ${city}. ¿En qué puedo ayudarte hoy?`,
    placeholder: "Escribe un mensaje...",
    dateLabel: () => {
      const d = new Date();
      return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    },
  },
  en: {
    greeting: (city: string) =>
      `Hello! I'm your local assistant for ${city}. How can I help you today?`,
    placeholder: "Write a message...",
    dateLabel: () => {
      const d = new Date();
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    },
  },
};

type Message = {
  id: number;
  role: "assistant" | "user";
  content: string;
  eventos?: Evento[];
};

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lang: Lang = (location.state?.lang as Lang) ?? "es";
  const cityName: string = location.state?.cityName ?? "Barcelona";
  const postalCode: string = location.state?.postalCode ?? "08001";

  const t = i18n[lang];

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: t.greeting(cityName) },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const data = await queryEvents(text, postalCode);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.respuesta_texto,
          eventos: data.eventos,
        },
      ]);
    } catch (err) {
      console.error("API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Lo siento, ha ocurrido un error al consultar los eventos. Inténtalo de nuevo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-gradient-to-b from-km0-beige-50 to-km0-beige-100">
      <div className="w-full max-w-[390px] max-h-[844px] h-[100dvh] flex flex-col">
      {/* ── Header ──────────────────────────────────────── */}
      <motion.header
        className="flex items-center gap-3 px-4 pt-3 pb-2"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-dashed border-km0-yellow-500 text-km0-yellow-600 hover:bg-km0-yellow-50 transition-all"
          aria-label="Back"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>

        <div className="flex-1 flex items-center gap-3">
          <h1 className="truncate font-brand text-xl font-black leading-tight text-km0-blue-700">
            {cityName}
          </h1>
          <img
            src={lang === "ca" ? xatLogo : chatLogo}
            alt={lang === "ca" ? "KM0 XAT" : "KM0 CHAT"}
            className="h-5 w-auto shrink-0"
          />
        </div>

        

        <NotificationBell hasAlerts={true} />
      </motion.header>

      {/* ── Date banner ─────────────────────────────────── */}
      <div className="bg-km0-yellow-500 text-center py-1.5">
        <span className="font-ui text-sm font-semibold text-km0-blue-800">
          {t.dateLabel()}
        </span>
      </div>

      {/* ── Messages area ───────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
          >
            {msg.role === "assistant" && (
              <img
                src={robotIcon}
                alt="Bot"
                className="w-9 h-9 rounded-full border-2 border-km0-teal-400 object-contain shrink-0 self-start"
              />
            )}

            <div className={`max-w-[75%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`px-4 py-3 rounded-2xl font-body text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card text-card-foreground shadow-sm rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>

              {/* Event cards */}
              {msg.eventos && msg.eventos.length > 0 && (
                <div className="space-y-2 mt-2">
                  {msg.eventos.map((evento, i) => (
                    <EventCard key={evento.id_unico_evento} evento={evento} index={i} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            className="flex items-end gap-2 justify-start"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img
              src={robotIcon}
              alt="Bot"
              className="w-9 h-9 rounded-full border-2 border-km0-teal-400 object-contain shrink-0"
            />
            <div className="bg-card text-card-foreground shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 size={18} className="animate-spin text-accent" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ───────────────────────────────────── */}
      <motion.div
        className="px-3 pb-4 pt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <AnimatePresence mode="wait">
          {isRecording ? (
            <VoiceRecorder
              key="recorder"
              lang={lang}
              onTranscript={(text) => {
                setInput(text);
                setIsRecording(false);
              }}
              onCancel={() => setIsRecording(false)}
            />
          ) : (
            <motion.div
              key="input-bar"
              className="flex items-center gap-2 bg-card rounded-full border border-border px-3 py-2 shadow-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
              />

              <button
                onClick={() => setIsRecording(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
                aria-label="Voice"
              >
                <Mic size={18} />
              </button>

              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
                aria-label="Send"
              >
                <Send size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </div>
    </div>
  );
};

export default Chat;
