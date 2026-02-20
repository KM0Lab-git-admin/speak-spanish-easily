import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lang: Lang = (location.state?.lang as Lang) ?? "es";

  const [current, setCurrent] = useState(0);
  const total = slides.length;
  const isFirst = current === 0;
  const isLast = current === total - 1;

  const prev = () => { if (!isFirst) setCurrent((c) => c - 1); };
  const next = () => { if (!isLast) setCurrent((c) => c + 1); };
  const goTo = (i: number) => setCurrent(i);

  const skipLabel = isLast
    ? lang === "ca" ? "INICI" : lang === "en" ? "START" : "INICIO"
    : lang === "ca" ? "SALTAR" : lang === "en" ? "SKIP" : "SALTAR";

  const slide = slides[current];

  return (
    <div className="min-h-screen w-full flex justify-center bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 px-4 pt-10 pb-6">
      <div className="w-full max-w-[390px] flex flex-col gap-5 h-fit">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="w-11 h-11 flex items-center justify-center rounded-xl border-[2px] border-dashed border-km0-yellow-500 text-km0-yellow-600 hover:bg-km0-yellow-50 transition-all duration-200 hover:scale-105"
            aria-label="Back"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <Km0Logo className="h-9 w-auto" />
          <div className="w-11" /> {/* spacer */}
        </div>

        {/* ── Carousel area ──────────────────────────────────── */}
        <div className="relative flex items-center justify-center h-[380px]">

          {/* Peek prev */}
          {!isFirst && (
            <div
              className="absolute left-0 w-[72px] h-[320px] rounded-2xl overflow-hidden opacity-60 scale-90 origin-right cursor-pointer top-[30px]"
              style={{ background: slides[current - 1].color }}
              onClick={prev}
            >
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {slides[current - 1].emoji}
              </div>
            </div>
          )}

          {/* Peek next */}
          {!isLast && (
            <div
              className="absolute right-0 w-[72px] h-[320px] rounded-2xl overflow-hidden opacity-60 scale-90 origin-left cursor-pointer top-[30px]"
              style={{ background: slides[current + 1].color }}
              onClick={next}
            >
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {slides[current + 1].emoji}
              </div>
            </div>
          )}

          {/* Arrow left — fixed at center of image area (12px top + 220px/2 = 122px, minus half button = 100px from top of container) */}
          <button
            onClick={prev}
            disabled={isFirst}
            className={cn(
              "absolute left-[52px] top-[112px] w-11 h-11 rounded-full bg-white border-[2px] flex items-center justify-center shadow-lg transition-all duration-200 z-20",
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
            disabled={isLast}
            className={cn(
              "absolute right-[52px] top-[112px] w-11 h-11 rounded-full bg-white border-[2px] flex items-center justify-center shadow-lg transition-all duration-200 z-20",
              isLast
                ? "border-km0-beige-200 text-km0-beige-300 opacity-40 cursor-not-allowed"
                : "border-km0-yellow-400 text-km0-blue-700 hover:bg-km0-yellow-50 hover:scale-110 cursor-pointer"
            )}
            aria-label="Next"
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>

          {/* Main card */}
          <div className="relative w-[260px] bg-white rounded-3xl shadow-2xl overflow-visible z-10 transition-all duration-300">

            {/* Image area */}
            <div
              className="relative rounded-2xl mx-3 mt-3 h-[220px] flex items-center justify-center overflow-hidden"
              style={{ background: slide.color }}
            >
              <span className="text-[90px] select-none">{slide.emoji}</span>

              {/* XP badge */}
              <span className="absolute top-3 right-3 bg-km0-coral-400 text-white font-ui font-bold text-sm px-3 py-1 rounded-xl shadow-md">
                +{slide.xp} XP
              </span>
            </div>

            {/* Text */}
            <div className="px-5 pt-4 pb-6 text-center">
              <h2 className="font-brand font-bold text-xl text-primary leading-tight mb-2">
                {getTitle(slide, lang)}
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {getDesc(slide, lang)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Thumbnails ─────────────────────────────────────── */}
        <div className="flex justify-center gap-2">
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
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-1">

          {/* Counter */}
          <span className="font-ui font-bold text-lg text-primary w-12">
            {current + 1}/{total}
          </span>

          {/* Dots */}
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

          {/* Skip / Start button */}
          <button
            onClick={() => {
              if (isLast) navigate("/");
              else setCurrent(total - 1);
            }}
            className="bg-primary text-primary-foreground font-ui font-semibold text-sm px-5 py-2.5 rounded-2xl hover:bg-km0-blue-600 hover:scale-[1.03] transition-all duration-200 active:scale-95"
          >
            {skipLabel}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Onboarding;
