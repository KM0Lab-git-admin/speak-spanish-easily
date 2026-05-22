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
 * HomeContent — nueva distribución de la home (basada en el informe
 * de mejoras de la home actual). Cambios principales:
 *
 *  1. Header limpio (HomeHero sin login inline, sin saludo dentro).
 *  2. Bloque saludo personalizado (GreetingBlock).
 *  3. Tarjeta de puntos prominente (PointsCard).
 *  4. Sección "Accesos rápidos" con HomeModules.
 *  5. Sección "Eventos destacados" con EventHeroCarousel + "Ver todos".
 *  6. Sección "Descubre lo nuestro" con ComercioCarousel + "Ver todos".
 *  7. Sección "Promos para ti" con CouponCard.
 *  8. BottomTabs intacto.
 *
 * Se permite scroll-y interno (la cantidad de contenido excede el
 * encuadre fijo del frame). Nunca scroll-x.
 *
 * El componente no conoce auth ni router: todo entra por props.
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
  return (
    <>
      {/* Header fijo en la parte superior — no se desplaza con el scroll del body.
          El saludo personalizado vive DENTRO del hero (greetingSlot) para que
          forme parte visualmente del bloque de marca. */}
      <HomeHero
        cityName={cityName}
        hasAlerts={hasAlerts}
        onToggleAlerts={onToggleAlerts}
        showLogin={false}
        onLogin={onLogin}
        showGreeting={false}
        greetingSlot={
          <div className="my-0 flex flex-col gap-3 horizontal-mobile:!gap-2 px-0 py-0">
            <GreetingBlock name={userName} />
            <PointsCard points={points} nextLevel={nextLevel} />
          </div>
        }
        inline
      />

      {/* Body con scroll-y interno: contenido scrollable, tabs fijo abajo */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col">


        {/* Contenido principal apilado verticalmente (saludo ya está dentro del hero) */}
        <div className="relative z-10 flex flex-col gap-4 vertical-tablet:gap-5 horizontal-mobile:!gap-2.5 horizontal-desktop:!gap-4 px-2 vertical-tablet:px-2 horizontal-mobile:!px-2 horizontal-desktop:!px-2 pt-3 pb-5 horizontal-mobile:!pt-2 horizontal-mobile:!pb-3">
          {/* CTA login solo si no hay sesión (portrait) */}
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


          {/* 3 · Accesos rápidos */}
          <section className="flex flex-col gap-2">
            <SectionHeader title="Accesos rápidos" />
            <HomeModules modules={modules} />
          </section>

          {/* 4 · Eventos destacados */}
          <section className="flex flex-col gap-2">
            <SectionHeader title="Eventos destacados" actionLabel="Ver todos" onAction={onSeeAllEvents} />
            <EventHeroCarousel promos={promos} onOpen={onOpenEvent} />
          </section>

          {/* 5 · Descubre lo nuestro (comercios) */}
          <section className="flex flex-col gap-2">
            <SectionHeader title="Descubre lo nuestro" actionLabel="Ver todos" onAction={onSeeAllComercios} />
            <ComercioCarousel comercios={comercios} />
          </section>

          {/* 6 · Promos para ti (cupones) */}
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
