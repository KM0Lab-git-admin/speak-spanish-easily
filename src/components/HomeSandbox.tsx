import { useMemo, useState } from "react";
import HomeContent from "@/components/HomeContent";
import HomeContentLandscape from "@/components/HomeContentLandscape";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";
import { INITIAL_MODULES, type HomeModuleSeed } from "@/data/homeModules";
import type { HomeModule, HomeModuleId } from "@/components/HomeModules";
import { PROMOS } from "@/data/promos";
import { COMERCIOS } from "@/data/comercios";
import { COUPONS } from "@/data/coupons";
import { type HomeTab } from "@/components/BottomTabs";

const HomeSandbox = () => {
  const [seeds, setSeeds] = useState<HomeModuleSeed[]>(INITIAL_MODULES);
  const [activeTab, setActiveTab] = useState<HomeTab>("home");
  const bp = useBreakpoint();
  const { lang } = useLang();
  const isLandscape = bp === "horizontal-mobile" || bp === "horizontal-desktop";
  const Layout = isLandscape ? HomeContentLandscape : HomeContent;

  const toggle = (id: HomeModuleId) =>
    setSeeds((prev) => prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));

  const modulesWithHandlers: HomeModule[] = useMemo(
    () => seeds.map((m) => ({ id: m.id, active: m.active, label: t(m.labelKey, lang), onClick: () => toggle(m.id) })),
    [seeds, lang],
  );

  const noop = () => {};

  return (
    <Layout
      cityName="Malgrat de Mar"
      hasAlerts={false}
      onToggleAlerts={noop}
      greeting={lang === "en" ? "Hi, Aina!" : "¡Hola, Aina!"}
      points={1259}
      nextLevel={3000}
      modules={modulesWithHandlers}
      promos={PROMOS}
      comercios={COMERCIOS}
      coupons={COUPONS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      showLogin={true}
      onLogin={noop}
      showProfile={false}
      onProfile={noop}
      showPoints={true}
      onSeeAllComercios={noop}
      onSeeAllEvents={noop}
      onSeeAllCoupons={noop}
      onOpenEvent={noop}
    />
  );
};

export default HomeSandbox;
