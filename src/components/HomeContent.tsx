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
      {/* Scroll body — incluye hero, módulos, CTAs, promos, comercios */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-[clamp(0rem,2.5vw,0.75rem)] vertical-mobile:overflow-hidden vertical-mobile:flex vertical-mobile:flex-col horizontal-mobile:relative horizontal-mobile:overflow-hidden horizontal-mobile:flex horizontal-mobile:flex-col horizontal-desktop:relative horizontal-desktop:overflow-hidden horizontal-desktop:flex horizontal-desktop:flex-col horizontal-mobile:!pt-7 horizontal-desktop:pt-[clamp(56px,12dvh,80px)]">
        <HomeHero
          cityName={cityName}
          hasAlerts={hasAlerts}
          onToggleAlerts={onToggleAlerts}
          showLogin={showLogin}
          onLogin={onLogin}
        />

        {/* Login CTA solo portrait — encima de los módulos */}
        {showLogin && (
          <motion.section
            className="landscape:hidden flex justify-center px-4 mt-1 vertical-tablet:mt-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <LoginButton onClick={onLogin} size="sm" />
          </motion.section>
        )}

        {/* MÓDULOS: card que monta sobre el hero (overlap) */}
        <motion.section
          className="-mt-6 relative z-10 horizontal-mobile:mt-0 horizontal-desktop:mt-0"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <HomeModules modules={modules} />
        </motion.section>

        {/* Wrapper landscape: promos + recomendado en 2 columnas */}
        <div className="relative z-10 horizontal-mobile:grid horizontal-mobile:grid-cols-2 horizontal-mobile:gap-2 horizontal-mobile:px-3 horizontal-mobile:!mt-2 horizontal-mobile:flex-1 horizontal-mobile:min-h-0 horizontal-mobile:items-stretch horizontal-mobile:pb-2 horizontal-desktop:grid horizontal-desktop:grid-cols-2 horizontal-desktop:gap-4 horizontal-desktop:px-4 horizontal-desktop:mt-4 horizontal-desktop:flex-1 horizontal-desktop:min-h-0 horizontal-desktop:items-stretch horizontal-desktop:pb-4">
          <PromoSection promos={promos} />

          {/* Spacer flex 3 — solo en vertical-mobile */}
          <div className="hidden vertical-mobile:block vertical-mobile:flex-1" aria-hidden />

          <ComerciosSection comercios={comercios} onSeeAll={onSeeAllComercios} />
        </div>

        {/* Spacer final */}
        <div className="h-[clamp(0.25rem,2vw,1.5rem)] vertical-mobile:h-0 vertical-mobile:flex-1 horizontal-mobile:hidden horizontal-desktop:hidden" aria-hidden />
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
