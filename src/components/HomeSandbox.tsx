import { useEffect, useMemo, useState } from "react";
import HomeContent from "@/components/HomeContent";
import HomeContentLandscape from "@/components/HomeContentLandscape";
import PointsRewardOverlay from "@/components/PointsRewardOverlay";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";
import { INITIAL_MODULES, type HomeModuleSeed } from "@/data/homeModules";
import type { HomeModule, HomeModuleId } from "@/components/HomeModules";
import { PROMOS } from "@/data/promos";
import { COMERCIOS } from "@/data/comercios";
import { COUPONS } from "@/data/coupons";
import { type HomeTab } from "@/components/BottomTabs";

export type HomeSandboxState = "guest" | "registered" | "reward-welcome";

interface HomeSandboxProps {
  /** Estado simulado de la Home.
   *  - `guest` = no registrado (muestra LoginButton, oculta puntos).
   *  - `registered` = sesión iniciada (oculta LoginButton, muestra puntos).
   *  - `reward-welcome` = como registered, pero dispara automáticamente
   *    el overlay de bienvenida (+500 pts) al montar.
   *  Default: `guest`. */
  state?: HomeSandboxState;
}

const HomeSandbox = ({ state = "guest" }: HomeSandboxProps) => {
  const [seeds, setSeeds] = useState<HomeModuleSeed[]>(INITIAL_MODULES);
  const [activeTab, setActiveTab] = useState<HomeTab>("home");
  const [showReward, setShowReward] = useState(state === "reward-welcome");
  const bp = useBreakpoint();
  const { lang } = useLang();
  const isLandscape = bp === "horizontal-mobile" || bp === "horizontal-desktop";
  const Layout = isLandscape ? HomeContentLandscape : HomeContent;

  // Reabrir overlay cuando se cambia el estado a reward-welcome.
  useEffect(() => {
    if (state === "reward-welcome") setShowReward(true);
  }, [state]);

  const toggle = (id: HomeModuleId) =>
    setSeeds((prev) => prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));

  const modulesWithHandlers: HomeModule[] = useMemo(
    () => seeds.map((m) => ({ id: m.id, active: m.active, label: t(m.labelKey, lang), onClick: () => toggle(m.id) })),
    [seeds, lang],
  );

  const noop = () => {};
  // reward-welcome se comporta como registered.
  const isRegistered = state === "registered" || state === "reward-welcome";

  return (
    <>
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
        showLogin={!isRegistered}
        onLogin={noop}
        showProfile={isRegistered}
        onProfile={noop}
        showPoints={isRegistered}
        onSeeAllComercios={noop}
        onSeeAllEvents={noop}
        onSeeAllCoupons={noop}
        onOpenEvent={noop}
      />
      {state === "reward-welcome" && showReward && (
        <PointsRewardOverlay
          points={500}
          message="¡Bienvenido!"
          onClose={() => setShowReward(false)}
        />
      )}
    </>
  );
};

export default HomeSandbox;
