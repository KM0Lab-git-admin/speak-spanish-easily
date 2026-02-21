import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Km0Logo from "@/components/Km0Logo";
import { slides } from "@/data/onboardingSlides";
import { cn } from "@/lib/utils";

type Lang = "ca" | "es" | "en";

const getTitle = (slide: typeof slides[0], lang: Lang) => {
  if (lang === "ca") return slide.titleCa;
  if (lang === "en") return slide.titleEn;
  return slide.titleEs;
};

const getDesc = (slide: typeof slides[0], lang: Lang) => {
  if (lang === "ca") return slide.descCa;
  if (lang === "en") return slide.descEn;
  return slide.descEs;
};

const SLOT = 270;
const CONTAINER = 390;

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lang: Lang = (location.state?.lang as Lang) ?? "es";

  const [current, setCurrent] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const total = slides.length;
  const isFirst = current === 0;
  const isLast = current === total - 1;

  const prev = () => { if (!isFirst) setCurrent((c) => c - 1); };
  const next = () => { if (!isLast) setCurrent((c) => c + 1); };
  const goTo = (i: number) => setCurrent(i);

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (touchStartX.current === null) return;
    setDragOffset(e.clientX - touchStartX.current);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.clientX;
    touchStartX.current = null;
    setDragOffset(0);
    if (Math.abs(delta) > 40) {
      if (delta > 0) next();
      else prev();
    }
  };

  const skipLabel = isLast
    ? lang === "ca" ? "INICI" : lang === "en" ? "START" : "INICIO"
    : lang === "ca" ? "SALTAR" : lang === "en" ? "SKIP" : "SALTAR";

  const trackX = CONTAINER / 2 - current * SLOT - SLOT / 2;

  return (
    <motion.div
      className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="w-full max-w-[390px] flex flex-col gap-5 h-[620px] overflow-hidden">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <button
            onClick={() => navigate("/")}
            className="w-11 h-11 flex items-center justify-center rounded-xl border-[2px] border-dashed border-km0-yellow-500 text-km0-yellow-600 hover:bg-km0-yellow-50 transition-all duration-200 hover:scale-105"
            aria-label="Back"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <Km0Logo className="h-9 w-auto" />
          <div className="w-11" />
        </motion.div>

        {/* ── Carousel ───────────────────────────────────────── */}
        <motion.div
          className="relative h-[410px] overflow-hidden select-none cursor-grab active:cursor-grabbing"
          style={{ marginInline: "-16px", paddingInline: "16px", touchAction: "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          {/* Sliding track */}
          <div
            className="absolute top-0 flex items-start"
            style={{
              transform: `translateX(${trackX + dragOffset}px)`,
              transition: dragOffset !== 0 ? "none" : "transform 420ms cubic-bezier(0.4, 0, 0.2, 1)",
              width: `${total * SLOT}px`,
            }}
          >
            {slides.map((s, i) => {
              const dist = Math.abs(i - current);
              const isActive = i === current;
              const scale = isActive ? 1 : dist === 1 ? 0.82 : 0.68;
              const opacity = isActive ? 1 : dist === 1 ? 0.65 : 0.35;
              const topOffset = isActive ? 0 : dist === 1 ? 28 : 48;

              return (
                <div
                  key={s.id}
                  onClick={() => !isActive && goTo(i)}
                  style={{
                    width: `${SLOT}px`,
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    transform: `scale(${scale}) translateY(${topOffset}px)`,
                    opacity,
                    transition: "transform 420ms cubic-bezier(0.4,0,0.2,1), opacity 420ms ease",
                    transformOrigin: "top center",
                    cursor: isActive ? "default" : "pointer",
                    zIndex: isActive ? 10 : 1,
                    position: "relative",
                  }}
                >
                  {/* Stack layers — only on active card */}
                  {isActive && (<>
                    <div style={{
                      position: "absolute", bottom: -10, left: 22, right: 22,
                      height: 28, background: "rgba(255,255,255,0.55)",
                      borderRadius: 20, zIndex: -1,
                      boxShadow: "0 8px 24px -4px rgba(0,0,0,0.10)",
                    }} />
                    <div style={{
                      position: "absolute", bottom: -18, left: 38, right: 38,
                      height: 28, background: "rgba(255,255,255,0.30)",
                      borderRadius: 20, zIndex: -2,
                      boxShadow: "0 8px 24px -4px rgba(0,0,0,0.06)",
                    }} />
                  </>)}
                  <div className={`bg-white rounded-3xl overflow-hidden ${isActive ? "shadow-2xl" : "shadow-none"}`}>

                    {/* Image area */}
                    <div
                      className="relative mx-3 mt-3 h-[220px] rounded-2xl flex items-center justify-center overflow-hidden"
                      style={{ background: s.color }}
                    >
                      <span className="text-[90px] select-none">{s.emoji}</span>
                      {isActive && (
                        <span className="absolute top-3 right-3 bg-km0-coral-400 text-white font-ui font-bold text-sm px-3 py-1 rounded-xl shadow-md">
                          +{s.xp} XP
                        </span>
                      )}
                    </div>

                    {/* Text */}
                    <div className="px-5 pt-4 pb-6 text-center">
                      <h2 className="font-brand font-bold text-xl text-primary leading-tight mb-2">
                        {getTitle(s, lang)}
                      </h2>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        {getDesc(s, lang)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Arrow left */}
          <button
            onClick={prev}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={isFirst}
            className={cn(
              "absolute left-[14px] top-[112px] w-11 h-11 rounded-full bg-white border-[2px] flex items-center justify-center shadow-lg transition-all duration-200 z-20",
              isFirst
                ? "border-km0-beige-200 text-km0-beige-300 opacity-40 cursor-not-allowed"
                : "border-km0-yellow-400 text-km0-blue-700 hover:bg-km0-yellow-50 hover:scale-110 cursor-pointer"
            )}
            aria-label="Previous"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          {/* Arrow right */}
          <button
            onClick={next}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={isLast}
            className={cn(
              "absolute right-[14px] top-[112px] w-11 h-11 rounded-full bg-white border-[2px] flex items-center justify-center shadow-lg transition-all duration-200 z-20",
              isLast
                ? "border-km0-beige-200 text-km0-beige-300 opacity-40 cursor-not-allowed"
                : "border-km0-yellow-400 text-km0-blue-700 hover:bg-km0-yellow-50 hover:scale-110 cursor-pointer"
            )}
            aria-label="Next"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </motion.div>

        {/* ── Thumbnails ─────────────────────────────────────── */}
        <motion.div
          className="flex justify-center gap-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 border-[2px]",
                i === current
                  ? "border-km0-yellow-500 scale-110 shadow-md"
                  : "border-km0-beige-200 bg-white opacity-70 hover:opacity-100 hover:scale-105"
              )}
              style={{ background: i === current ? s.color : "white" }}
              aria-label={`Slide ${i + 1}`}
            >
              {s.emoji}
            </button>
          ))}
        </motion.div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <motion.div
          className="flex items-center justify-between px-1"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <span className="font-ui font-bold text-lg text-primary w-12">
            {current + 1}/{total}
          </span>

          <div className="flex gap-2 items-center">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === current
                    ? "w-4 h-4 bg-km0-yellow-500"
                    : "w-2.5 h-2.5 bg-km0-blue-200"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              if (isLast) navigate("/");
              else setCurrent(total - 1);
            }}
            className="bg-primary text-primary-foreground font-ui font-semibold text-sm px-5 py-2.5 rounded-2xl hover:bg-km0-blue-600 hover:scale-[1.03] transition-all duration-200 active:scale-95"
          >
            {skipLabel}
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Onboarding;
