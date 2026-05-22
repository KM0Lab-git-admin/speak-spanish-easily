import { motion } from "framer-motion";
import HomeModules, { type HomeModule } from "./HomeModules";
import HomeHero from "./HomeHero";
import EventHeroCarousel from "./EventHeroCarousel";
import CouponCard from "./CouponCard";
import PointsCard from "./PointsCard";
import GreetingBlock from "./GreetingBlock";
import ComercioCarousel from "./ComercioCarousel";
import BottomTabs, { type HomeTab } from "./BottomTabs";
import LoginButton from "./LoginButton";
import { ArrowRight } from "lucide-react";
import skylineMalgrat from "@/assets/skyline-malgrat.png";

import type { Promo } from "@/types/promo";
import type { Comercio } from "@/types/comercio";
import type { Coupon } from "@/types/coupon";

/**
 * HomeContent — renderiza DOS layouts hermanos:
 *  - Portrait (vertical-mobile / vertical-tablet): apilado vertical clásico.
 *  - Landscape (horizontal-mobile / horizontal-desktop): dos columnas con
 *    identidad (saludo + puntos + login) fija a la izquierda y secciones
 *    scrollables a la derecha. BottomTabs full-width abajo.
 */
export interface HomeContentProps {
  cityName: string;
  hasAlerts: boolean;
  onToggleAlerts: () => void;
  userName?: string | null;
  points: number;
  nextLevel: number;
  modules: HomeModule[];
  promos: Promo[];
  comercios: Comercio[];
  coupons: Coupon[];
  activeTab: HomeTab;
  onTabChange: (t: HomeTab) => void;
  showLogin: boolean;
  onLogin: () => void;
  showProfile: boolean;
  onProfile: () => void;
  onSeeAllComercios?: () => void;
  onSeeAllEvents?: () => void;
  onSeeAllCoupons?: () => void;
  onOpenEvent?: (id: string) => void;
}

const HomeContent = ({
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
  /* ─── Secciones reutilizadas en ambos layouts ─────────────── */
  const sectionsBlock = (
    <>
      <section className="flex flex-col gap-2">
        <SectionHeader title="Accesos rápidos" />
        <HomeModules modules={modules} />
      </section>

      <section className="flex flex-col gap-2">
        <SectionHeader title="Eventos destacados" actionLabel="Ver todos" onAction={onSeeAllEvents} />
        <EventHeroCarousel promos={promos} onOpen={onOpenEvent} />
      </section>

      <section className="flex flex-col gap-2">
        <SectionHeader title="Descubre lo nuestro" actionLabel="Ver todos" onAction={onSeeAllComercios} />
        <ComercioCarousel comercios={comercios} />
      </section>

      <section className="flex flex-col gap-2">
        <SectionHeader title="Promos para ti" actionLabel="Ver todas" onAction={onSeeAllCoupons} />
        <div className="flex flex-col gap-2">
          {coupons.map((c, i) => (
            <CouponCard key={c.id} coupon={c} delay={i * 0.05} />
          ))}
        </div>
      </section>
    </>
  );

  return (
    <>
      {/* ═══════════════════ PORTRAIT ═══════════════════ */}
      <div className="landscape:hidden flex flex-col flex-1 min-h-0">
        <HomeHero
          cityName={cityName}
          hasAlerts={hasAlerts}
          onToggleAlerts={onToggleAlerts}
          showLogin={false}
          onLogin={onLogin}
          showGreeting={false}
          greetingSlot={
            <div className="my-0 flex flex-col gap-3 px-2 py-0">
              <GreetingBlock name={userName} />
              <PointsCard points={points} nextLevel={nextLevel} />
            </div>
          }
          inline
        />

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col">
          <div className="relative z-10 flex flex-col gap-4 vertical-tablet:gap-5 px-2 pt-3 pb-5">
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
            {sectionsBlock}
          </div>
        </div>
      </div>

      {/* ═══════════════════ LANDSCAPE ═══════════════════ */}
      <div className="hidden landscape:flex flex-col flex-1 min-h-0">
        {/* Header KM0 compacto (sin greeting; el saludo va en la col izda) */}
        <HomeHero
          cityName={cityName}
          hasAlerts={hasAlerts}
          onToggleAlerts={onToggleAlerts}
          showLogin={false}
          onLogin={onLogin}
          showGreeting={false}
          inline
        />

        {/* Cuerpo 2 columnas */}
        <div className="flex-1 min-h-0 flex">
          {/* COL IZQUIERDA — identidad: saludo + puntos + login (fija) */}
          <aside className="relative w-[38%] shrink-0 overflow-hidden bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 border-r border-km0-blue-700/10 flex flex-col">
            <img
              src={skylineMalgrat}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-2/3 object-cover object-top opacity-20 select-none"
            />
            <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-between gap-3 px-3 py-3 horizontal-desktop:px-5 horizontal-desktop:py-4">
              <div className="flex flex-col gap-3">
                <GreetingBlock name={userName} />
                <PointsCard points={points} nextLevel={nextLevel} variant="compact" />
              </div>
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
            </div>
          </aside>

          {/* COL DERECHA — secciones con scroll-y interno */}
          <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-3 horizontal-desktop:gap-4 px-3 py-2 horizontal-desktop:px-5 horizontal-desktop:py-3">
              {sectionsBlock}
            </div>
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

/* ─── Helpers ─────────────────────────────────────────────── */

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

const SectionHeader = ({ title, actionLabel, onAction }: SectionHeaderProps) => (
  <div className="flex items-center justify-between gap-2">
    <h2 className="font-brand font-black text-km0-blue-800 text-base vertical-tablet:text-lg horizontal-mobile:!text-sm horizontal-desktop:!text-lg">
      {title}
    </h2>
    {actionLabel && (
      <button
        type="button"
        onClick={onAction}
        className="font-ui font-bold text-km0-coral-400 flex items-center gap-1 active:scale-95 transition-transform underline underline-offset-4 text-xs vertical-tablet:text-sm horizontal-mobile:!text-[11px] horizontal-desktop:!text-sm"
      >
        {actionLabel}
        <ArrowRight size={13} strokeWidth={2.4} className="horizontal-mobile:!w-3 horizontal-mobile:!h-3" />
      </button>
    )}
  </div>
);

export default HomeContent;
