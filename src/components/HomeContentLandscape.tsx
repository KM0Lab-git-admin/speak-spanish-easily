import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import HomeHero from "./HomeHero";
import HomeModules from "./HomeModules";
import EventHeroCarousel from "./EventHeroCarousel";
import ComercioCarousel from "./ComercioCarousel";
import CouponCard from "./CouponCard";
import PointsCard from "./PointsCard";
import GreetingBlock from "./GreetingBlock";
import BottomTabs from "./BottomTabs";
import LoginButton from "./LoginButton";
import type { HomeContentProps } from "./HomeContent";

/**
 * HomeContentLandscape — versión exclusiva landscape de la home.
 *
 * AISLAMIENTO TOTAL respecto a portrait:
 *  - Este componente solo se renderiza dentro del frame `hidden landscape:flex`
 *    de `Home.tsx`. Portrait (vertical-mobile/vertical-tablet) sigue usando
 *    `HomeContent` sin tocar.
 *  - Reutiliza subcomponentes (HomeHero, PointsCard, HomeModules, etc.) sin
 *    modificarlos ni añadirles props nuevas: solo los compone en un layout
 *    propio de 2 columnas.
 *
 * Layout:
 *   ┌─────────────────────────────────────────────┐
 *   │ Header (HomeHero inline con saludo+puntos) │
 *   ├──────────────────┬──────────────────────────┤
 *   │ Accesos rápidos  │ Descubre lo nuestro      │
 *   │ Eventos destac.  │ Promos para ti           │
 *   ├──────────────────┴──────────────────────────┤
 *   │ BottomTabs                                  │
 *   └─────────────────────────────────────────────┘
 */
const HomeContentLandscape = ({
  cityName,
  hasAlerts,
  onToggleAlerts,
  userName = "Aina",
  points,
  nextLevel,
  modules,
  promos,
  comercios,
  coupons,
  activeTab,
  onTabChange,
  showLogin,
  onLogin,
  showProfile,
  onProfile,
  onSeeAllComercios,
  onSeeAllEvents,
  onSeeAllCoupons,
  onOpenEvent,
}: HomeContentProps) => {
  return (
    <>
      <HomeHero
        cityName={cityName}
        hasAlerts={hasAlerts}
        onToggleAlerts={onToggleAlerts}
        showLogin={false}
        onLogin={onLogin}
        showGreeting={false}
        greetingSlot={
          <div className="flex items-center gap-2 px-3 py-1">
            <div className="shrink-0">
              <GreetingBlock name={userName} />
            </div>
            <div className="flex-1 min-w-0">
              <PointsCard points={points} nextLevel={nextLevel} />
            </div>
            {showLogin && (
              <div className="shrink-0">
                <LoginButton onClick={onLogin} size="sm" />
              </div>
            )}
          </div>
        }
        inline
      />

      {/* Body: 2 columnas con scroll-y interno cada una */}
      <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-2 gap-2 px-2 py-2 horizontal-desktop:gap-4 horizontal-desktop:px-4 horizontal-desktop:py-3">
        {/* COL IZQUIERDA */}
        <div className="min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-2 horizontal-desktop:gap-3 pr-1">
          <section className="flex flex-col gap-1.5">
            <SectionHeader title="Accesos rápidos" />
            <HomeModules modules={modules} />
          </section>

          <section className="flex flex-col gap-1.5">
            <SectionHeader title="Eventos destacados" actionLabel="Ver todos" onAction={onSeeAllEvents} />
            <EventHeroCarousel promos={promos} onOpen={onOpenEvent} />
          </section>
        </div>

        {/* COL DERECHA */}
        <div className="min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-2 horizontal-desktop:gap-3 pr-1">
          <section className="flex flex-col gap-1.5">
            <SectionHeader title="Descubre lo nuestro" actionLabel="Ver todos" onAction={onSeeAllComercios} />
            <ComercioCarousel comercios={comercios} />
          </section>

          <section className="flex flex-col gap-1.5">
            <SectionHeader title="Promos para ti" actionLabel="Ver todas" onAction={onSeeAllCoupons} />
            <div className="flex flex-col gap-1.5">
              {coupons.map((c, i) => (
                <CouponCard key={c.id} coupon={c} delay={i * 0.05} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <BottomTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        showProfile={showProfile}
        onLogin={onLogin}
        onProfile={onProfile}
      />
    </>
  );
};

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

const SectionHeader = ({ title, actionLabel, onAction }: SectionHeaderProps) => (
  <div className="flex items-center justify-between gap-2">
    <h2 className="font-brand font-black text-km0-blue-800 text-sm horizontal-desktop:text-lg">
      {title}
    </h2>
    {actionLabel && (
      <button
        type="button"
        onClick={onAction}
        className="font-ui font-bold text-km0-coral-400 flex items-center gap-1 active:scale-95 transition-transform underline underline-offset-4 text-[11px] horizontal-desktop:text-sm"
      >
        {actionLabel}
        <ArrowRight size={12} strokeWidth={2.4} className="horizontal-desktop:w-4 horizontal-desktop:h-4" />
      </button>
    )}
  </div>
);

export default HomeContentLandscape;
