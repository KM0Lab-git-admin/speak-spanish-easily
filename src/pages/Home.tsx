import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useNotifications } from "@/hooks/useNotifications";
import { useLang } from "@/contexts/LangContext";
import { t } from "@/lib/i18n";
import HomeContent from "@/components/HomeContent";
import HomeContentLandscape from "@/components/HomeContentLandscape";
import NotificationsOverlay from "@/components/NotificationsOverlay";
import { type HomeModule, type HomeModuleId } from "@/components/HomeModules";
import { type HomeTab } from "@/components/BottomTabs";

import { PROMOS } from "@/data/promos";
import { COMERCIOS } from "@/data/comercios";
import { COUPONS } from "@/data/coupons";
import { INITIAL_MODULES, type HomeModuleSeed } from "@/data/homeModules";

const Home = () => {
  const { notifications, hasUnread, markRead, markAllRead } = useNotifications();
  const { user, loading: authLoading } = useAuth();
  const { profile } = useProfile();
  const { lang } = useLang();
  const navigate = useNavigate();

  const showLogin = !authLoading && !user;
  const showProfile = !authLoading && !!user;
  const showPoints = showProfile; // PointsCard solo si hay sesión

  const [searchParams] = useSearchParams();
  const [notifOpen, setNotifOpen] = useState(searchParams.get("notifs") === "open");
  const [moduleSeeds, setModuleSeeds] = useState<HomeModuleSeed[]>(INITIAL_MODULES);
  const [activeTab, setActiveTab] = useState<HomeTab>("home");

  const toggleModule = (id: HomeModuleId) => {
    setModuleSeeds((prev) => prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));
  };

  const modulesWithHandlers: HomeModule[] = useMemo(
    () =>
      moduleSeeds.map((m) => ({
        id: m.id,
        active: m.active,
        label: t(m.labelKey, lang),
        onClick: () => {
          if (m.id === "agenda") {
            navigate("/agenda");
            return;
          }
          toggleModule(m.id);
        },
      })),
    [moduleSeeds, lang, navigate],
  );

  const openNotifications = () => {
    setNotifOpen(true);
    markAllRead();
  };

  const goToProfile = () => navigate("/profile");
  const goToLogin = () => navigate("/login");

  // Nombre: solo si el usuario está registrado Y ha guardado un first_name.
  const firstName = showProfile ? profile?.first_name?.trim() || null : null;

  // Saludo localizado.
  const hello = t("home.hello", lang);
  const greeting = lang === "en"
    ? (firstName ? `${hello}, ${firstName}!` : `${hello}!`)
    : (firstName ? `¡${hello}, ${firstName}!` : `¡${hello}!`);

  // Ciudad: prioriza perfil → localStorage → fallback.
  const storedTown = (() => {
    try { return localStorage.getItem("km0_town"); } catch { return null; }
  })();
  const cityName = profile?.town || storedTown || "Malgrat de Mar";

  const sharedProps = {
    cityName,
    hasAlerts: hasUnread,
    onToggleAlerts: openNotifications,
    greeting,
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
    showPoints,
    onSeeAllComercios: () => {},
    onSeeAllEvents: () => navigate("/agenda"),
    onSeeAllCoupons: () => {},
    onOpenEvent: (id: string) => navigate(`/evento?id=${id}`),
  };

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-km0-beige-50 to-km0-beige-100 p-3 sm:p-4 overflow-hidden">
      <div className="landscape:hidden flex flex-col bg-km0-beige-50 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden relative w-[375px] h-[667px] max-w-full max-h-full">
        <HomeContent {...sharedProps} />
        <NotificationsOverlay
          open={notifOpen}
          notifications={notifications}
          onClose={() => setNotifOpen(false)}
          onMarkRead={markRead}
        />
      </div>

      <div className="hidden landscape:flex bg-km0-beige-50 rounded-3xl border-2 border-km0-blue-700/80 shadow-[0_24px_60px_-20px_hsl(var(--km0-blue-700)/0.3)] overflow-hidden flex-col relative w-[667px] h-[375px] max-w-full max-h-full">
        <HomeContentLandscape {...sharedProps} />
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
