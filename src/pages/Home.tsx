import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import HomeContent from "@/components/HomeContent";
import NotificationsOverlay from "@/components/NotificationsOverlay";
import { type HomeModule, type HomeModuleId } from "@/components/HomeModules";
import { type HomeTab } from "@/components/BottomTabs";

import { PROMOS } from "@/data/promos";
import { COMERCIOS } from "@/data/comercios";
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

  const [notifOpen, setNotifOpen] = useState(false);
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
    modules: modulesWithHandlers,
    promos: PROMOS,
    comercios: COMERCIOS,
    activeTab,
    onTabChange: setActiveTab,
    showLogin,
    onLogin: goToLogin,
    showProfile,
    onProfile: goToProfile,
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 p-3 sm:p-4">
      {/* PORTRAIT */}
      <div
        className="landscape:hidden flex flex-col bg-km0-beige-50 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden relative"
        style={{
          width: "min(calc(100vw - 1.5rem), calc((100dvh - 1.5rem) * 9 / 19.5), 420px)",
          height: "min(calc(100dvh - 1.5rem), calc((100vw - 1.5rem) * 19.5 / 9), calc(420px * 19.5 / 9))",
        }}
      >
        <HomeContent {...sharedProps} />
        <NotificationsOverlay
          open={notifOpen}
          notifications={notifications}
          onClose={() => setNotifOpen(false)}
          onMarkRead={markRead}
        />
      </div>

      {/* LANDSCAPE */}
      <div
        className="hidden landscape:flex bg-km0-beige-50 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden flex-col relative"
        style={{
          width: "min(calc(100vw - 2rem), calc((100dvh - 2rem) * 16 / 9), 1200px)",
          height: "min(calc(100dvh - 2rem), calc((100vw - 2rem) * 9 / 16), calc(1200px * 9 / 16))",
        }}
      >
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
