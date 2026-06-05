import { useAppStore, type AppSession, type AppUser } from "@/stores/useAppStore";

/**
 * useAuth — Sesión del usuario (Zustand).
 *
 * Antes vivía en `services/mock/auth` + listeners propios; ahora es
 * un selector fino sobre el store global. La firma se mantiene para no
 * tocar las pantallas.
 */
export type MockSession = AppSession;
export type MockUser = AppUser;

export const useAuth = () => {
  const session = useAppStore((s) => s.session);
  const signOutAction = useAppStore((s) => s.signOut);

  return {
    session,
    user: session?.user ?? null,
    // Con Zustand+persist el estado se hidrata sincronamente desde
    // localStorage en el primer render → ya no hay "loading" inicial.
    loading: false,
    signOut: async () => { signOutAction(); },
  };
};
