/**
 * Mock de autenticación (fase de maquetación).
 *
 * Reemplaza Supabase Auth. Persiste sesión en localStorage para que
 * sobreviva recargas. NO hace ninguna llamada de red.
 *
 * Reglas de la simulación:
 *  - `requestOtp(email, metadata)`: "envía" un OTP (no-op) y guarda el email
 *    pendiente + metadata (CP/población) hasta que se verifique.
 *  - `verifyOtp(email, code)`: acepta CUALQUIER código de 4 dígitos.
 *    Crea sesión, materializa el perfil desde la metadata pendiente y
 *    notifica a los suscriptores.
 *  - `signOut()`: borra sesión y notifica.
 *
 * Cuando se integre el backend real (Twilio + Railway), sustituir el
 * cuerpo de estas funciones — la firma se mantiene.
 */

const SESSION_KEY = "km0_mock_session";
const PENDING_KEY = "km0_mock_pending_otp";

export interface MockUser {
  id: string;
  email: string;
}

export interface MockSession {
  user: MockUser;
  /** ISO timestamp de creación. */
  createdAt: string;
}

interface PendingOtp {
  email: string;
  metadata?: { postal_code?: string; town?: string };
}

type Listener = (session: MockSession | null) => void;
const listeners = new Set<Listener>();

const safeGet = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeSet = (key: string, value: string) => {
  try { localStorage.setItem(key, value); } catch {/* ignore */}
};
const safeRemove = (key: string) => {
  try { localStorage.removeItem(key); } catch {/* ignore */}
};

export const getSession = (): MockSession | null => {
  const raw = safeGet(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as MockSession; } catch { return null; }
};

const notify = () => {
  const s = getSession();
  listeners.forEach((l) => l(s));
};

export const onAuthChange = (cb: Listener): (() => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const requestOtp = async (
  email: string,
  metadata?: PendingOtp["metadata"],
): Promise<{ error: { message: string } | null }> => {
  if (!email.trim()) return { error: { message: "Email requerido" } };
  const pending: PendingOtp = { email: email.trim(), metadata };
  safeSet(PENDING_KEY, JSON.stringify(pending));
  // Simula latencia mínima de red.
  await new Promise((r) => setTimeout(r, 250));
  return { error: null };
};

export const verifyOtp = async (
  email: string,
  code: string,
): Promise<{ error: { message: string } | null }> => {
  if (!/^\d{4}$/.test(code)) {
    return { error: { message: "Código no válido" } };
  }
  await new Promise((r) => setTimeout(r, 200));

  // Recupera metadata pendiente (si la hay) para materializar el perfil.
  const pendingRaw = safeGet(PENDING_KEY);
  let pendingMeta: PendingOtp["metadata"] | undefined;
  if (pendingRaw) {
    try { pendingMeta = (JSON.parse(pendingRaw) as PendingOtp).metadata; } catch {/* ignore */}
  }

  const session: MockSession = {
    user: {
      id: `mock-${btoa(email).replace(/=/g, "")}`,
      email: email.trim(),
    },
    createdAt: new Date().toISOString(),
  };
  safeSet(SESSION_KEY, JSON.stringify(session));
  safeRemove(PENDING_KEY);

  // Sembrar perfil si no existe.
  try {
    const { ensureProfileSeed } = await import("./profile");
    ensureProfileSeed(session.user, pendingMeta);
  } catch {/* ignore */}

  notify();
  return { error: null };
};

export const signOut = async (): Promise<void> => {
  safeRemove(SESSION_KEY);
  notify();
};
