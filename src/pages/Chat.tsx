import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Mic, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Km0Logo from "@/components/Km0Logo";
import NotificationBell from "@/components/NotificationBell";
import NotificationsOverlay from "@/components/NotificationsOverlay";
import { useNotifications } from "@/hooks/useNotifications";
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
  const messagesEndRefP = useRef<HTMLDivElement>(null);
  const messagesEndRefL = useRef<HTMLDivElement>(null);
  const { notifications, hasUnread, markRead } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    messagesEndRefP.current?.scrollIntoView({ behavior: "smooth" });
    messagesEndRefL.current?.scrollIntoView({ behavior: "smooth" });
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

  /* ── Reusable: Chat header content (used in both layouts) ── */
  const HeaderContent = ({ compact = false }: { compact?: boolean }) => (
    <>
      <button
        onClick={() => navigate(-1)}
        className={`${compact ? "w-9 h-9" : "w-10 h-10"} flex items-center justify-center rounded-xl border-2 border-dashed border-km0-yellow-500 text-km0-yellow-600 hover:bg-km0-yellow-50 transition-all shrink-0`}
        aria-label="Back"
      >
        <ChevronLeft size={compact ? 18 : 20} strokeWidth={2.5} />
      </button>

      <div className="flex-1 flex items-center justify-center min-w-0">
        <div className="flex-col landscape:flex-row landscape:gap-3 wide-landscape:gap-4 gap-1 min-w-0 flex items-start justify-start">
          <h1 className="font-brand text-lg tablet-portrait:text-2xl landscape:text-2xl short-landscape:text-base font-black leading-tight text-km0-blue-700 text-center truncate max-w-full">
            {cityName}
          </h1>
          <img
            src={lang === "ca" ? xatLogo : chatLogo}
            alt={lang === "ca" ? "KM0 XAT" : "KM0 CHAT"}
            className="h-6 tablet-portrait:h-9 landscape:h-9 short-landscape:h-5 w-auto shrink-0"
          />
        </div>
      </div>

      <NotificationBell
        hasAlerts={hasUnread}
        onClick={() => setNotifOpen(true)}
        ariaLabel={hasUnread ? "Tienes notificaciones nuevas" : "Sin notificaciones"}
      />
    </>
  );

  /* ── Reusable: Input bar (used in both layouts) ── */
  const InputBar = ({ compact = false }: { compact?: boolean }) => (
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
          className={`flex items-center gap-2 bg-card rounded-full border border-border ${compact ? "px-3 py-1.5" : "px-3 py-2"} shadow-sm`}
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
            className="flex-1 min-w-0 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
          />

          <button
            onClick={() => setIsRecording(true)}
            className={`${compact ? "w-8 h-8" : "w-10 h-10"} flex items-center justify-center rounded-full bg-accent text-accent-foreground hover:opacity-90 transition-opacity shrink-0`}
            aria-label="Voice"
          >
            <Mic size={compact ? 16 : 18} />
          </button>

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`${compact ? "w-8 h-8" : "w-10 h-10"} flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0`}
            aria-label="Send"
          >
            <Send size={compact ? 16 : 18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* ── Reusable: Messages list ── */
  const MessagesList = ({ endRef }: { endRef: React.RefObject<HTMLDivElement> }) => (
    <>
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

      <div ref={endRef} />
    </>
  );

  return (
    <div className="fixed inset-0 w-full flex justify-center items-stretch landscape:items-center bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 landscape:p-4 short-landscape:p-2">
      {/* ── PORTRAIT (375×667 / 768×1024) ─────────────────── */}
      <div className="relative w-full max-w-[390px] h-full flex flex-col overflow-hidden landscape:hidden">
        {/* Header */}
        <motion.header
          className="flex items-center gap-3 px-4 pt-3 pb-2"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HeaderContent />
        </motion.header>

        {/* Date banner */}
        <div className="bg-km0-yellow-500 text-center py-1.5">
          <span className="font-ui text-sm font-semibold text-km0-blue-800">
            AGENDA · {t.dateLabel()}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <MessagesList endRef={messagesEndRefP} />
        </div>

        {/* Input */}
        <motion.div
          className="px-3 pb-4 pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <InputBar />
        </motion.div>

        <NotificationsOverlay
          open={notifOpen}
          notifications={notifications}
          onClose={() => setNotifOpen(false)}
          onMarkRead={markRead}
        />
      </div>

      {/* ── LANDSCAPE 16:9 (667×375 / 1280×550) ──────────── */}
      <div className="hidden landscape:flex w-full max-w-[1200px] h-full max-h-[min(95dvh,calc(100vw*9/16))] aspect-video bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden flex-col relative">

        {/* Header — full width edge-to-edge */}
        <motion.header
          className="flex items-center gap-3 px-4 wide-landscape:px-6 short-landscape:px-3 pt-3 pb-2 wide-landscape:pt-4 wide-landscape:pb-3 short-landscape:pt-2 short-landscape:pb-1.5 shrink-0 border-b border-km0-beige-200"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HeaderContent compact />
        </motion.header>

        {/* Date banner — full width edge-to-edge */}
        <div className="bg-km0-yellow-500 text-center py-1 wide-landscape:py-1.5 short-landscape:py-0.5 shrink-0">
          <span className="font-ui text-xs wide-landscape:text-sm short-landscape:text-[11px] font-semibold text-km0-blue-800">
            AGENDA · {t.dateLabel()}
          </span>
        </div>

        {/* Messages — scrollable, centered max width */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 wide-landscape:px-8 short-landscape:px-3 py-3 wide-landscape:py-4 short-landscape:py-2">
          <div className="max-w-[720px] mx-auto space-y-3 wide-landscape:space-y-4">
            <MessagesList endRef={messagesEndRefL} />
          </div>
        </div>

        {/* Input — centered max width */}
        <motion.div
          className="px-4 wide-landscape:px-8 short-landscape:px-3 pb-3 wide-landscape:pb-4 short-landscape:pb-2 pt-2 shrink-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div className="max-w-[720px] mx-auto">
            <InputBar compact />
          </div>
        </motion.div>

        <NotificationsOverlay
          open={notifOpen}
          notifications={notifications}
          onClose={() => setNotifOpen(false)}
          onMarkRead={markRead}
        />
      </div>
    </div>
  );
};

export default Chat;
