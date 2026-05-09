import { motion } from "framer-motion";
import HomeModules, { type HomeModule } from "./HomeModules";
import HomeHero from "./HomeHero";
import PromoSection from "./PromoSection";
import ComerciosSection from "./ComerciosSection";
import BottomTabs, { type HomeTab } from "./BottomTabs";
import LoginButton from "./LoginButton";
import UserGreeting from "./UserGreeting";
import type { Promo } from "@/types/promo";
import type { Comercio } from "@/types/comercio";

/**
 * HomeContent — layout interno del Home reutilizado por el frame
 * portrait y el frame landscape de la página. Compone el hero, los
 * módulos, las secciones de promos y comercios y la tab bar.
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
      {/* Body — sin scroll: hero arriba (shrink-0), middle flex justify-evenly, tabs abajo */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col relative horizontal-mobile:!pt-[clamp(48px,12dvh,72px)] horizontal-desktop:pt-[clamp(64px,13dvh,96px)]">
        <HomeHero
          cityName={cityName}
          hasAlerts={hasAlerts}
          onToggleAlerts={onToggleAlerts}
          showLogin={showLogin}
          onLogin={onLogin}
        />

        {/* Middle: pegado arriba, sin padding/margin/gap */}
        <div className="flex-1 min-h-0 flex flex-col justify-evenly gap-0 overflow-hidden relative z-10 px-[15px] horizontal-mobile:px-[clamp(8px,1.5vw,14px)] horizontal-mobile:pb-[clamp(4px,1dvh,10px)] horizontal-desktop:px-[clamp(20px,2.5vw,36px)] horizontal-desktop:pb-[clamp(12px,2.5dvh,24px)] border border-black">
          {/* Login CTA solo portrait */}
          {showLogin && (
            <motion.section
              className="landscape:hidden flex justify-center shrink-0 !m-0 !p-0 border border-black"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
            >
              <LoginButton onClick={onLogin} size="sm" />
            </motion.section>
          )}

          {/* TODO(auth): renderizar solo cuando haya sesión activa.
              Por ahora siempre visible para validar maquetación. */}
          <motion.section
            className="flex justify-start shrink-0 !m-0 !p-0 border border-black"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <UserGreeting name="Albert" points={1259} nextLevel={3000} />
          </motion.section>

          {/* MÓDULOS */}
          <motion.section
            className="shrink-0 m-0 p-0 landscape:col-span-2 border border-black"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <HomeModules modules={modules} />
          </motion.section>

          {/* Portrait: hermanos directos para que justify-evenly reparta espacio igual */}
          <div className="landscape:hidden border border-black">
            <PromoSection promos={promos} />
          </div>
          <div className="landscape:hidden border border-black">
            <ComerciosSection comercios={comercios} onSeeAll={onSeeAllComercios} />
          </div>

          {/* Landscape: grid 2 columnas */}
          <div className="hidden landscape:grid landscape:flex-1 landscape:min-h-0 landscape:grid-cols-2 landscape:gap-3 horizontal-desktop:gap-4 m-0 p-0">
            <div className="border border-black">
              <PromoSection promos={promos} />
            </div>
            <div className="border border-black">
              <ComerciosSection comercios={comercios} onSeeAll={onSeeAllComercios} />
            </div>
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

export default HomeContent;
