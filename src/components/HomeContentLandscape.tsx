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
          <div className="gap-1.5 px-3 pb-1 flex flex-row">
            <GreetingBlock greeting={greeting} subtitle={subtitle} />
            {showPoints && <PointsCard points={points} nextLevel={nextLevel} />}
          </div>
        }
        inline
      />

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-2 px-3 pt-2 pb-3">
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

        <div className="grid grid-cols-2 gap-x-4 gap-y-3 items-start">
          <div className="flex flex-col gap-3 min-w-0">
            <section className="flex flex-col gap-1.5">
              <SectionHeader title={t("home.section.quick", lang)} />
              <HomeModules modules={modules} />
            </section>

            <section className="flex flex-col gap-1.5">
              <SectionHeader title={t("home.section.events", lang)} actionLabel={t("home.action.see_all_m", lang)} onAction={onSeeAllEvents} />
              <EventHeroCarousel promos={promos} onOpen={onOpenEvent} />
            </section>
          </div>

          <div className="flex flex-col gap-3 min-w-0">
            <section className="flex flex-col gap-1.5">
              <SectionHeader title={t("home.section.shops", lang)} actionLabel={t("home.action.see_all_m", lang)} onAction={onSeeAllComercios} />
              <ComercioCarousel comercios={comercios} />
            </section>

            <section className="flex flex-col gap-1.5">
              <SectionHeader title={t("home.section.coupons", lang)} actionLabel={t("home.action.see_all_f", lang)} onAction={onSeeAllCoupons} />
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
