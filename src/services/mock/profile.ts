/**
 * Mock del perfil (fase de maquetación).
 *
 * Cada perfil se guarda en localStorage bajo `km0_mock_profile:<userId>`.
 * Las firmas imitan a las que tendrá el backend real para que el porte
 * sea un cambio de implementación, no de API.
 */
import type { MockUser } from "./auth";

const keyFor = (userId: string) => `km0_mock_profile:${userId}`;

export interface MockProfile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  postal_code: string | null;
  town: string | null;
  avatar_url: string | null;
}

const emptyProfile = (email: string | null = null): MockProfile => ({
  first_name: null,
  last_name: null,
  email,
  postal_code: null,
  town: null,
  avatar_url: null,
});

const read = (userId: string): MockProfile | null => {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    return raw ? (JSON.parse(raw) as MockProfile) : null;
  } catch { return null; }
};

const write = (userId: string, profile: MockProfile) => {
  try { localStorage.setItem(keyFor(userId), JSON.stringify(profile)); } catch {/* ignore */}
};

/** Crea perfil inicial si no existe (idempotente). Usado al verificar OTP. */
export const ensureProfileSeed = (
  user: MockUser,
  metadata?: { postal_code?: string; town?: string },
) => {
  const existing = read(user.id);
  if (existing) return;
  const seeded: MockProfile = {
    ...emptyProfile(user.email),
    postal_code: metadata?.postal_code ?? null,
    town: metadata?.town ?? null,
  };
  write(user.id, seeded);
};

export const getProfile = async (userId: string): Promise<MockProfile | null> => {
  await new Promise((r) => setTimeout(r, 100));
  return read(userId);
};

export const updateProfile = async (
  userId: string,
  patch: Partial<MockProfile>,
): Promise<{ error: { message: string } | null }> => {
  await new Promise((r) => setTimeout(r, 150));
  const current = read(userId) ?? emptyProfile();
  write(userId, { ...current, ...patch });
  return { error: null };
};
