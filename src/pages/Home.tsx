import { useState } from "react";
import { motion } from "framer-motion";
import { UserRound, UserRoundPlus, ChevronRight, ArrowRight, Home as HomeIcon, Info, Tag, User } from "lucide-react";
import Km0Logo from "@/components/Km0Logo";
import NotificationBell from "@/components/NotificationBell";
import HomeModules, { type HomeModule, type HomeModuleId } from "@/components/HomeModules";
import skylineMalgrat from "@/assets/skyline-malgrat.png";
import coatMalgrat from "@/assets/coat-malgrat.png";
import { cn } from "@/lib/utils";

/* Módulos demo — cada uno togglea su estado activo/inactivo al click. */
const INITIAL_MODULES_3: HomeModule[] = [
  { id: "chat", label: "KM0 CHAT", active: true },
];

/* Comerciantes mock — placeholders circulares con iniciales. */
const COMERCIOS = [
  { id: "sanait", name: "Sanait", color: "bg-km0-teal-100", text: "text-km0-teal-700" },
  { id: "vidal",  name: "Vidal m...", color: "bg-km0-beige-200", text: "text-km0-blue-800" },
  { id: "manit",  name: "Manitas", color: "bg-km0-yellow-300", text: "text-km0-blue-800" },
  { id: "champ",  name: "Champa...", color: "bg-km0-blue-100", text: "text-km0-blue-800" },
  { id: "anna",   name: "Anna",    color: "bg-km0-coral-400/80", text: "text-white" },
];

const Home = () => {
  const cityName = "Malgrat de Mar";
  const [hasAlerts, setHasAlerts] = useState(true);
  const [modules, setModules] = useState<HomeModule[]>(INITIAL_MODULES_3);
  const [activeTab, setActiveTab] = useState<"home" | "info" | "ofertes" | "perfil">("home");

  const toggleModule = (id: HomeModuleId) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));
  };

  const modulesWithHandlers: HomeModule[] = modules.map((m) => ({
    ...m,
    onClick: () => toggleModule(m.id),
  }));

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 p-3 sm:p-4">
      {/* ── PORTRAIT ─────────────────────────────────────────── */}
      <div
        className="landscape:hidden flex flex-col bg-km0-beige-50 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden relative"
        style={{
          width: "min(calc(100vw - 1.5rem), calc((100dvh - 1.5rem) * 9 / 19.5), 420px)",
          height: "min(calc(100dvh - 1.5rem), calc((100vw - 1.5rem) * 19.5 / 9), calc(420px * 19.5 / 9))",
        }}
      >
        <HomeContent
          cityName={cityName}
          hasAlerts={hasAlerts}
          onToggleAlerts={() => setHasAlerts((v) => !v)}
          modules={modulesWithHandlers}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* ── LANDSCAPE ────────────────────────────────────────── */}
      <div
        className="hidden landscape:flex bg-km0-beige-50 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden flex-col relative"
        style={{
          width: "min(calc(100vw - 2rem), calc((100dvh - 2rem) * 16 / 9), 1200px)",
          height: "min(calc(100dvh - 2rem), calc((100vw - 2rem) * 9 / 16), calc(1200px * 9 / 16))",
        }}
      >
        <HomeContent
          cityName={cityName}
          hasAlerts={hasAlerts}
          onToggleAlerts={() => setHasAlerts((v) => !v)}
          modules={modulesWithHandlers}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          landscape
        />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   HomeContent — toda la pantalla en un único componente para
   reutilizar entre portrait y landscape. La estructura no cambia
   entre breakpoints, solo el padding del contenedor exterior.
   ───────────────────────────────────────────────────────────── */
interface HomeContentProps {
  cityName: string;
  hasAlerts: boolean;
  onToggleAlerts: () => void;
  modules: HomeModule[];
  activeTab: "home" | "info" | "ofertes" | "perfil";
  onTabChange: (t: "home" | "info" | "ofertes" | "perfil") => void;
  landscape?: boolean;
}

const HomeContent = ({
  cityName,
  hasAlerts,
  onToggleAlerts,
  modules,
  activeTab,
  onTabChange,
  landscape = false,
}: HomeContentProps) => {
  return (
    <>
      {/* Scroll body — incluye hero, módulos overlap, CTAs, promos, comercios */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-2">
        {/* ── HERO con ilustración del pueblo ── */}
        <motion.section
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Fondo del header: gradiente beige cálido. Su altura se adapta a la
              proporción real del skyline (≈1920x720 → aspect-[8/3]). */}
          <div className="relative w-full aspect-[8/3] bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 my-[10px]" />

          {/* Skyline full-width de Malgrat, anclado al borde inferior del header.
              Su base sobresale ligeramente para quedar tapada por la banda azul
              de los módulos (que tiene z-10). */}
          <img
            src={skylineMalgrat}
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-0 w-full h-auto z-0 select-none opacity-25"
          />

          {/* Overlay: escudo + nombre + logo arriba-izquierda, campana arriba-derecha */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between pl-2 pr-4 pt-4 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={coatMalgrat}
                alt={`Escudo de ${cityName}`}
                className="w-12 h-12 vertical-tablet:w-14 vertical-tablet:h-14 object-contain shrink-0 drop-shadow-[0_2px_4px_hsl(0_0%_100%/0.5)]"
              />
              <div className="flex flex-col leading-[0.95] min-w-0">
                <h1 className="font-brand font-black text-km0-blue-700 whitespace-pre-line text-left border-0 text-lg">
                  {"Malgrat de Mar"}
                </h1>
                <div className="flex items-center mt-2">
                  <Km0Logo className="h-4 vertical-tablet:h-5 w-auto" />
                </div>
              </div>
            </div>

            <NotificationBell
              hasAlerts={hasAlerts}
              onClick={onToggleAlerts}
              ariaLabel={hasAlerts ? "Tienes notificaciones nuevas" : "Sin notificaciones"}
              className="shrink-0"
            />
          </div>
        </motion.section>

        {/* ── MÓDULOS: card que monta sobre el hero (overlap) ── */}
        <motion.section
          className="-mt-10 relative z-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <HomeModules modules={modules} />
        </motion.section>

        {/* ── CTAs Auth ── */}
        <motion.section
          className="px-4 mt-5 grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          <AuthButton variant="primary" icon={<UserRound size={18} strokeWidth={2.2} />}>
            Iniciar sesión
          </AuthButton>
          <AuthButton variant="secondary" icon={<UserRoundPlus size={18} strokeWidth={2.2} />}>
            Registro
          </AuthButton>
        </motion.section>

        {/* ── Promos i events destacats ── */}
        <motion.section
          className="px-4 mt-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
        >
          <h2 className="font-brand text-base font-black text-km0-blue-700 mb-2">
            Promos y eventos destacados
          </h2>

          {/* Hero card placeholder — gradient con título tipo cartel */}
          <div className="relative rounded-2xl overflow-hidden shadow-[0_10px_24px_-12px_hsl(var(--km0-blue-700)/0.35)] aspect-[16/9] bg-gradient-to-br from-km0-blue-700 via-km0-blue-600 to-km0-blue-800">
            {/* Decoración: círculos de "fuegos artificiales" */}
            <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-km0-yellow-400 shadow-[0_0_12px_hsl(var(--km0-yellow-400))]" />
            <div className="absolute top-6 left-12 w-1.5 h-1.5 rounded-full bg-km0-coral-400" />
            <div className="absolute top-4 right-16 w-2 h-2 rounded-full bg-km0-yellow-400 shadow-[0_0_12px_hsl(var(--km0-yellow-400))]" />
            <div className="absolute top-10 right-6 w-1.5 h-1.5 rounded-full bg-white" />

            {/* Texto principal */}
            <div className="absolute inset-0 flex flex-col justify-center px-5">
              <span className="font-brand text-2xl vertical-tablet:text-3xl font-black text-km0-yellow-400 leading-none">
                FESTA
              </span>
              <span className="font-brand text-3xl vertical-tablet:text-4xl font-black text-white leading-none mt-1">
                MAJOR
              </span>
              <span className="font-brand text-2xl vertical-tablet:text-3xl font-black text-km0-coral-400 leading-none mt-1">
                ROMANA
              </span>
              <span className="font-ui text-xs text-white/90 mt-2 tracking-wider">
                {"MALGRAT DE MAR · 2026"}
              </span>
            </div>

            {/* Botón siguiente */}
            <button
              type="button"
              aria-label="Siguiente promo"
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center active:scale-95 transition-transform"
            >
              <ChevronRight size={18} className="text-km0-blue-700" strokeWidth={2.4} />
            </button>
          </div>

          {/* Dots de paginación */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  "rounded-full transition-all",
                  i === 0
                    ? "w-5 h-1.5 bg-km0-blue-700"
                    : "w-1.5 h-1.5 bg-km0-blue-700/25",
                )}
              />
            ))}
          </div>
        </motion.section>

        {/* ── Comerciantes populares ── */}
        <motion.section
          className="px-4 mt-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.34 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-brand text-base font-black text-km0-blue-700">
              Comercios populares
            </h2>
            <button
              type="button"
              className="font-ui text-xs font-bold text-km0-coral-400 flex items-center gap-1 active:scale-95 transition-transform"
            >
              Ver todos
              <ArrowRight size={14} strokeWidth={2.4} />
            </button>
          </div>

          {/* Scroll horizontal de avatares */}
          <div
            className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4"
            style={{ scrollbarWidth: "none" }}
          >
            {COMERCIOS.map((c) => (
              <div key={c.id} className="flex flex-col items-center shrink-0 w-16">
                <div
                  className={cn(
                    "w-14 h-14 rounded-full shadow-sm border-2 border-white flex items-center justify-center font-brand font-black text-base",
                    c.color,
                    c.text,
                  )}
                  aria-hidden
                >
                  {c.name.charAt(0)}
                </div>
                <span className="font-body text-[10px] text-km0-blue-800 mt-1.5 truncate w-full text-center">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Spacer para que el último contenido no quede pegado a la tab bar */}
        <div className="h-4" />
      </div>

      {/* ── Tab bar inferior (fixed dentro del frame) ── */}
      <nav
        className="shrink-0 bg-white border-t border-km0-beige-200 px-2 pt-2 pb-3 grid grid-cols-4"
        aria-label="Navegación principal"
      >
        <TabItem
          icon={<HomeIcon size={20} strokeWidth={2.2} />}
          label="Inicio"
          active={activeTab === "home"}
          onClick={() => onTabChange("home")}
        />
        <TabItem
          icon={<Info size={20} strokeWidth={2.2} />}
          label="Información"
          active={activeTab === "info"}
          onClick={() => onTabChange("info")}
        />
        <TabItem
          icon={<Tag size={20} strokeWidth={2.2} />}
          label="Ofertas"
          active={activeTab === "ofertes"}
          onClick={() => onTabChange("ofertes")}
        />
        <TabItem
          icon={<User size={20} strokeWidth={2.2} />}
          label="Perfil"
          active={activeTab === "perfil"}
          onClick={() => onTabChange("perfil")}
        />
      </nav>
    </>
  );
};

/* ─── AuthButton ─────────────────────────────────────────────── */
interface AuthButtonProps {
  variant: "primary" | "secondary";
  icon: React.ReactNode;
  children: React.ReactNode;
}
const AuthButton = ({ variant, icon, children }: AuthButtonProps) => (
  <button
    type="button"
    className={cn(
      "flex items-center gap-2 px-3 py-3 rounded-2xl font-ui font-bold text-sm transition-transform active:scale-[0.97] shadow-[0_6px_16px_-8px_hsl(var(--km0-blue-700)/0.35)]",
      variant === "primary"
        ? "bg-km0-blue-700 text-white"
        : "bg-km0-yellow-500 text-km0-blue-800",
    )}
  >
    <span
      className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
        variant === "primary" ? "bg-white/15" : "bg-km0-blue-700/10",
      )}
    >
      {icon}
    </span>
    <span className="truncate">{children}</span>
  </button>
);

/* ─── TabItem ────────────────────────────────────────────────── */
interface TabItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}
const TabItem = ({ icon, label, active, onClick }: TabItemProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className="flex flex-col items-center gap-0.5 py-1 active:scale-95 transition-transform"
  >
    <span
      className={cn(
        "transition-colors",
        active ? "text-km0-blue-700" : "text-km0-blue-800/40",
      )}
    >
      {icon}
    </span>
    <span
      className={cn(
        "font-ui text-[10px] leading-none",
        active ? "font-bold text-km0-blue-700" : "text-km0-blue-800/55",
      )}
    >
      {label}
    </span>
  </button>
);

export default Home;
