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
        showLogin={showLogin}
        onLogin={onLogin}
        showGreeting={false}
        greetingSlot={
          <div className="gap-1.5 px-3 pb-1 flex-col flex items-center justify-start">
            <GreetingBlock greeting={greeting} subtitle={subtitle} />
            {showPoints && <PointsCard points={points} nextLevel={nextLevel} />}
          </div>
        }
        inline
      />

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-3 px-3 pt-2 pb-3">


        <div className="grid grid-cols-[3fr_2fr] gap-x-3 horizontal-desktop:gap-x-5 items-start">
          <section className="border border-km0-beige-200 bg-gradient-to-b from-card/90 to-secondary/40 ring-1 ring-white/60 px-[10px] min-w-0 shadow-lg rounded-md py-2 self-start space-y-2.5">
            <div className="space-y-2.5 min-w-0">
              <SectionHeader title={t("home.section.quick", lang)} />
              <HomeModules modules={modules} />
            </div>
            <div className="space-y-2.5 flex flex-col min-h-0 min-w-0 self-start">
              <SectionHeader title={t("home.section.events", lang)} actionLabel={t("home.action.see_all_m", lang)} onAction={onSeeAllEvents} />
              <div className="min-h-0">
                <EventHeroCarousel promos={promos} onOpen={onOpenEvent} />
              </div>
            </div>
          </section>

          <section className="border border-km0-beige-200 bg-gradient-to-b from-card/90 to-secondary/40 ring-1 ring-white/60 px-[10px] min-w-0 shadow-lg rounded-md py-0 space-y-3 divide-y divide-km0-beige-200/60">
            <div className="space-y-2.5 pb-3 min-w-0">
              <SectionHeader title={t("home.section.shops", lang)} actionLabel={t("home.action.see_all_m", lang)} onAction={onSeeAllComercios} />
              <ComercioCarousel comercios={comercios} />
            </div>
            <div className="space-y-2.5 pt-3 min-h-0 min-w-0">
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
  <div className="flex items-center justify-between gap-2 min-w-0 text-xs">
    <h4 className="font-brand font-black text-km0-blue-800 truncate min-w-0 text-xs">
      {title}
    </h4>
    {actionLabel && (
      <button
        type="button"
        onClick={onAction}
        className="font-ui font-bold text-km0-coral-400 flex items-center gap-1 active:scale-95 transition-transform underline underline-offset-4 whitespace-nowrap shrink-0 text-xs"
      >
        {actionLabel}
        <ArrowRight size={12} strokeWidth={2.4} className="horizontal-desktop:w-4 horizontal-desktop:h-4" />
      </button>
    )}
  </div>
);


export default HomeContentLandscape;
