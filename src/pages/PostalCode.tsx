import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, MapPin, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import Km0Logo from "@/components/Km0Logo";
import cityMap from "@/assets/km0_city_map.png";

type Lang = "ca" | "es" | "en";

const i18n = {
  ca: {
    title: "INTRODUEIX EL TEU CODI POSTAL",
    subtitle: "Descobreix comerços i serveis al teu barri",
    placeholder: "08001",
    error: "Només es permeten números",
    cta: "CONTINUAR",
  },
  es: {
    title: "INTRODUCE TU CÓDIGO POSTAL",
    subtitle: "Descubre comercios y servicios en tu barrio",
    placeholder: "08001",
    error: "Solo se permiten números",
    cta: "CONTINUAR",
  },
  en: {
    title: "ENTER YOUR POSTAL CODE",
    subtitle: "Discover shops and services in your neighborhood",
    placeholder: "08001",
    error: "Only numbers are allowed",
    cta: "CONTINUE",
  },
};

const PostalCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lang: Lang = (location.state?.lang as Lang) ?? "es";
  const t = i18n[lang];

  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const isValid = /^\d*$/.test(value);
  const showError = touched && !isValid;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (!touched) setTouched(true);
  };

  const handleSubmit = () => {
    if (!value || !isValid) {
      setTouched(true);
      return;
    }
    // Navigate forward with postal code + lang
    navigate("/", { state: { lang, postalCode: value } });
  };

  return (
    <motion.div
      className="min-h-screen w-full flex items-start justify-center bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 px-4 pt-3 pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="w-full max-w-[390px] flex flex-col gap-6">

        {/* ── Header ──────────────────────────────────────── */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 flex items-center justify-center rounded-xl border-[2px] border-dashed border-km0-yellow-500 text-km0-yellow-600 hover:bg-km0-yellow-50 transition-all duration-200 hover:scale-105"
            aria-label="Back"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <Km0Logo className="h-9 w-auto" />
          <div className="w-11" />
        </motion.div>

        {/* ── City illustration ───────────────────────────── */}
        <motion.div
          className="rounded-3xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <img
            src={cityMap}
            alt="Isometric city map"
            className="w-full h-auto object-cover"
          />
        </motion.div>

        {/* ── Title + subtitle ────────────────────────────── */}
        <motion.div
          className="text-center px-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <h1 className="font-brand font-bold text-2xl text-primary leading-tight mb-1">
            {t.title}
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            {t.subtitle}
          </p>
        </motion.div>

        {/* ── Input ───────────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-2 px-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 bg-white rounded-2xl border border-km0-beige-200 px-4 py-3.5 shadow-sm focus-within:border-km0-teal-400 transition-colors">
            <MapPin className="text-km0-teal-500 shrink-0" size={22} />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              placeholder={t.placeholder}
              value={value}
              onChange={handleChange}
              className="flex-1 bg-transparent font-ui text-lg text-foreground placeholder:text-muted-foreground/50 outline-none"
            />
          </div>

          {showError && (
            <div className="flex items-center gap-1.5 text-destructive font-ui text-sm px-1">
              <AlertTriangle size={14} />
              <span>{t.error}</span>
            </div>
          )}
        </motion.div>

        {/* ── CTA button ─────────────────────────────────── */}
        <motion.div
          className="px-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-primary-foreground font-brand font-bold text-lg py-4 rounded-full hover:bg-km0-blue-600 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg"
          >
            {t.cta}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PostalCode;
