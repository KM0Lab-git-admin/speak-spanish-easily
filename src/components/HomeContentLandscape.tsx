import { ArrowRight } from "lucide-react";
import HomeHero from "./HomeHero";
import HomeModules from "./HomeModules";
import EventHeroCarousel from "./EventHeroCarousel";
import ComercioCarousel from "./ComercioCarousel";
import CouponCard from "./CouponCard";
import PointsCard from "./PointsCard";
import JoinCard from "./JoinCard";
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
  subtitle,
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

  return (
    <>
      <HomeHero
        cityName={cityName}
        hasAlerts={hasAlerts}
        onToggleAlerts={onToggleAlerts}
        showGreeting={false}
        greetingSlot={
          <div className="gap-1.5 px-3 pb-1 horizontal-mobile:gap-0 horizontal-mobile:px-2.5 horizontal-mobile:pb-0 flex-col flex items-center justify-start">
            <GreetingBlock greeting={greeting} subtitle={subtitle} />
            {showLogin && <JoinCard onCreateAccount={onLogin} />}
            {showPoints && <PointsCard points={points} nextLevel={nextLevel} />}
          </div>
        }
        inline
      />


      <main className="flex-1 min-h-0 w-full grid items-start horizontal-desktop:items-stretch gap-3 p-3 horizontal-mobile:!gap-2 horizontal-mobile:!p-2.5 horizontal-desktop:p-5 horizontal-desktop:gap-5 horizontal-mobile:grid-cols-[minmax(0,1.05fr)_minmax(260px,0.75fr)] horizontal-desktop:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)] overflow-hidden">
          <section className="min-w-0 min-h-0 overflow-hidden rounded-2xl border border-border bg-card/90 p-3 horizontal-mobile:!p-2.5 horizontal-desktop:p-5 shadow-sm grid grid-rows-[auto_auto] content-start horizontal-desktop:grid-rows-[auto_1fr] horizontal-desktop:content-stretch gap-3 horizontal-mobile:!gap-2 horizontal-desktop:gap-4">
            <div className="space-y-1 horizontal-mobile:!space-y-0.5 horizontal-desktop:space-y-2 min-w-0">
              <SectionHeader title={t("home.section.quick", lang)} />
              <HomeModules modules={modules} />
            </div>
            <div className="space-y-1 horizontal-mobile:!space-y-0.5 horizontal-desktop:space-y-2 min-w-0 min-h-0 horizontal-desktop:flex horizontal-desktop:flex-col">
              <SectionHeader title={t("home.section.events", lang)} actionLabel={t("home.action.see_all_m", lang)} onAction={onSeeAllEvents} />
              <div className="horizontal-desktop:flex-1 horizontal-desktop:min-h-0 horizontal-desktop:flex">
                <EventHeroCarousel promos={promos} onOpen={onOpenEvent} />
              </div>
            </div>
          </section>

          <section className="min-w-0 min-h-0 overflow-hidden rounded-2xl border border-border bg-card/90 p-3 horizontal-mobile:!p-2.5 horizontal-desktop:p-5 shadow-sm grid grid-rows-[auto_auto] content-start horizontal-desktop:grid-rows-[auto_1fr] horizontal-desktop:content-stretch gap-4 horizontal-mobile:!gap-2 horizontal-desktop:gap-5">
            <div className="space-y-1 horizontal-mobile:!space-y-0.5 horizontal-desktop:space-y-2 min-w-0">
              <SectionHeader title={t("home.section.shops", lang)} actionLabel={t("home.action.see_all_m", lang)} onAction={onSeeAllComercios} />
              <ComercioCarousel comercios={comercios} />
            </div>
            <div className="space-y-1 horizontal-mobile:!space-y-0.5 horizontal-desktop:space-y-2 min-w-0 min-h-0 horizontal-desktop:flex horizontal-desktop:flex-col">
              <SectionHeader title={t("home.section.coupons", lang)} actionLabel={t("home.action.see_all_f", lang)} onAction={onSeeAllCoupons} />
              <div className="grid gap-3 horizontal-mobile:!gap-1.5 horizontal-desktop:gap-4 horizontal-desktop:flex-1 horizontal-desktop:min-h-0 horizontal-desktop:grid-rows-[repeat(auto-fit,minmax(0,1fr))]">
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
  <div className="gap-2 flex items-center justify-between min-w-0 text-xs horizontal-desktop:text-base">
    <h4 className="font-brand font-black text-km0-blue-800 truncate min-w-0 text-xs horizontal-desktop:text-lg">
      {title}
    </h4>
    {actionLabel && (
      <button
        type="button"
        onClick={onAction}
        className="font-ui font-bold text-km0-coral-400 flex items-center gap-1 active:scale-95 transition-transform underline underline-offset-4 whitespace-nowrap shrink-0 text-xs horizontal-desktop:text-sm"
      >
        {actionLabel}
        <ArrowRight size={12} strokeWidth={2.4} className="horizontal-desktop:w-4 horizontal-desktop:h-4" />
      </button>
    )}
  </div>
);


export default HomeContentLandscape;
