import { ArrowRight } from "lucide-react";
import HomeHero from "./HomeHero";
import HomeModules from "./HomeModules";
import EventHeroCarousel from "./EventHeroCarousel";
import ComercioCarousel from "./ComercioCarousel";
import CouponCard from "./CouponCard";
import PointsCard from "./PointsCard";
import GreetingBlock from "./GreetingBlock";
import BottomTabs from "./BottomTabs";
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
          <div className="gap-1.5 px-3 pb-1 horizontal-mobile:gap-0 horizontal-mobile:px-2.5 horizontal-mobile:pb-0 flex-col flex items-center justify-start">
            <GreetingBlock greeting={greeting} subtitle={subtitle} />
            {showPoints && <PointsCard points={points} nextLevel={nextLevel} />}
          </div>
        }
        inline
      />

      <main className="flex-1 min-h-0 w-full grid items-start gap-3 p-3 horizontal-desktop:p-4 horizontal-desktop:gap-4 horizontal-mobile:grid-cols-[minmax(0,1.05fr)_minmax(260px,0.75fr)] horizontal-desktop:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)] overflow-hidden">
          <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card/90 p-3 horizontal-desktop:p-4 shadow-sm grid grid-rows-[auto_auto] content-start gap-3">
            <div className="space-y-1 horizontal-desktop:space-y-2 min-w-0">
              <SectionHeader title={t("home.section.quick", lang)} />
              <HomeModules modules={modules} />
            </div>
            <div className="space-y-1 horizontal-desktop:space-y-2 min-w-0">
              <SectionHeader title={t("home.section.events", lang)} actionLabel={t("home.action.see_all_m", lang)} onAction={onSeeAllEvents} />
              <EventHeroCarousel promos={promos} onOpen={onOpenEvent} />
            </div>
          </section>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card/90 p-3 horizontal-desktop:p-4 shadow-sm grid grid-rows-[auto_auto] content-start gap-4">
            <div className="space-y-1 horizontal-desktop:space-y-2 min-w-0">
              <SectionHeader title={t("home.section.shops", lang)} actionLabel={t("home.action.see_all_m", lang)} onAction={onSeeAllComercios} />
              <ComercioCarousel comercios={comercios} />
            </div>
            <div className="space-y-1 horizontal-desktop:space-y-2 min-w-0">
              <SectionHeader title={t("home.section.coupons", lang)} actionLabel={t("home.action.see_all_f", lang)} onAction={onSeeAllCoupons} />
              <div className="grid gap-3">
                {coupons.map((c, i) => (
                  <CouponCard key={c.id} coupon={c} delay={i * 0.05} />
                ))}
              </div>
            </div>
          </section>
      </main>

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
  <div className="gap-2 flex items-center justify-between min-w-0 text-xs">
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
