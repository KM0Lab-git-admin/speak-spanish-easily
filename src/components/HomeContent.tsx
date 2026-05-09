import { motion } from "framer-motion";
import HomeModules, { type HomeModule } from "./HomeModules";
import HomeHero from "./HomeHero";
import PromoSection from "./PromoSection";
import ComerciosSection from "./ComerciosSection";
import BottomTabs, { type HomeTab } from "./BottomTabs";
import LoginButton from "./LoginButton";
import type { Promo } from "@/types/promo";
import type { Comercio } from "@/types/comercio";

/**
 * HomeContent — layout del Home con 3 zonas fijas:
 *   ┌────────────────────────┐
 *   │  HomeHero  (shrink-0)  │  ← franja superior fija
 *   ├────────────────────────┤
 *   │  Middle    (flex-1)    │  ← justify-evenly, sin scroll
 *   │   · LoginButton (port.)│
 *   │   · HomeModules        │
 *   │   · PromoSection       │
 *   │   · ComerciosSection   │
 *   ├────────────────────────┤
 *   │  BottomTabs (shrink-0) │  ← tabs fijas abajo
 *   └────────────────────────┘
 *
 * El reparto vertical entre los bloques intermedios se hace con
 * `justify-evenly` + un `gap` proporcional para que la distancia
 * entre componentes sea visualmente equivalente en las 4 resoluciones
 * oficiales (375×667, 768×1024, 667×375, 1280×550).
 *
 * No conoce auth, router ni hooks: todo entra por props.
 */
export interface HomeContentProps {
  cityName: string;
  hasAlerts: boolean;
  onToggleAlerts: () => void;
  modules: HomeModule[];
  promos: Promo[];
  comercios: Comercio[];
  activeTab: HomeTab;
  onTabChange: (t: HomeTab) => void;
  showLogin: boolean;
  onLogin: () => void;
  showProfile: boolean;
  onProfile: () => void;
  onSeeAllComercios?: () => void;
}

const HomeContent = ({
  cityName,
  hasAlerts,
  onToggleAlerts,
  modules,
  promos,
  comercios,
  activeTab,
  onTabChange,
  showLogin,
  onLogin,
  showProfile,
  onProfile,
  onSeeAllComercios,
}: HomeContentProps) => {
  return (
    <>
      {/* ZONA 1 — Hero fijo arriba (altura natural) */}
      <div className="shrink-0">
        <HomeHero
          cityName={cityName}
          hasAlerts={hasAlerts}
          onToggleAlerts={onToggleAlerts}
          showLogin={showLogin}
          onLogin={onLogin}
        />
      </div>

      {/* ZONA 2 — Middle: reparto equitativo de los bloques intermedios */}
      <div
        className="flex-1 min-h-0 flex flex-col justify-evenly overflow-hidden gap-[clamp(8px,2vh,20px)] px-0"
      >
        {/* Login CTA — solo portrait */}
        {showLogin && (
          <motion.section
            className="landscape:hidden flex justify-center px-6 vertical-tablet:px-8"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <LoginButton onClick={onLogin} size="sm" />
          </motion.section>
        )}

        {/* Módulos */}
        <motion.section
          className="relative"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <HomeModules modules={modules} />
        </motion.section>

        {/* Promos + Comercios:
            - portrait: stack vertical (cada sección es una fila del flex)
            - landscape: dos columnas dentro de una sola fila del flex */}
        <div className="landscape:grid landscape:grid-cols-2 landscape:gap-3 horizontal-desktop:gap-4 px-3 horizontal-desktop:px-4 contents landscape:[display:grid]">
          <PromoSection promos={promos} />
          <ComerciosSection comercios={comercios} onSeeAll={onSeeAllComercios} />
        </div>
      </div>

      {/* ZONA 3 — Tabs fijas abajo */}
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

export default HomeContent;
