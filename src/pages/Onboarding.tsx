import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BrandedFrame from "@/components/BrandedFrame";
import StackCarousel, { type StackCarouselItem } from "@/components/StackCarousel";
import { slides } from "@/data/onboardingSlides";

type Lang = "ca" | "es" | "en";

const getTitle = (slide: typeof slides[0], lang: Lang) =>
  lang === "ca" ? slide.titleCa : lang === "en" ? slide.titleEn : slide.titleEs;

const getDesc = (slide: typeof slides[0], lang: Lang) =>
  lang === "ca" ? slide.descCa : lang === "en" ? slide.descEn : slide.descEs;

// Adapta cada slide al shape genérico de StackCarousel
type OnboardingSlide = typeof slides[0] & StackCarouselItem;
const items: OnboardingSlide[] = slides.map((s) => ({ ...s, thumb: s.emoji }));

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lang: Lang = (location.state?.lang as Lang) ?? "es";

  const [current, setCurrent] = useState(0);
  const isLast = current === items.length - 1;

  const skipLabel = lang === "ca" ? "SALTAR" : lang === "en" ? "SKIP" : "SALTAR";
  const finishLabel = lang === "ca" ? "INICI" : lang === "en" ? "START" : "INICIO";

  return (
    <BrandedFrame onBack={() => navigate("/")} backAriaLabel="Back">
      <StackCarousel
        items={items}
        index={current}
        onIndexChange={setCurrent}
        skipLabel={skipLabel}
        finishLabel={finishLabel}
        onFinish={() => navigate("/postal-code", { state: { lang } })}
        renderSlideContent={(s, { isActive }) => (
          <OnboardingCard slide={s} isActive={isActive} lang={lang} />
        )}
      />
    </BrandedFrame>
  );
};

/** Card específica del onboarding — vive aquí porque es contenido de dominio. */
const OnboardingCard = ({
  slide,
  isActive,
  lang,
}: {
  slide: OnboardingSlide;
  isActive: boolean;
  lang: Lang;
}) => (
  <div className="flex flex-col h-full max-h-full">
    {/* Image area */}
    <div
      className="relative mx-3 mt-3 vertical-mobile:mx-2 vertical-mobile:mt-2 wide-landscape:mx-3 wide-landscape:mt-3 short-landscape:mx-2 short-landscape:mt-2 shrink-0 h-[clamp(110px,22vh,180px)] vertical-tablet:h-[200px] wide-landscape:h-[clamp(180px,38vh,300px)] short-landscape:h-[clamp(80px,22vh,140px)] rounded-2xl flex items-center justify-center overflow-hidden"
      style={{ background: slide.color }}
    >
      <span className="text-[clamp(48px,12vh,90px)] vertical-tablet:text-[80px] wide-landscape:text-[clamp(72px,14vh,120px)] short-landscape:text-[clamp(40px,11vh,72px)] select-none">
        {slide.emoji}
      </span>
      {isActive && (
        <span className="absolute top-2 right-2 vertical-mobile:top-1.5 vertical-mobile:right-1.5 short-landscape:top-1 short-landscape:right-1 bg-km0-coral-400 text-white font-ui font-bold text-xs vertical-tablet:text-sm wide-landscape:text-sm short-landscape:text-[10px] px-2 vertical-tablet:px-3 py-0.5 vertical-tablet:py-1 short-landscape:px-1.5 rounded-xl shadow-md">
          +{slide.xp} XP
        </span>
      )}
    </div>
    {/* Text */}
    <div className="px-3 pt-2 pb-3 vertical-tablet:px-4 vertical-tablet:pt-3 vertical-tablet:pb-4 wide-landscape:px-6 wide-landscape:pt-4 wide-landscape:pb-5 short-landscape:px-3 short-landscape:pt-1.5 short-landscape:pb-2 text-center flex-1 min-h-0 overflow-hidden flex flex-col justify-start">
      <h2 className="font-brand font-bold text-base vertical-tablet:text-lg wide-landscape:text-xl short-landscape:text-[clamp(11px,2vh,15px)] text-primary leading-tight mb-1 wide-landscape:mb-2 short-landscape:mb-0.5">
        {getTitle(slide, lang)}
      </h2>
      <p className="font-body text-xs vertical-tablet:text-sm wide-landscape:text-sm short-landscape:text-[clamp(9px,1.5vh,12px)] text-muted-foreground leading-snug">
        {getDesc(slide, lang)}
      </p>
    </div>
  </div>

);

export default Onboarding;
