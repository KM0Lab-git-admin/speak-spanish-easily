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
 *    modificarlos: solo los compone en un layout propio.
 *
 * Layout (igual que portrait, pero el body se divide en 2 columnas):
 *   ┌─────────────────────────────────────────────────────┐
 *   │ HomeHero (FIJO: marca + saludo + PointsCard ancho) │
 *   ├─────────────────────────────────────────────────────┤
 *   │ [Iniciar sesión]                                    │  ↕ scroll común
 *   │ ┌──────────────────┬────────────────────────────┐  │
 *   │ │ Accesos rápidos  │ Descubre lo nuestro        │  │
 *   │ │ Eventos destac.  │ Promos para ti             │  │
 *   │ └──────────────────┴────────────────────────────┘  │
 *   ├─────────────────────────────────────────────────────┤
 *   │ BottomTabs (FIJO)                                   │
 *   └─────────────────────────────────────────────────────┘
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
      {/* Header FIJO arriba — saludo centrado + PointsCard a ancho completo */}
      <HomeHero
        cityName={cityName}
        hasAlerts={hasAlerts}
        onToggleAlerts={onToggleAlerts}
        showLogin={false}
        onLogin={onLogin}
        showGreeting={false}
        greetingSlot={
          <div className="gap-1.5 px-3 pb-1 flex flex-row">
            <GreetingBlock name={userName} />
            <PointsCard points={points} nextLevel={nextLevel} />
          </div>
        }
        inline
      />

      {/* Body con scroll-y interno (común a las 2 columnas) */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-2 px-3 pt-2 pb-3">
        {showLogin && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <LoginButton onClick={onLogin} size="sm" />
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 items-start">
          {/* COL IZQUIERDA */}
          <div className="flex flex-col gap-3 min-w-0">
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
          <div className="flex flex-col gap-3 min-w-0">
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
    <h2 className="font-brand font-black text-km0-blue-800 text-sm horizontal-desktop:text-base">
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
