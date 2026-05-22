import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * useProfile — Lee la fila de `profiles` del usuario actual.
 *
 * Sin sesión → no toca BD y devuelve {profile: null, loading: false}.
 * Se cachea con react-query e invalida cuando cambia user.id.
 */
export interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  postal_code: string | null;
  town: string | null;
  avatar_url: string | null;
}

export const useProfile = () => {
  const { user, loading: authLoading } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["profile", user?.id ?? "guest"],
    enabled: !!user && !authLoading,
    queryFn: async (): Promise<Profile | null> => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, postal_code, town, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) return null;
      return data as Profile | null;
    },
  });

  return {
    profile: data ?? null,
    loading: !!user && (authLoading || isLoading),
    refetch,
  };
};
