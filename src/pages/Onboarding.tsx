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
  <>
    {/* Image area */}
    <div
      className="relative mx-3 mt-3 wide-landscape:mx-3 wide-landscape:mt-3 h-[180px] landscape:h-[200px] wide-landscape:h-[300px] short-landscape:mx-[clamp(0.5rem,1.2vw,0.75rem)] short-landscape:mt-[clamp(0.5rem,1.2vw,0.75rem)] short-landscape:h-[clamp(120px,32vh,260px)] rounded-2xl flex items-center justify-center overflow-hidden"
      style={{ background: slide.color }}
    >
      <span className="text-[70px] landscape:text-[80px] wide-landscape:text-[120px] short-landscape:text-[clamp(52px,10vh,96px)] select-none">
        {slide.emoji}
      </span>
      {isActive && (
        <span className="absolute top-3 right-3 short-landscape:top-1.5 short-landscape:right-1.5 bg-km0-coral-400 text-white font-ui font-bold text-sm short-landscape:text-[clamp(10px,1.4vh,14px)] px-3 py-1 short-landscape:px-2 short-landscape:py-0.5 rounded-xl shadow-md">
          +{slide.xp} XP
        </span>
      )}
    </div>
    {/* Text */}
    <div className="px-4 pt-3 pb-4 wide-landscape:px-6 wide-landscape:pt-5 wide-landscape:pb-6 short-landscape:px-[clamp(0.75rem,1.6vw,1.25rem)] short-landscape:pt-[clamp(0.5rem,1.2vh,1rem)] short-landscape:pb-[clamp(0.75rem,1.6vh,1.25rem)] text-center">
      <h2 className="font-brand font-bold text-lg wide-landscape:text-2xl short-landscape:text-[clamp(0.875rem,2.2vh,1.25rem)] text-primary leading-tight mb-1 wide-landscape:mb-2 short-landscape:mb-[clamp(0.125rem,0.6vh,0.5rem)]">
        {getTitle(slide, lang)}
      </h2>
      <p className="font-body text-sm wide-landscape:text-base short-landscape:text-[clamp(0.6875rem,1.6vh,0.9375rem)] text-muted-foreground leading-relaxed wide-landscape:leading-snug short-landscape:leading-snug">
        {getDesc(slide, lang)}
      </p>
    </div>
  </>
);

export default Onboarding;
