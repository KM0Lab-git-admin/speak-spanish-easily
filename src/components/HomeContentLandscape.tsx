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
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";
import type { HomeContentProps } from "./HomeContent";

const HomeContentLandscape = ({
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
        showLogin={false}
        onLogin={onLogin}
        showGreeting={false}
        greetingSlot={
          <div className="gap-1.5 px-3 pb-1 flex flex-col">
            <GreetingBlock greeting={greeting} subtitle={subtitle} />
            {showPoints && <PointsCard points={points} nextLevel={nextLevel} />}
          </div>
        }
        inline
      />

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-3 px-3 pt-2 pb-3">
        {showLogin && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <LoginButton onClick={onLogin} size="sm" label={t("home.login_cta", lang)} />
          </motion.div>
        )}

        <div className="grid grid-cols-2 grid-rows-[auto_1fr] gap-x-5 gap-y-4 items-stretch">
          <section className="row-span-2 grid grid-rows-subgrid rounded-3xl border border-km0-beige-200 bg-gradient-to-b from-card/90 to-secondary/40 shadow-[0_20px_50px_-32px_hsl(var(--foreground)/0.38)] ring-1 ring-white/60 px-5 py-4 min-w-0 divide-y divide-km0-beige-200/60">
            <div className="space-y-2.5 pb-3">
              <SectionHeader title={t("home.section.quick", lang)} />
              <HomeModules modules={modules} />
            </div>
            <div className="space-y-2.5 pt-3 flex flex-col min-h-0">
              <SectionHeader title={t("home.section.events", lang)} actionLabel={t("home.action.see_all_m", lang)} onAction={onSeeAllEvents} />
              <div className="flex-1 min-h-0">
                <EventHeroCarousel promos={promos} onOpen={onOpenEvent} />
              </div>
            </div>
          </section>

          <section className="row-span-2 grid grid-rows-subgrid rounded-3xl border border-km0-beige-200 bg-gradient-to-b from-card/90 to-secondary/40 shadow-[0_20px_50px_-32px_hsl(var(--foreground)/0.38)] ring-1 ring-white/60 px-5 py-4 min-w-0 divide-y divide-km0-beige-200/60">
            <div className="space-y-2.5 pb-3">
              <SectionHeader title={t("home.section.shops", lang)} actionLabel={t("home.action.see_all_m", lang)} onAction={onSeeAllComercios} />
              <ComercioCarousel comercios={comercios} />
            </div>
            <div className="space-y-2.5 pt-3 min-h-0">
              <SectionHeader title={t("home.section.coupons", lang)} actionLabel={t("home.action.see_all_f", lang)} onAction={onSeeAllCoupons} />
              <div className="flex flex-col gap-1.5">
                {coupons.map((c, i) => (
                  <CouponCard key={c.id} coupon={c} delay={i * 0.05} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="landscape:hidden contents">
        <BottomTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
          showProfile={showProfile}
          onLogin={onLogin}
          onProfile={onProfile}
        />
      </div>
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
