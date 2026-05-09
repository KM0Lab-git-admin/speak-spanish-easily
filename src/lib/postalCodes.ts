/**
 * Catálogo CP → población (Supabase, tabla `postal_codes`).
 *
 * Fuente única de verdad para la pantalla de onboarding (PostalCode) y
 * el perfil (Profile). Cache en memoria por sesión para evitar repetir
 * la misma query.
 */
import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, string | null>();

export async function lookupTown(postalCode: string): Promise<string | null> {
  const cp = postalCode.trim();
  if (!/^\d{5}$/.test(cp)) return null;

  if (cache.has(cp)) return cache.get(cp) ?? null;

  const { data, error } = await supabase
    .from("postal_codes")
    .select("town")
    .eq("postal_code", cp)
    .maybeSingle();

  const town = error ? null : data?.town ?? null;
  cache.set(cp, town);
  return town;
}
