import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, MapPin, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Km0Logo from "@/components/Km0Logo";
import cityMap from "@/assets/km0_city_map.png";

type Lang = "ca" | "es" | "en";

const i18n = {
  ca: {
    title: "INTRODUEIX EL TEU CODI POSTAL",
    subtitle: "Descobreix comerços i serveis al teu barri",
    placeholder: "08001",
    error: "Només es permeten números",
    notFound: "No es reconeix aquest codi postal",
    cta: "CONTINUAR",
  },
  es: {
    title: "INTRODUCE TU CÓDIGO POSTAL",
    subtitle: "Descubre comercios y servicios en tu barrio",
    placeholder: "08001",
    error: "Solo se permiten números",
    notFound: "No se reconoce este código postal",
    cta: "CONTINUAR",
  },
  en: {
    title: "ENTER YOUR POSTAL CODE",
    subtitle: "Discover shops and services in your neighborhood",
    placeholder: "08001",
    error: "Only numbers are allowed",
    notFound: "This postal code is not recognized",
    cta: "CONTINUE",
  },
};

const postalCodes: Record<string, string> = {
  "08001": "Barcelona",
  "08380": "Malgrat de Mar",
  "08301": "Mataró",
  "08400": "Granollers",
  "08201": "Sabadell",
  "08221": "Terrassa",
  "08800": "Vilanova i la Geltrú",
  "08850": "Gavà",
  "08901": "L'Hospitalet de Llobregat",
  "08940": "Cornellà de Llobregat",
};

const PostalCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lang: Lang = (location.state?.lang as Lang) ?? "es";
  const t = i18n[lang];

  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<"idle" | "found" | "not_found">("idle");

  const isNumeric = /^\d*$/.test(value);
  const isComplete = value.length === 5 && isNumeric;
  const cityName = validationResult === "found" ? postalCodes[value] ?? null : null;
  const showError = touched && !isNumeric;
  const showNotFound = validationResult === "not_found";

  // Simulate validation when 5 digits are entered
  useEffect(() => {
    if (isComplete) {
      setIsValidating(true);
      setValidationResult("idle");
      const timer = setTimeout(() => {
        setIsValidating(false);
        setValidationResult(postalCodes[value] ? "found" : "not_found");
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setIsValidating(false);
      setValidationResult("idle");
    }
  }, [value, isComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (!touched) setTouched(true);
  };

  const handleSubmit = () => {
    if (!isComplete || !cityName) return;
    navigate("/chat", { state: { lang, cityName, postalCode: value } });
  };

  return (
    <motion.div
      className="min-h-[100dvh] w-full flex items-start landscape:items-center justify-center bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 px-4 pt-3 pb-6 landscape:p-4 short-landscape:p-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* ── PORTRAIT (375×667 / 768×1024) ─────────────────── */}
      <div className="w-full max-w-[390px] sm:max-w-[460px] flex flex-col gap-6 landscape:hidden">

        {/* Header */}
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

        {/* City illustration */}
        <motion.div
          className="rounded-3xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <img src={cityMap} alt="Isometric city map" className="w-full h-auto object-cover" />
        </motion.div>

        {/* Title / City name */}
        <motion.div
          className="text-center px-2 h-[52px] flex items-center justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          {cityName ? (
            <motion.div key="city" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
              <h1 className="font-brand font-medium text-3xl text-km0-teal-600 leading-tight">📍 {cityName}</h1>
            </motion.div>
          ) : (
            <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
              <h1 className="font-brand font-bold text-2xl text-primary leading-tight mb-1">{t.title}</h1>
              <p className="font-body text-sm text-muted-foreground">{t.subtitle}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Input */}
        <motion.div
          className="flex flex-col gap-2 px-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 bg-white rounded-2xl border border-km0-beige-200 px-4 py-3.5 shadow-sm focus-within:border-km0-teal-400 transition-colors">
            <MapPin className="text-km0-teal-500 shrink-0" size={22} />
            <input
              type="text" inputMode="numeric" pattern="[0-9]*" maxLength={5}
              placeholder={t.placeholder} value={value} onChange={handleChange}
              className="flex-1 bg-transparent font-ui text-lg text-foreground placeholder:text-muted-foreground/50 outline-none"
            />
          </div>
          {showError && (
            <div className="flex items-center gap-1.5 text-destructive font-ui text-sm px-1">
              <AlertTriangle size={14} /><span>{t.error}</span>
            </div>
          )}
          <AnimatePresence>
            {showNotFound && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex items-center gap-1.5 text-destructive font-ui text-sm px-1">
                <AlertTriangle size={14} /><span>{t.notFound}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div className="px-2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
          <button
            onClick={handleSubmit}
            disabled={!cityName || isValidating}
            className="w-full bg-primary text-primary-foreground font-ui font-semibold text-sm px-5 py-2.5 rounded-2xl hover:bg-km0-blue-600 hover:scale-[1.03] transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isValidating ? <Loader2 size={18} className="animate-spin" /> : t.cta}
          </button>
        </motion.div>
      </div>

      {/* ── LANDSCAPE 16:9 (667×375 / 1280×550) ──────────── */}
      <div className="hidden landscape:flex w-full max-w-[1200px] h-full max-h-[min(95dvh,calc(100vw*9/16))] aspect-video bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden flex-col relative">

        {/* Header */}
        <header className="relative flex items-center justify-center pt-3 pb-2 wide-landscape:pt-3 wide-landscape:pb-2 short-landscape:pt-2 short-landscape:pb-1 shrink-0 px-5">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-3 wide-landscape:left-4 short-landscape:left-3 top-1/2 -translate-y-1/2 w-9 h-9 short-landscape:w-8 short-landscape:h-8 flex items-center justify-center rounded-xl border-[2px] border-dashed border-km0-yellow-500 text-km0-yellow-600 hover:bg-km0-yellow-50 transition-all duration-200 hover:scale-105"
            aria-label="Back"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <Km0Logo className="h-11 wide-landscape:h-12 short-landscape:h-8 w-auto" />
        </header>

        {/* Body: image left + form right */}
        <div className="flex-1 min-h-0 flex items-stretch gap-4 wide-landscape:gap-8 short-landscape:gap-3 px-4 wide-landscape:px-8 short-landscape:px-3 pb-3 wide-landscape:pb-5 short-landscape:pb-2">

          {/* Left: city image */}
          <motion.div
            className="basis-[42%] shrink-0 min-w-0 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center bg-km0-beige-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
          >
            <img src={cityMap} alt="Isometric city map" className="w-full h-full object-cover" />
          </motion.div>

          {/* Right: title + input + CTA */}
          <motion.div
            className="flex-1 min-w-0 flex flex-col justify-center gap-3 wide-landscape:gap-5 short-landscape:gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            {/* Title / City name */}
            <div className="text-center min-h-[44px] wide-landscape:min-h-[60px] short-landscape:min-h-[36px] flex items-center justify-center">
              {cityName ? (
                <motion.div key="city-ls" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
                  <h1 className="font-brand font-medium text-xl wide-landscape:text-3xl short-landscape:text-lg text-km0-teal-600 leading-tight">
                    📍 {cityName}
                  </h1>
                </motion.div>
              ) : (
                <motion.div key="default-ls" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                  <h1 className="font-brand font-bold text-base wide-landscape:text-2xl short-landscape:text-sm text-primary leading-tight mb-0.5 wide-landscape:mb-1">
                    {t.title}
                  </h1>
                  <p className="font-body text-xs wide-landscape:text-sm short-landscape:text-[11px] text-muted-foreground leading-snug">
                    {t.subtitle}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 wide-landscape:gap-3 bg-white rounded-2xl border border-km0-beige-200 px-3 wide-landscape:px-4 py-2.5 wide-landscape:py-3.5 short-landscape:py-2 shadow-sm focus-within:border-km0-teal-400 transition-colors">
                <MapPin className="text-km0-teal-500 shrink-0" size={20} />
                <input
                  type="text" inputMode="numeric" pattern="[0-9]*" maxLength={5}
                  placeholder={t.placeholder} value={value} onChange={handleChange}
                  className="flex-1 min-w-0 bg-transparent font-ui text-base wide-landscape:text-lg short-landscape:text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                />
              </div>
              {showError && (
                <div className="flex items-center gap-1.5 text-destructive font-ui text-xs px-1">
                  <AlertTriangle size={12} /><span>{t.error}</span>
                </div>
              )}
              <AnimatePresence>
                {showNotFound && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex items-center gap-1.5 text-destructive font-ui text-xs px-1">
                    <AlertTriangle size={12} /><span>{t.notFound}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA */}
            <button
              onClick={handleSubmit}
              disabled={!cityName || isValidating}
              className="w-full bg-primary text-primary-foreground font-ui font-semibold text-sm wide-landscape:text-base short-landscape:text-xs px-5 py-2.5 wide-landscape:py-3 short-landscape:py-2 rounded-2xl hover:bg-km0-blue-600 hover:scale-[1.02] transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isValidating ? <Loader2 size={18} className="animate-spin" /> : t.cta}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostalCode;
