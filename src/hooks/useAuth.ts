import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * useAuth — Hook central de sesión.
 *
 * Reglas (críticas):
 *  - El listener `onAuthStateChange` se registra ANTES de `getSession()`
 *    para no perder eventos en frío.
 *  - Nunca hacemos llamadas Supabase pesadas dentro del callback del
 *    listener: solo actualizamos estado. Si hace falta cargar datos
 *    extra (perfil, etc.), se hace fuera con `setTimeout(..., 0)` o en
 *    otro hook que dependa del user.
 */
export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listener primero — no perder eventos.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    // 2. Después leemos la sesión actual.
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, user, loading, signOut };
};
