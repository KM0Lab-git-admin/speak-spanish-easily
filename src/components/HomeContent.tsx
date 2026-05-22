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

import type { Promo } from "@/types/promo";
import type { Comercio } from "@/types/comercio";
import type { Coupon } from "@/types/coupon";

/**
 * HomeContent — dos layouts independientes:
 *  - PORTRAIT (vertical-mobile, vertical-tablet): apilado vertical clásico.
 *    NO TOCAR. Cualquier cambio aquí rompe portrait.
 *  - LANDSCAPE (horizontal-mobile, horizontal-desktop): cabecera fija arriba
 *    (escudo + saludo + PointsCard + login) y body en dos columnas:
 *      · Col izquierda: Accesos rápidos + Eventos destacados
 *      · Col derecha:   Descubre lo nuestro + Promos para ti
 *    Si el alto no llega, el body interior scrollea; la cabecera no se mueve.
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

const HomeContent = (props: HomeContentProps) => {
  return (
    <>
      <PortraitLayout {...props} />
      <LandscapeLayout {...props} />
    </>
  );
};

/* ─── PORTRAIT (sin cambios respecto a la versión cerrada) ───────────────── */

const PortraitLayout = ({
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
    <div className="landscape:hidden contents">
      <HomeHero
        cityName={cityName}
        hasAlerts={hasAlerts}
        onToggleAlerts={onToggleAlerts}
        showLogin={false}
        onLogin={onLogin}
        showGreeting={false}
        greetingSlot={
          <div className="my-0 flex flex-col gap-3 horizontal-mobile:!gap-2 px-2 py-0">
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
        </div>
      </div>

      <BottomTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        showProfile={showProfile}
        onLogin={onLogin}
        onProfile={onProfile}
      />
    </div>
  );
};

/* ─── LANDSCAPE (nuevo: cabecera fija + 2 columnas) ──────────────────────── */

const LandscapeLayout = ({
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
    <div className="hidden landscape:flex flex-col flex-1 min-h-0">
      {/* Cabecera fija: escudo + saludo + puntos + login */}
      <div className="shrink-0">
        <HomeHero
          cityName={cityName}
          hasAlerts={hasAlerts}
          onToggleAlerts={onToggleAlerts}
          showLogin={false}
          onLogin={onLogin}
          showGreeting={false}
          greetingSlot={
            <div className="flex flex-col gap-1.5 horizontal-desktop:!gap-2 px-3 horizontal-desktop:!px-6 pb-1">
              <GreetingBlock name={userName} />
              <PointsCard points={points} nextLevel={nextLevel} />
              {showLogin && (
                <div className="flex justify-center pt-0.5">
                  <LoginButton onClick={onLogin} size="sm" />
                </div>
              )}
            </div>
          }
          inline
        />
      </div>

      {/* Body con scroll-y interno si hiciera falta. Header se queda quieto. */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="grid grid-cols-2 gap-2 horizontal-desktop:!gap-5 px-2 horizontal-desktop:!px-6 py-2 horizontal-desktop:!py-3">
          {/* Columna izquierda */}
          <div className="flex flex-col gap-2 horizontal-desktop:!gap-4 min-w-0">
            <section className="flex flex-col gap-1 horizontal-desktop:!gap-2 rounded-2xl bg-white/60 horizontal-desktop:!bg-white/70 border border-km0-blue-700/10 px-2 py-2 horizontal-desktop:!px-4 horizontal-desktop:!py-3">
              <SectionHeader title="Accesos rápidos" />
              <HomeModules modules={modules} />
            </section>

            <section className="flex flex-col gap-1 horizontal-desktop:!gap-2 rounded-2xl bg-white/60 horizontal-desktop:!bg-white/70 border border-km0-blue-700/10 px-2 py-2 horizontal-desktop:!px-4 horizontal-desktop:!py-3">
              <SectionHeader title="Eventos destacados" actionLabel="Ver todos" onAction={onSeeAllEvents} />
              <EventHeroCarousel promos={promos} onOpen={onOpenEvent} />
            </section>
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col gap-2 horizontal-desktop:!gap-4 min-w-0">
            <section className="flex flex-col gap-1 horizontal-desktop:!gap-2 rounded-2xl bg-white/60 horizontal-desktop:!bg-white/70 border border-km0-blue-700/10 px-2 py-2 horizontal-desktop:!px-4 horizontal-desktop:!py-3">
              <SectionHeader title="Descubre lo nuestro" actionLabel="Ver todos" onAction={onSeeAllComercios} />
              <ComercioCarousel comercios={comercios} />
            </section>

            <section className="flex flex-col gap-1 horizontal-desktop:!gap-2 rounded-2xl bg-white/60 horizontal-desktop:!bg-white/70 border border-km0-blue-700/10 px-2 py-2 horizontal-desktop:!px-4 horizontal-desktop:!py-3">
              <SectionHeader title="Promos para ti" actionLabel="Ver todas" onAction={onSeeAllCoupons} />
              <div className="flex flex-col gap-1.5 horizontal-desktop:!gap-2">
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
    </div>
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
