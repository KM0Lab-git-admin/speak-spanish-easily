import { useState } from "react";
import { motion } from "framer-motion";
import Km0Logo from "@/components/Km0Logo";
import NotificationBell from "@/components/NotificationBell";
import HomeModules, { type HomeModule } from "@/components/HomeModules";
import coatMalgrat from "@/assets/coat-malgrat.png";

/* Demo data — mezcla activo/inactivo para validar ambos estados */
const MODULES_3: HomeModule[] = [
  { id: "chat", label: "KM0 CHAT", active: true },
  { id: "punts", label: "Punts", active: true },
  { id: "cupons", label: "Cupons", active: false },
];

const MODULES_4: HomeModule[] = [
  { id: "chat", label: "KM0 CHAT", active: true },
  { id: "agenda", label: "Agenda", active: true },
  { id: "punts", label: "Punts", active: false },
  { id: "cupons", label: "Cupons", active: true },
];

const MODULES_5: HomeModule[] = [
  { id: "chat", label: "KM0 CHAT", active: true },
  { id: "agenda", label: "Agenda", active: true },
  { id: "punts", label: "Punts", active: true },
  { id: "cupons", label: "Cupons", active: false },
  { id: "comerc", label: "Comerç", active: true },
];

/**
 * Home — pantalla principal post-onboarding (sin registro).
 *
 * Construcción incremental: por ahora solo la cabecera.
 *  - Halo azul + fondo beige (mismo tratamiento que el resto de pantallas).
 *  - Header reutiliza la estructura del Chat:
 *      [escudo del pueblo]  [Nombre del pueblo + logo KM0 LAB]  [campana]
 *  - La campana hace toggle entre estado activo (con alerta coral) e inactivo
 *    para poder validar ambos estados en vivo.
 */
const Home = () => {
  const cityName = "Malgrat de Mar";
  const [hasAlerts, setHasAlerts] = useState(true);

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 p-3 sm:p-4">
      {/* ── PORTRAIT (vertical-mobile / vertical-tablet) ─────── */}
      {/* Mismo marco "móvil" que BrandedFrame: ratio 9:19.5, halo azul */}
      <div
        className="landscape:hidden flex flex-col bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden"
        style={{
          width: "min(calc(100vw - 1.5rem), calc((100dvh - 1.5rem) * 9 / 19.5), 420px)",
          height: "min(calc(100dvh - 1.5rem), calc((100vw - 1.5rem) * 19.5 / 9), calc(420px * 19.5 / 9))",
        }}
      >
        {/* Header */}
        <motion.header
          className="flex items-center gap-3 px-4 pt-4 pb-3 shrink-0"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HeaderContent
            cityName={cityName}
            hasAlerts={hasAlerts}
            onToggleAlerts={() => setHasAlerts((v) => !v)}
          />
        </motion.header>

        {/* Body — propuesta de los 3 layouts (3 / 4 / 5 módulos) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-5">
          <ModulesShowcase />
        </div>
      </div>

      {/* ── LANDSCAPE (horizontal-mobile / horizontal-desktop) ─ */}
      {/* Mismo marco 16:9 que BrandedFrame */}
      <div
        className="hidden landscape:flex bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden flex-col"
        style={{
          width: "min(calc(100vw - 2rem), calc((100dvh - 2rem) * 16 / 9), 1200px)",
          height: "min(calc(100dvh - 2rem), calc((100vw - 2rem) * 9 / 16), calc(1200px * 9 / 16))",
        }}
      >
        <motion.header
          className="flex items-center gap-3 px-4 horizontal-desktop:px-6 pt-3 pb-2 horizontal-desktop:pt-4 horizontal-desktop:pb-3 shrink-0 border-b border-km0-beige-200"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <HeaderContent
            cityName={cityName}
            hasAlerts={hasAlerts}
            onToggleAlerts={() => setHasAlerts((v) => !v)}
            compact
          />
        </motion.header>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 horizontal-desktop:px-8 py-4 space-y-4">
          <ModulesShowcase compact />
        </div>
      </div>
    </div>
  );
};

interface HeaderContentProps {
  cityName: string;
  hasAlerts: boolean;
  onToggleAlerts: () => void;
  compact?: boolean;
}

/**
 * Cabecera de la Home — calcada en estructura a la del Chat para
 * mantener consistencia visual:
 *   [izquierda] escudo del pueblo (en lugar del back button)
 *   [centro]    nombre del pueblo + logo KM0 LAB
 *   [derecha]   campana con toggle de alertas
 */
const HeaderContent = ({ cityName, hasAlerts, onToggleAlerts, compact = false }: HeaderContentProps) => {
  const shieldSize = compact ? "w-14 h-14" : "w-16 h-16";

  return (
    <>
      {/* Bloque marca: escudo + (nombre pueblo / KM0 LAB) pegados a la izquierda */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div
          className={`${shieldSize} flex items-center justify-center shrink-0`}
          aria-label={`Escudo de ${cityName}`}
        >
          <img
            src={coatMalgrat}
            alt={`Escudo de ${cityName}`}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col min-w-0 leading-none">
          <h1 className="font-brand text-2xl vertical-tablet:text-3xl horizontal-mobile:text-xl font-black text-km0-blue-700 truncate">
            {cityName}
          </h1>
          <div className="flex items-center mt-1">
            <Km0Logo className="h-4 vertical-tablet:h-5 horizontal-mobile:h-3.5 w-auto" />
          </div>
        </div>
      </div>

      {/* Campana — clickable, alterna estado activo / inactivo */}
      <NotificationBell
        hasAlerts={hasAlerts}
        onClick={onToggleAlerts}
        ariaLabel={hasAlerts ? "Tienes notificaciones nuevas" : "Sin notificaciones"}
      />
    </>
  );
};


/* ─── Showcase temporal: muestra los 3 layouts a la vez ─────────
   Permite validar visualmente las variantes 3 / 4 / 5 módulos
   y los estados activo/inactivo. Se eliminará cuando se decida la
   variante final y se conecte a datos reales. */
const ModulesShowcase = ({ compact = false }: { compact?: boolean }) => (
  <>
    <ShowcaseGroup title="3 mòduls" subtitle="Estat ideal · fila única">
      <HomeModules modules={MODULES_3} />
    </ShowcaseGroup>
    <ShowcaseGroup title="4 mòduls" subtitle="Fila única · escaneig ràpid">
      <HomeModules modules={MODULES_4} />
    </ShowcaseGroup>
    <ShowcaseGroup
      title="5 mòduls"
      subtitle="Solució jeràrquica · primaris a dalt"
    >
      <HomeModules modules={MODULES_5} />
    </ShowcaseGroup>
    {compact ? null : null}
  </>
);

const ShowcaseGroup = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-2">
    <header className="px-1">
      <h2 className="font-brand text-lg font-black text-km0-blue-700 leading-none">
        {title}
      </h2>
      <p className="font-body text-xs text-muted-foreground mt-0.5">
        {subtitle}
      </p>
    </header>
    {children}
  </section>
);

export default Home;

