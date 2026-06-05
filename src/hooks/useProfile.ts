import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getProfile } from "@/services/mock/profile";

/**
 * useProfile — Lee el perfil del usuario actual (MOCK).
 *
 * Sin sesión → devuelve {profile: null, loading: false}.
 * Cuando se integre el backend real, cambiar la implementación de
 * `getProfile` en `@/services/mock/profile` por la llamada a la API.
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
      return (await getProfile(user.id)) as Profile | null;
    },
  });

  return {
    profile: data ?? null,
    loading: !!user && (authLoading || isLoading),
    refetch,
  };
};
