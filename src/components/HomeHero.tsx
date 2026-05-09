import { motion } from "framer-motion";
import Km0Logo from "./Km0Logo";
import NotificationBell from "./NotificationBell";
import LoginButton from "./LoginButton";
import skylineMalgrat from "@/assets/skyline-malgrat.png";
import coatMalgrat from "@/assets/coat-malgrat.png";

/**
 * HomeHero — header superior del Home con escudo del municipio,
 * nombre, logo KM0, botón "Iniciar sesión" (landscape) y campana
 * de notificaciones. Sirve como fondo del scroll body en landscape.
 */
export interface HomeHeroProps {
  cityName: string;
  hasAlerts: boolean;
  onToggleAlerts: () => void;
  showLogin: boolean;
  onLogin: () => void;
}

const HomeHero = ({
  cityName,
  hasAlerts,
  onToggleAlerts,
  showLogin,
  onLogin,
}: HomeHeroProps) => {
  return (
    <motion.section
      className="relative horizontal-mobile:absolute horizontal-mobile:inset-0 horizontal-mobile:pointer-events-none horizontal-desktop:absolute horizontal-desktop:inset-0 horizontal-desktop:pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Fondo del header: gradiente beige cálido. */}
      <div className="relative w-full aspect-[1920/716] bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 my-[5px] horizontal-mobile:!aspect-auto horizontal-mobile:h-full horizontal-mobile:my-0 horizontal-desktop:!aspect-auto horizontal-desktop:h-full horizontal-desktop:my-0" />

      {/* Skyline del municipio */}
      <img
        src={skylineMalgrat}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 w-full h-full object-contain object-bottom z-0 select-none opacity-25 horizontal-mobile:!inset-auto horizontal-mobile:!top-[4%] horizontal-mobile:!left-0 horizontal-mobile:!right-0 horizontal-mobile:!h-[70%] horizontal-mobile:!w-full horizontal-mobile:object-top horizontal-desktop:!inset-auto horizontal-desktop:!top-[4%] horizontal-desktop:!left-0 horizontal-desktop:!right-0 horizontal-desktop:!h-[70%] horizontal-desktop:!w-full horizontal-desktop:object-top"
      />

      {/* Overlay: escudo + nombre + KM0 logo + login + bell */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between pl-2 pr-4 pt-4 gap-3 horizontal-mobile:pointer-events-auto horizontal-mobile:pt-2 horizontal-mobile:pl-3 horizontal-mobile:pr-3 horizontal-desktop:pointer-events-auto">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={coatMalgrat}
            alt={`Escudo de ${cityName}`}
            className="w-12 h-12 vertical-tablet:w-14 vertical-tablet:h-14 horizontal-mobile:!w-9 horizontal-mobile:!h-9 object-contain shrink-0 drop-shadow-[0_2px_4px_hsl(0_0%_100%/0.5)]"
          />
          <div className="flex flex-col leading-[0.95] min-w-0 horizontal-mobile:!flex-row horizontal-mobile:items-center horizontal-mobile:gap-2">
            <h1 className="font-brand font-black text-km0-blue-700 whitespace-pre-line text-left border-0 text-lg horizontal-mobile:!text-sm horizontal-mobile:whitespace-nowrap">
              {cityName}
            </h1>
            <div className="flex items-center mt-2 horizontal-mobile:!mt-0">
              <Km0Logo className="h-4 vertical-tablet:h-5 horizontal-mobile:!h-3 w-auto" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 horizontal-mobile:gap-1.5">
          {showLogin && (
            <button
              type="button"
              onClick={onLogin}
              className="hidden landscape:inline-flex font-ui font-bold text-km0-blue-700 bg-km0-yellow-500 hover:bg-km0-yellow-400 active:scale-95 transition-all rounded-full horizontal-mobile:!text-[11px] horizontal-mobile:!px-2.5 horizontal-mobile:!py-1 horizontal-desktop:text-sm horizontal-desktop:px-4 horizontal-desktop:py-2 shadow-[0_4px_12px_-4px_hsl(var(--km0-blue-700)/0.3)] whitespace-nowrap"
            >
              Iniciar sesión
            </button>
          )}
          <NotificationBell
            hasAlerts={hasAlerts}
            onClick={onToggleAlerts}
            ariaLabel={hasAlerts ? "Tienes notificaciones nuevas" : "Sin notificaciones"}
            className="shrink-0"
          />
        </div>
      </div>
    </motion.section>
  );
};

export default HomeHero;
