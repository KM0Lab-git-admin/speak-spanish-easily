import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageCard from "@/components/LanguageCard";
import FloatingDots from "@/components/FloatingDots";
import Km0Logo from "@/components/Km0Logo";
import robotPlaceholder from "@/assets/km0_robot_icon_v2.png";
import flagCa from "@/assets/flags/flag-ca.svg";
import flagEs from "@/assets/flags/flag-es.svg";
import flagEn from "@/assets/flags/flag-en.svg";

const languages: {id: string; flag: string; flagIsImage?: boolean; name: string; description: string; disabled?: boolean;}[] = [
  {
    id: "ca",
    flag: flagCa,
    flagIsImage: true,
    name: "Català",
    description: "Comença en català"
  },
  {
    id: "es",
    flag: flagEs,
    flagIsImage: true,
    name: "Español",
    description: "Empieza en español"
  },
  {
    id: "en",
    flag: flagEn,
    flagIsImage: true,
    name: "English",
    description: "Start in English",
    disabled: true
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    setTimeout(() => navigate("/onboarding", { state: { lang: id } }), 300);
  };

  return (
    <div className="min-h-screen w-full flex items-start landscape:items-center justify-center bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 px-4 pt-3 pb-4 landscape:p-4 short-landscape:p-2">
      {/* ── Portrait wrapper (mobile original) ──────────────── */}
      <div className="w-full max-w-[390px] flex flex-col gap-5 landscape:hidden">
        {/* Logo */}
        <div className="flex items-center justify-between h-11">
          <div className="w-11" />
          <Km0Logo className="h-9 w-auto" />
          <div className="w-11" />
        </div>

        {/* Ilustración (robot dentro del anillo turquesa) */}
        <div className="flex justify-center">
          <div className="relative w-[230px] h-[230px] flex items-center justify-center">
            <FloatingDots />
            <div className="relative w-[200px] h-[200px] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-km0-teal-400/25 border-2 border-km0-blue-700" />
              <div className="absolute inset-[14%] rounded-full bg-km0-teal-500/90" />
              <img
                src={robotPlaceholder}
                alt="KM0 LAB mascot"
                className="relative z-10 h-[70%] w-auto object-contain animate-float drop-shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Microtítulo */}
        <h2 className="text-center font-ui font-semibold text-base text-km0-blue-700 -mt-1">
          Escoge tu idioma
        </h2>

        {/* Tarjetas */}
        <div className="flex flex-col gap-3">
          {languages.map((lang, i) => (
            <LanguageCard
              key={lang.id}
              flag={lang.flag}
              flagIsImage={lang.flagIsImage}
              name={lang.name}
              description={lang.description}
              selected={selected === lang.id}
              disabled={lang.disabled}
              onClick={() => handleSelect(lang.id)}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* ── Landscape wrapper (16:9 card) ──────────────────── */}
      <div className="hidden landscape:flex w-full max-w-[1100px] h-full max-h-[min(95vh,calc(100vw*9/16))] aspect-video bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden flex-col">

        {/* ── Header con logo centrado ─────────────────── */}
        <header className="flex items-center justify-center pt-5 pb-4 short-landscape:pt-3 short-landscape:pb-2 shrink-0">
          <Km0Logo className="h-11 short-landscape:h-9 w-auto" />
        </header>

        {/* ── Two-column body ──────────────────────────── */}
        <div className="flex-1 flex items-stretch min-h-0 px-6 pb-6 short-landscape:px-4 short-landscape:pb-3">

          {/* Columna izquierda: ilustración */}
          <div className="flex-1 relative flex items-center justify-center pr-6 short-landscape:pr-4">
            <FloatingDots />
            {/* Anillo turquesa */}
            <div className="relative aspect-square h-full max-h-[min(70%,360px)] short-landscape:max-h-[60%] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-km0-teal-400/25 border-2 border-km0-blue-700" />
              <div className="absolute inset-[14%] rounded-full bg-km0-teal-500/90" />
              <img
                src={robotPlaceholder}
                alt="KM0 LAB mascot"
                className="relative z-10 h-[70%] w-auto object-contain animate-float drop-shadow-lg"
              />
            </div>
          </div>

          {/* Divisor vertical */}
          <div className="w-px bg-km0-yellow-500/60 self-stretch mx-2 short-landscape:mx-1" />

          {/* Columna derecha: tarjetas */}
          <div className="flex-1 flex flex-col justify-center gap-3 short-landscape:gap-2 pl-6 short-landscape:pl-4
              [&_button]:py-3 short-landscape:[&_button]:py-2
              [&_button]:px-4 short-landscape:[&_button]:px-3
              [&_button>span:first-child]:w-11 [&_button>span:first-child]:h-11
              short-landscape:[&_button>span:first-child]:w-9 short-landscape:[&_button>span:first-child]:h-9
              [&_button>span:first-child>img]:w-9 [&_button>span:first-child>img]:h-9
              short-landscape:[&_button>span:first-child>img]:w-7 short-landscape:[&_button>span:first-child>img]:h-7
              [&_button_p:first-child]:text-lg
              short-landscape:[&_button_p:first-child]:text-base
              [&_button_p:last-child]:text-sm
              short-landscape:[&_button_p:last-child]:text-xs">
            {languages.map((lang, i) => (
              <LanguageCard
                key={lang.id}
                flag={lang.flag}
                flagIsImage={lang.flagIsImage}
                name={lang.name}
                description={lang.description}
                selected={selected === lang.id}
                disabled={lang.disabled}
                onClick={() => handleSelect(lang.id)}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
