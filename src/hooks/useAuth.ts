import { useEffect, useState } from "react";
import {
  getSession,
  onAuthChange,
  signOut as mockSignOut,
  type MockSession,
  type MockUser,
} from "@/services/mock/auth";

/**
 * useAuth — Hook central de sesión (MOCK).
 *
 * Lee la sesión desde el storage local y se suscribe a los cambios del
 * mock de auth. Cuando se conecte el backend real, sustituir
 * `@/services/mock/auth` por el cliente correspondiente; la API que
 * expone este hook (`session`, `user`, `loading`, `signOut`) se mantiene.
 */
export const useAuth = () => {
  const [session, setSession] = useState<MockSession | null>(null);
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });

    const current = getSession();
    setSession(current);
    setUser(current?.user ?? null);
    setLoading(false);

    return () => { unsubscribe(); };
  }, []);

  const signOut = async () => { await mockSignOut(); };

  return { session, user, loading, signOut };
};
