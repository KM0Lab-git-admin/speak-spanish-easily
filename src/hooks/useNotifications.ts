import { useCallback, useMemo, useState } from "react";
import { INITIAL_NOTIFICATIONS, type AppNotification } from "@/data/notifications";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const hasUnread = useMemo(
    () => notifications.some((n) => !n.read),
    [notifications],
  );

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  return { notifications, hasUnread, markRead };
};
