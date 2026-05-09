import { motion } from "framer-motion";
import Km0Logo from "./Km0Logo";
import NotificationBell from "./NotificationBell";
import LoginButton from "./LoginButton";
import skylineMalgrat from "@/assets/skyline-malgrat.png";
import coatMalgrat from "@/assets/coat-malgrat.png";

/**
 * HomeHero — franja superior FIJA del Home (no scrollea).
 * Contiene escudo del municipio, nombre, logo KM0, botón
 * "Iniciar sesión" (solo landscape) y campana de notificaciones.
 *
 * En todas las orientaciones es una banda con altura natural
 * controlada por su padding, no un fondo absoluto. El layout de
 * 3 zonas (hero / middle / tabs) se monta en HomeContent.
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
      className="relative w-full overflow-hidden bg-gradient-to-b from-km0-beige-50 to-km0-beige-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Skyline de fondo */}
      <img
        src={skylineMalgrat}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-full object-contain object-bottom z-0 select-none opacity-25"
      />

      {/* Overlay: escudo + nombre + KM0 + login + bell */}
      <div className="relative z-10 flex items-center justify-between pl-2 pr-4 py-3 gap-3 horizontal-mobile:py-2 horizontal-mobile:pl-3 horizontal-mobile:pr-3 horizontal-desktop:py-3">
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
            <LoginButton
              onClick={onLogin}
              size="md"
              className="hidden landscape:inline-flex horizontal-mobile:!text-[11px] horizontal-mobile:!px-2.5 horizontal-mobile:!py-1"
            />
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
