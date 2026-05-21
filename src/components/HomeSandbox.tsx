import { useState } from "react";
import HomeContent from "@/components/HomeContent";
import { INITIAL_MODULES } from "@/data/homeModules";
import type { HomeModule, HomeModuleId } from "@/components/HomeModules";
import { PROMOS } from "@/data/promos";
import { COMERCIOS } from "@/data/comercios";
import { COUPONS } from "@/data/coupons";
import { type HomeTab } from "@/components/BottomTabs";

/**
 * HomeSandbox — versión auto-contenida de la Home para mostrar dentro de
 * <SimulatedDevice /> en /preview-all. No usa useAuth ni useNavigate (que
 * dependen del router/sesión de la app real); solo estado local y datos
 * mock, lo justo para que la maquetación se vea exactamente igual y
 * Visual Edit pueda seleccionar componentes reales.
 */
const HomeSandbox = () => {
  const [modules, setModules] = useState<HomeModule[]>(INITIAL_MODULES);
  const [activeTab, setActiveTab] = useState<HomeTab>("home");

  const toggle = (id: HomeModuleId) =>
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));

  const modulesWithHandlers: HomeModule[] = modules.map((m) => ({
    ...m,
    onClick: () => toggle(m.id),
  }));

  const noop = () => {};

  return (
    <HomeContent
      cityName="Malgrat de Mar"
      hasAlerts={false}
      onToggleAlerts={noop}
      userName="Aina"
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
      onSeeAllComercios={noop}
      onSeeAllEvents={noop}
      onSeeAllCoupons={noop}
      onOpenEvent={noop}
    />
  );
};

export default HomeSandbox;
