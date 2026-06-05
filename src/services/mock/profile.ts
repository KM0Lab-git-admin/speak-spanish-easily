/**
 * Mock del perfil (fase de maquetación).
 *
 * Las firmas imitan al backend real (Railway). El estado vive en
 * `useAppStore` (Zustand) — esto es solo un envoltorio asíncrono.
 */
import { useAppStore, ensureProfileSeed as storeSeed, type AppProfile, type AppUser } from "@/stores/useAppStore";

export type MockProfile = AppProfile;

export const ensureProfileSeed = (
  user: AppUser,
  metadata?: { postal_code?: string; town?: string },
) => storeSeed(user, metadata);

export const getProfile = async (userId: string): Promise<MockProfile | null> => {
  await new Promise((r) => setTimeout(r, 50));
  return useAppStore.getState().profiles[userId] ?? null;
};

export const updateProfile = async (
  userId: string,
  patch: Partial<MockProfile>,
): Promise<{ error: { message: string } | null }> => {
  await new Promise((r) => setTimeout(r, 100));
  useAppStore.getState().upsertProfile(userId, patch);
  return { error: null };
};
