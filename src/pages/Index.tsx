import { useState } from "react";
import LanguageCard from "@/components/LanguageCard";
import FloatingDots from "@/components/FloatingDots";
import Km0Logo from "@/components/Km0Logo";
import robotPlaceholder from "@/assets/km0_language_v1.jpg";

const languages = [
  {
    id: "ca",
    flag: "🏴󠁥󠁳󠁣󠁴󠁿",
    name: "Català",
    description: "Comença en català",
  },
  {
    id: "es",
    flag: "🇪🇸",
    name: "Español",
    description: "Empieza en español",
  },
  {
    id: "en",
    flag: "🇬🇧",
    name: "English",
    description: "Start in English",
  },
];

const Index = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 px-4 py-10">
      {/* Mobile shell */}
      <div className="w-full max-w-[390px] flex flex-col gap-8">

        {/* ── Logo ──────────────────────────────────────────── */}
        <div className="flex justify-center">
          <Km0Logo className="h-10 w-auto" />
        </div>

        {/* ── Mascota + puntos decorativos ─────────────────── */}
        <div className="relative flex justify-center items-center h-52">
          <FloatingDots />
          <img
            src={robotPlaceholder}
            alt="KM0 LAB mascot"
            className="h-44 w-auto object-contain animate-float drop-shadow-lg rounded-2xl"
          />
        </div>

        {/* ── Textos ───────────────────────────────────────── */}
        <div className="text-center space-y-2 px-2">
          <h1 className="font-brand font-bold text-3xl text-primary leading-tight">
            Select your language
          </h1>
          <p className="font-ui text-base text-muted-foreground">
            Which language would you like to start with?
          </p>
        </div>

        {/* ── Language cards ────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {languages.map((lang, i) => (
            <LanguageCard
              key={lang.id}
              flag={lang.flag}
              name={lang.name}
              description={lang.description}
              selected={selected === lang.id}
              onClick={() => setSelected(lang.id)}
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>

        {/* ── CTA ──────────────────────────────────────────── */}
        {selected && (
          <button
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-ui font-semibold text-base tracking-wide transition-all duration-200 hover:bg-km0-blue-600 active:scale-95 animate-fade-in-up"
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
};

export default Index;
