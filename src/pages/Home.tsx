import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Home as HomeIcon, Info, Tag, User, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import Km0Logo from "@/components/Km0Logo";
import NotificationBell from "@/components/NotificationBell";
import HomeModules, { type HomeModule, type HomeModuleId } from "@/components/HomeModules";
import NotificationsOverlay from "@/components/NotificationsOverlay";
import { useNotifications } from "@/hooks/useNotifications";
import skylineMalgrat from "@/assets/skyline-malgrat.png";
import coatMalgrat from "@/assets/coat-malgrat.png";
import couponIcon from "@/assets/coupon-icon.png";
import shopBakery from "@/assets/shop-logos/shop-bakery.png";
import shopFlorist from "@/assets/shop-logos/shop-florist.png";
import shopHardware from "@/assets/shop-logos/shop-hardware.png";
import shopWine from "@/assets/shop-logos/shop-wine.png";
import shopFashion from "@/assets/shop-logos/shop-fashion.png";
import shopCafe from "@/assets/shop-logos/shop-cafe.png";
import shopPharmacy from "@/assets/shop-logos/shop-pharmacy.png";
import { cn } from "@/lib/utils";

/* Módulos demo — cada uno togglea su estado activo/inactivo al click. */
const INITIAL_MODULES_3: HomeModule[] = [
  { id: "chat", label: "KM0 CHAT", active: true },
  { id: "agenda", label: "Agenda", active: true },
  { id: "ajuntament", label: "Ayuntamiento", active: true },
  { id: "comerc", label: "Comercios", active: true },
];

/* Comerciantes mock — logos generados para sensación de tiendas reales. */
interface Comercio {
  id: string;
  name: string;
  logo: string;
  bg: string;
}
const COMERCIOS: Comercio[] = [
  { id: "sanait",  name: "Sanait",    logo: shopBakery,   bg: "bg-km0-teal-50" },
  { id: "vidal",   name: "Vidal",     logo: shopFlorist,  bg: "bg-km0-beige-100" },
  { id: "manit",   name: "Manitas",   logo: shopHardware, bg: "bg-km0-yellow-100" },
  { id: "champ",   name: "Champa",    logo: shopWine,     bg: "bg-km0-blue-50" },
  { id: "anna",    name: "Anna",      logo: shopFashion,  bg: "bg-km0-coral-100" },
  { id: "cafemar", name: "Cafè Mar",  logo: shopCafe,     bg: "bg-km0-beige-100" },
  { id: "farma",   name: "Farma+",    logo: shopPharmacy, bg: "bg-km0-teal-50" },
];

/* Promos mock — placeholders demo con distintos colores y títulos. */
interface Promo {
  id: string;
  title1: { text: string; color: string };
  title2: { text: string; color: string };
  title3: { text: string; color: string };
  subtitle: string;
  gradient: string;
}
const PROMOS: Promo[] = [
  {
    id: "festa-major",
    title1: { text: "FESTA", color: "text-km0-yellow-400" },
    title2: { text: "MAJOR", color: "text-white" },
    title3: { text: "ROMANA", color: "text-km0-coral-400" },
    subtitle: "MALGRAT DE MAR · 2026",
    gradient: "from-km0-blue-700 via-km0-blue-600 to-km0-blue-800",
  },
  {
    id: "mercat-nit",
    title1: { text: "MERCAT", color: "text-white" },
    title2: { text: "DE NIT", color: "text-km0-yellow-400" },
    title3: { text: "ESTIU", color: "text-km0-beige-100" },
    subtitle: "PASSEIG MARÍTIM · JULIOL",
    gradient: "from-km0-teal-600 via-km0-teal-500 to-km0-blue-700",
  },
  {
    id: "concert",
    title1: { text: "CONCERT", color: "text-km0-blue-800" },
    title2: { text: "JAZZ", color: "text-white" },
    title3: { text: "PLAÇA", color: "text-km0-blue-800" },
    subtitle: "PLAÇA CATALUNYA · SETEMBRE",
    gradient: "from-km0-yellow-400 via-km0-yellow-500 to-km0-coral-400",
  },
  {
    id: "fira",
    title1: { text: "FIRA", color: "text-white" },
    title2: { text: "GASTRO", color: "text-km0-yellow-400" },
    title3: { text: "KM0", color: "text-white" },
    subtitle: "CENTRE HISTÒRIC · OCTUBRE",
    gradient: "from-km0-coral-400 via-km0-coral-500 to-km0-blue-700",
  },
];

const Home = () => {
  const cityName = "Malgrat de Mar";
  const { notifications, hasUnread, markRead, markAllRead } = useNotifications();
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const showLogin = !authLoading && !user;
  const showLogout = !authLoading && !!user;
  const handleLogout = async () => {
    await signOut();
    toast.success("Sesión cerrada");
  };
  const openNotifications = () => {
    setNotifOpen(true);
    markAllRead();
  };
  const [notifOpen, setNotifOpen] = useState(false);
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
          hasAlerts={hasUnread}
          onToggleAlerts={() => setNotifOpen(true)}
          modules={modulesWithHandlers}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showLogin={showLogin}
          onLogin={() => navigate("/login")}
        />
        <NotificationsOverlay
          open={notifOpen}
          notifications={notifications}
          onClose={() => setNotifOpen(false)}
          onMarkRead={markRead}
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
          hasAlerts={hasUnread}
          onToggleAlerts={() => setNotifOpen(true)}
          modules={modulesWithHandlers}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showLogin={showLogin}
          onLogin={() => navigate("/login")}
          landscape
        />
        <NotificationsOverlay
          open={notifOpen}
          notifications={notifications}
          onClose={() => setNotifOpen(false)}
          onMarkRead={markRead}
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
  showLogin: boolean;
  onLogin: () => void;
  landscape?: boolean;
}

const HomeContent = ({
  cityName,
  hasAlerts,
  onToggleAlerts,
  modules,
  activeTab,
  onTabChange,
  showLogin,
  onLogin,
  landscape = false,
}: HomeContentProps) => {
  return (
    <>
      {/* Scroll body — incluye hero, módulos overlap, CTAs, promos, comercios */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-[clamp(0rem,2.5vw,0.75rem)] vertical-mobile:overflow-hidden vertical-mobile:flex vertical-mobile:flex-col horizontal-mobile:relative horizontal-mobile:overflow-hidden horizontal-mobile:flex horizontal-mobile:flex-col horizontal-desktop:relative horizontal-desktop:overflow-hidden horizontal-desktop:flex horizontal-desktop:flex-col horizontal-mobile:!pt-7 horizontal-desktop:pt-[clamp(56px,12dvh,80px)]">
        {/* ── HERO con ilustración del pueblo ── */}
        <motion.section
          className="relative horizontal-mobile:absolute horizontal-mobile:inset-0 horizontal-mobile:pointer-events-none horizontal-desktop:absolute horizontal-desktop:inset-0 horizontal-desktop:pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Fondo del header: gradiente beige cálido. Su altura se adapta a la
              proporción real del skyline (≈1920x720 → aspect-[8/3]).
              En landscape el hero pasa a ser fondo absoluto del scroll body
              y el div ocupa toda la altura disponible. */}
          <div className="relative w-full aspect-[1920/716] bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 my-[5px] horizontal-mobile:!aspect-auto horizontal-mobile:h-full horizontal-mobile:my-0 horizontal-desktop:!aspect-auto horizontal-desktop:h-full horizontal-desktop:my-0" />

          {/* Skyline full-width de Malgrat. Su contenedor padre tiene exactamente
              el mismo aspect-ratio que la imagen original (1920x716), de modo
              que se ve ENTERO sin cortes. */}
          <img
            src={skylineMalgrat}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 w-full h-full object-contain object-bottom z-0 select-none opacity-25 horizontal-mobile:!inset-auto horizontal-mobile:!top-[4%] horizontal-mobile:!left-0 horizontal-mobile:!right-0 horizontal-mobile:!h-[70%] horizontal-mobile:!w-full horizontal-mobile:object-top horizontal-desktop:!inset-auto horizontal-desktop:!top-[4%] horizontal-desktop:!left-0 horizontal-desktop:!right-0 horizontal-desktop:!h-[70%] horizontal-desktop:!w-full horizontal-desktop:object-top"
          />

          {/* Overlay: escudo + nombre + logo arriba-izquierda, campana arriba-derecha */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between pl-2 pr-4 pt-4 gap-3 horizontal-mobile:pointer-events-auto horizontal-mobile:pt-2 horizontal-mobile:pl-3 horizontal-mobile:pr-3 horizontal-desktop:pointer-events-auto">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={coatMalgrat}
                alt={`Escudo de ${cityName}`}
                className="w-12 h-12 vertical-tablet:w-14 vertical-tablet:h-14 horizontal-mobile:!w-9 horizontal-mobile:!h-9 object-contain shrink-0 drop-shadow-[0_2px_4px_hsl(0_0%_100%/0.5)]"
              />
              <div className="flex flex-col leading-[0.95] min-w-0 horizontal-mobile:!flex-row horizontal-mobile:items-center horizontal-mobile:gap-2">
                <h1 className="font-brand font-black text-km0-blue-700 whitespace-pre-line text-left border-0 text-lg horizontal-mobile:!text-sm horizontal-mobile:whitespace-nowrap">
                  {"Malgrat de Mar"}
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

        {/* ── Login CTA solo portrait — encima de los módulos ── */}
        {showLogin && (
          <motion.section
            className="landscape:hidden flex justify-center px-4 mt-2 vertical-tablet:mt-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <button
              type="button"
              onClick={onLogin}
              className="font-ui font-bold text-km0-blue-700 bg-km0-yellow-500 hover:bg-km0-yellow-400 active:scale-95 transition-all rounded-full text-sm px-5 py-2 vertical-tablet:text-base vertical-tablet:px-6 vertical-tablet:py-2.5 shadow-[0_4px_12px_-4px_hsl(var(--km0-blue-700)/0.3)] whitespace-nowrap"
            >
              Iniciar sesión
            </button>
          </motion.section>
        )}

        {/* ── MÓDULOS: card que monta sobre el hero (overlap) ── */}
        <motion.section
          className="-mt-8 relative z-10 horizontal-mobile:mt-0 horizontal-desktop:mt-0"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <HomeModules modules={modules} />
        </motion.section>

        {/* Spacer flex 1 — solo en vertical-mobile, reparte aire */}
        <div className="hidden vertical-mobile:block vertical-mobile:flex-1" aria-hidden />

        {/* Spacer flex 2 */}
        <div className="hidden vertical-mobile:block vertical-mobile:flex-1" aria-hidden />

        {/* ── Wrapper landscape: promos + recomendado en 2 columnas ── */}
        <div className="relative z-10 horizontal-mobile:grid horizontal-mobile:grid-cols-2 horizontal-mobile:gap-2 horizontal-mobile:px-3 horizontal-mobile:!mt-2 horizontal-mobile:flex-1 horizontal-mobile:min-h-0 horizontal-mobile:items-stretch horizontal-mobile:pb-2 horizontal-desktop:grid horizontal-desktop:grid-cols-2 horizontal-desktop:gap-4 horizontal-desktop:px-4 horizontal-desktop:mt-4 horizontal-desktop:flex-1 horizontal-desktop:min-h-0 horizontal-desktop:items-stretch horizontal-desktop:pb-4">
          {/* ── Promos i events destacats ── */}
          <motion.section
            className="px-4 mt-4 vertical-mobile:mt-0 vertical-tablet:mt-8 horizontal-mobile:px-0 horizontal-mobile:mt-0 horizontal-mobile:min-w-0 horizontal-mobile:flex horizontal-mobile:flex-col horizontal-mobile:h-full horizontal-desktop:px-0 horizontal-desktop:mt-0 horizontal-desktop:min-w-0 horizontal-desktop:flex horizontal-desktop:flex-col horizontal-desktop:h-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.26 }}
          >
            <div className="flex items-center min-h-12 mb-[clamp(0.125rem,1vw,0.875rem)] vertical-tablet:mb-3 horizontal-mobile:!mb-1 horizontal-desktop:!mb-2">
              <h2 className="font-brand font-black text-km0-blue-700 text-sm vertical-tablet:text-base horizontal-mobile:!text-xs horizontal-desktop:!text-lg">
                Promos y eventos destacados
              </h2>
            </div>
            <PromoCarousel promos={PROMOS} />
          </motion.section>

          {/* Spacer flex 3 — solo en vertical-mobile */}
          <div className="hidden vertical-mobile:block vertical-mobile:flex-1" aria-hidden />

          {/* ── Comerciantes populares ── */}
          <motion.section
            className="px-4 mt-4 vertical-mobile:mt-0 vertical-tablet:mt-8 horizontal-mobile:px-0 horizontal-mobile:mt-0 horizontal-mobile:min-w-0 horizontal-mobile:flex horizontal-mobile:flex-col horizontal-mobile:h-full horizontal-desktop:px-0 horizontal-desktop:mt-0 horizontal-desktop:min-w-0 horizontal-desktop:flex horizontal-desktop:flex-col horizontal-desktop:h-full"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.34 }}
          >
            <div className="flex items-center w-full justify-between mb-[clamp(0.125rem,1vw,0.875rem)] vertical-tablet:mb-3 horizontal-mobile:!mb-1 horizontal-desktop:!mb-2 gap-2 horizontal-mobile:!gap-1">
              <div className="flex items-center gap-2 horizontal-mobile:gap-1 min-w-0">
                <img
                  src={couponIcon}
                  alt=""
                  aria-hidden
                  width={80}
                  height={80}
                  loading="lazy"
                  className="w-12 h-12 object-contain shrink-0"
                />
                <h2 className="font-brand font-black text-km0-blue-700 whitespace-nowrap text-sm vertical-tablet:text-base horizontal-mobile:!text-xs horizontal-desktop:!text-lg">
                  Esto es para ti
                </h2>
              </div>
              <button
                type="button"
                className="font-ui font-bold text-km0-coral-400 flex items-center gap-1 active:scale-95 transition-transform shrink-0 underline underline-offset-4 text-sm vertical-tablet:text-base horizontal-mobile:!text-xs horizontal-desktop:!text-lg"
              >
                Ver todos
                <ArrowRight size={14} strokeWidth={2.4} className="horizontal-mobile:!w-3 horizontal-mobile:!h-3" />
              </button>
            </div>

            <div className="horizontal-desktop:bg-white/30 horizontal-desktop:rounded-2xl horizontal-desktop:p-3 horizontal-desktop:flex-1 horizontal-desktop:min-h-0 horizontal-desktop:w-full horizontal-desktop:flex horizontal-desktop:items-center horizontal-mobile:bg-white/30 horizontal-mobile:rounded-2xl horizontal-mobile:p-2 horizontal-mobile:flex-1 horizontal-mobile:min-h-0 horizontal-mobile:w-full horizontal-mobile:flex horizontal-mobile:items-center">
              <div className="w-full">
                <ComercioCarousel comercios={COMERCIOS} />
              </div>
            </div>
          </motion.section>
        </div>

        {/* Spacer final (flex 4 en vertical-mobile, fijo en otros breakpoints) */}
        <div className="h-[clamp(0.25rem,2vw,1.5rem)] vertical-mobile:h-0 vertical-mobile:flex-1 horizontal-mobile:hidden horizontal-desktop:hidden" aria-hidden />
      </div>

      {/* ── Tab bar inferior (fixed dentro del frame) ── */}
      <nav
        className="shrink-0 bg-white border-t border-km0-beige-200 px-2 pt-2 pb-3 grid grid-cols-4 horizontal-mobile:!pt-1 horizontal-mobile:!pb-1.5"
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

/* ─── PromoCarousel ──────────────────────────────────────────
   Carrusel de promos/eventos con flechas izq/der, dots clicables
   y soporte de swipe táctil (drag) vía framer-motion.
   ─────────────────────────────────────────────────────────── */
interface PromoCarouselProps {
  promos: Promo[];
}
const PromoCarousel = ({ promos }: PromoCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const total = promos.length;

  const goTo = (next: number) => {
    const safe = (next + total) % total;
    setDirection(safe > index || (index === total - 1 && safe === 0) ? 1 : -1);
    setIndex(safe);
  };
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const promo = promos[index];
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <>
      {/* Hero card con drag horizontal */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_10px_24px_-12px_hsl(var(--km0-blue-700)/0.35)] aspect-[2/1] vertical-tablet:aspect-[16/9] horizontal-mobile:aspect-[16/7] horizontal-mobile:flex-none horizontal-desktop:aspect-auto horizontal-desktop:flex-1 horizontal-desktop:min-h-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={promo.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) next();
              else if (info.offset.x > 50) prev();
            }}
            className={cn(
              "absolute inset-0 bg-gradient-to-br cursor-grab active:cursor-grabbing",
              promo.gradient,
            )}
          >
            {/* Decoración: círculos de "fuegos artificiales" */}
            <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-km0-yellow-400 shadow-[0_0_12px_hsl(var(--km0-yellow-400))]" />
            <div className="absolute top-6 left-12 w-1.5 h-1.5 rounded-full bg-km0-coral-400" />
            <div className="absolute top-4 right-16 w-2 h-2 rounded-full bg-km0-yellow-400 shadow-[0_0_12px_hsl(var(--km0-yellow-400))]" />
            <div className="absolute top-10 right-6 w-1.5 h-1.5 rounded-full bg-white" />

            {/* Texto principal */}
            <div className="absolute inset-0 flex flex-col justify-center px-5 pointer-events-none select-none">
              <span className={cn("font-brand text-2xl vertical-tablet:text-3xl font-black leading-none", promo.title1.color)}>
                {promo.title1.text}
              </span>
              <span className={cn("font-brand text-3xl vertical-tablet:text-4xl font-black leading-none mt-1", promo.title2.color)}>
                {promo.title2.text}
              </span>
              <span className={cn("font-brand text-2xl vertical-tablet:text-3xl font-black leading-none mt-1", promo.title3.color)}>
                {promo.title3.text}
              </span>
              <span className="font-ui text-xs text-white/90 mt-2 tracking-wider">
                {promo.subtitle}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Botón anterior — solo visible si no es el primero */}
        {!isFirst && (
          <button
            type="button"
            onClick={prev}
            aria-label="Promo anterior"
            className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center active:scale-95 hover:scale-105 transition-transform z-10"
          >
            <ChevronLeft size={18} className="text-km0-blue-700" strokeWidth={2.4} />
          </button>
        )}

        {/* Botón siguiente — solo visible si no es el último */}
        {!isLast && (
          <button
            type="button"
            onClick={next}
            aria-label="Siguiente promo"
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center active:scale-95 hover:scale-105 transition-transform z-10"
          >
            <ChevronRight size={18} className="text-km0-blue-700" strokeWidth={2.4} />
          </button>
        )}
      </div>

      {/* Dots de paginación — clicables */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {promos.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ir a la promo ${i + 1}`}
            className={cn(
              "rounded-full transition-all",
              i === index
                ? "w-5 h-1.5 bg-km0-blue-700"
                : "w-1.5 h-1.5 bg-km0-blue-700/25 hover:bg-km0-blue-700/50",
            )}
          />
        ))}
      </div>
    </>
  );
};

/* ─── ComercioCarousel ───────────────────────────────────────
   Carrusel paginado de logos de comercios con swipe táctil y
   dots clicables. Muestra 4 comercios por "página" en una grid.
   ─────────────────────────────────────────────────────────── */
interface ComercioCarouselProps {
  comercios: Comercio[];
}
const PER_PAGE = 4;
const ComercioCarousel = ({ comercios }: ComercioCarouselProps) => {
  const pages: Comercio[][] = [];
  for (let i = 0; i < comercios.length; i += PER_PAGE) {
    pages.push(comercios.slice(i, i + PER_PAGE));
  }
  const total = pages.length;
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const goTo = (next: number) => {
    const safe = Math.max(0, Math.min(total - 1, next));
    setDirection(safe >= page ? 1 : -1);
    setPage(safe);
  };

  return (
    <div>
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50 && page < total - 1) goTo(page + 1);
              else if (info.offset.x > 50 && page > 0) goTo(page - 1);
            }}
            className="grid grid-cols-4 gap-2 cursor-grab active:cursor-grabbing"
          >
            {pages[page].map((c) => (
              <button
                type="button"
                key={c.id}
                className="flex flex-col items-center active:scale-95 transition-transform"
              >
                <div
                  className={cn(
                    "w-[clamp(2.25rem,8vw,3.5rem)] h-[clamp(2.25rem,8vw,3.5rem)] vertical-tablet:w-14 vertical-tablet:h-14 rounded-full shadow-sm border-2 border-white flex items-center justify-center overflow-hidden",
                    c.bg,
                  )}
                >
                  <img
                    src={c.logo}
                    alt={c.name}
                    width={56}
                    height={56}
                    loading="lazy"
                    className="w-full h-full object-contain p-1.5 pointer-events-none select-none"
                    draggable={false}
                  />
                </div>
                <span className="font-body text-[10px] leading-tight text-km0-blue-800 mt-[clamp(0.125rem,0.5vw,0.375rem)] vertical-tablet:mt-1.5 truncate w-full text-center">
                  {c.name}
                </span>
              </button>
            ))}
            {/* Rellena huecos vacíos para mantener la grid alineada */}
            {pages[page].length < PER_PAGE &&
              Array.from({ length: PER_PAGE - pages[page].length }).map((_, i) => (
                <div key={`empty-${i}`} aria-hidden />
              ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {total > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-[clamp(0.375rem,1.5vw,0.75rem)] vertical-tablet:mt-3">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir a la página ${i + 1}`}
              className={cn(
                "rounded-full transition-all",
                i === page
                  ? "w-5 h-1.5 bg-km0-blue-700"
                  : "w-1.5 h-1.5 bg-km0-blue-700/25 hover:bg-km0-blue-700/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
