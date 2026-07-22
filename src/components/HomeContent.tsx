import HomeModules, { type HomeModule } from "./HomeModules";
import HomeHero from "./HomeHero";
import EventHeroCarousel from "./EventHeroCarousel";
import CouponCard from "./CouponCard";
import PointsCard from "./PointsCard";
import GreetingBlock from "./GreetingBlock";
import ComercioCarousel from "./ComercioCarousel";
import BottomTabs, { type HomeTab } from "./BottomTabs";
import { ArrowRight } from "lucide-react";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";

import type { Promo } from "@/types/promo";
import type { Comercio } from "@/types/comercio";
import type { Coupon } from "@/types/coupon";

export interface HomeContentProps {
  cityName: string;
  hasAlerts: boolean;
  onToggleAlerts: () => void;
  /** Saludo ya localizado (e.g. "¡Hola, Aina!" o "¡Hola!"). */
  greeting: string;
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
  /** Solo se muestra PointsCard si hay sesión. */
  showPoints: boolean;
  onSeeAllComercios?: () => void;
  onSeeAllEvents?: () => void;
  onSeeAllCoupons?: () => void;
  onOpenEvent?: (id: string) => void;
}

const HomeContent = ({
  cityName,
  hasAlerts,
  onToggleAlerts,
  greeting,
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
  showPoints,
  onSeeAllComercios,
  onSeeAllEvents,
  onSeeAllCoupons,
  onOpenEvent,
}: HomeContentProps) => {
  const { lang } = useLang();
  const subtitle = t("home.greeting_subtitle", lang);

  return (
    <>
      <HomeHero
        cityName={cityName}
        hasAlerts={hasAlerts}
        onToggleAlerts={onToggleAlerts}
        showLogin={showLogin}
        onLogin={onLogin}
        showGreeting={false}
        greetingSlot={
          <div className="my-0 flex flex-col gap-3 horizontal-mobile:!gap-2 px-2 py-0">
            <GreetingBlock greeting={greeting} subtitle={subtitle} />
            {showPoints && <PointsCard points={points} nextLevel={nextLevel} />}
          </div>
        }
        inline
      />

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col">
        <div className="relative z-10 flex flex-col gap-5 vertical-tablet:gap-6 horizontal-mobile:!gap-3 horizontal-desktop:!gap-5 px-2 pt-4 pb-6 horizontal-mobile:!pt-2 horizontal-mobile:!pb-3">
          <section className="rounded-3xl border border-km0-beige-200 bg-gradient-to-b from-card/90 to-secondary/40 shadow-[0_20px_50px_-32px_hsl(var(--foreground)/0.38)] ring-1 ring-white/60 space-y-3 px-[10px] py-[10px]">
            <SectionHeader title={t("home.section.quick", lang)} />
            <HomeModules modules={modules} />
          </section>

          <section className="rounded-3xl border border-km0-beige-200 bg-gradient-to-b from-card/90 to-secondary/40 shadow-[0_20px_50px_-32px_hsl(var(--foreground)/0.38)] ring-1 ring-white/60 px-6 py-6 space-y-3">
            <SectionHeader title={t("home.section.events", lang)} actionLabel={t("home.action.see_all_m", lang)} onAction={onSeeAllEvents} />
            <EventHeroCarousel promos={promos} onOpen={onOpenEvent} />
          </section>

          <section className="rounded-3xl border border-km0-beige-200 bg-gradient-to-b from-card/90 to-secondary/40 shadow-[0_20px_50px_-32px_hsl(var(--foreground)/0.38)] ring-1 ring-white/60 px-6 py-6 space-y-3">
            <SectionHeader title={t("home.section.shops", lang)} actionLabel={t("home.action.see_all_m", lang)} onAction={onSeeAllComercios} />
            <ComercioCarousel comercios={comercios} />
          </section>

          <section className="rounded-3xl border border-km0-beige-200 bg-gradient-to-b from-card/90 to-secondary/40 shadow-[0_20px_50px_-32px_hsl(var(--foreground)/0.38)] ring-1 ring-white/60 px-6 py-6 space-y-3">
            <SectionHeader title={t("home.section.coupons", lang)} actionLabel={t("home.action.see_all_f", lang)} onAction={onSeeAllCoupons} />
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
        className="font-ui font-bold text-km0-coral-400 active:scale-95 transition-transform underline underline-offset-4 text-xs vertical-tablet:text-sm horizontal-mobile:!text-[11px] horizontal-desktop:!text-sm gap-0 flex items-center justify-start whitespace-nowrap shrink-0"
      >
        {actionLabel}
        <ArrowRight size={13} strokeWidth={2.4} className="horizontal-mobile:!w-3 horizontal-mobile:!h-3" />
      </button>
    )}
  </div>
);

export default HomeContent;
