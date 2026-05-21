import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import HomeContent from "@/components/HomeContent";
import NotificationsOverlay from "@/components/NotificationsOverlay";
import { type HomeModule, type HomeModuleId } from "@/components/HomeModules";
import { type HomeTab } from "@/components/BottomTabs";

import { PROMOS } from "@/data/promos";
import { COMERCIOS } from "@/data/comercios";
import { COUPONS } from "@/data/coupons";
import { INITIAL_MODULES } from "@/data/homeModules";

/**
 * Home — página orquestadora. Solo gestiona estado (tab activa,
 * estado de módulos, overlay de notificaciones), inyecta los datos
 * mock desde `src/data/` y compone el frame portrait/landscape con
 * el componente reutilizable `<HomeContent />`.
 *
 * Cualquier cambio visual debe hacerse en los componentes hijos,
 * no aquí. Cualquier cambio de datos en `src/data/`.
 */
const Home = () => {
  const cityName = "Malgrat de Mar";
  const { notifications, hasUnread, markRead, markAllRead } = useNotifications();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const showLogin = !authLoading && !user;
  const showProfile = !authLoading && !!user;

  const [searchParams] = useSearchParams();
  // Permite forzar el overlay abierto desde /preview-all (?notifs=open)
  const [notifOpen, setNotifOpen] = useState(searchParams.get("notifs") === "open");
  const [modules, setModules] = useState<HomeModule[]>(INITIAL_MODULES);
  const [activeTab, setActiveTab] = useState<HomeTab>("home");

  const toggleModule = (id: HomeModuleId) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));
  };

  const modulesWithHandlers: HomeModule[] = modules.map((m) => ({
    ...m,
    onClick: () => {
      if (m.id === "agenda") {
        navigate("/agenda");
        return;
      }
      toggleModule(m.id);
    },
  }));

  const openNotifications = () => {
    setNotifOpen(true);
    markAllRead();
  };

  const goToProfile = () => navigate("/profile");
  const goToLogin = () => navigate("/login");

  const sharedProps = {
    cityName,
    hasAlerts: hasUnread,
    onToggleAlerts: openNotifications,
    userName: user?.user_metadata?.full_name ?? "Aina",
    points: 1259,
    nextLevel: 3000,
    modules: modulesWithHandlers,
    promos: PROMOS,
    comercios: COMERCIOS,
    coupons: COUPONS,
    activeTab,
    onTabChange: setActiveTab,
    showLogin,
    onLogin: goToLogin,
    showProfile,
    onProfile: goToProfile,
    onSeeAllComercios: () => {},
    onSeeAllEvents: () => navigate("/agenda"),
    onSeeAllCoupons: () => {},
    onOpenEvent: (id: string) => navigate(`/evento?id=${id}`),
  };

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 p-3 sm:p-4 overflow-hidden">
      {/* PORTRAIT — tamaño "teléfono" fijo (igual que el iframe de preview-all: 375×667).
          Sin cálculos de 100dvh que se comportan distinto dentro de un iframe. */}
      <div className="landscape:hidden flex flex-col bg-km0-beige-50 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden relative w-[375px] h-[667px] max-w-full max-h-full">
        <HomeContent {...sharedProps} />
        <NotificationsOverlay
          open={notifOpen}
          notifications={notifications}
          onClose={() => setNotifOpen(false)}
          onMarkRead={markRead}
        />
      </div>

      {/* LANDSCAPE — tamaño fijo 667×375 (igual que el iframe horizontal-mobile). */}
      <div className="hidden landscape:flex bg-km0-beige-50 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden flex-col relative w-[667px] h-[375px] max-w-full max-h-full">
        <HomeContent {...sharedProps} />
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

export default Home;
