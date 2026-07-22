/**
 * apiClient — acceso HTTP a la API de events-query (eventquery.km0lab.com).
 *
 * Base URL desde entorno:
 *  - `VITE_EVENTS_API_URL` (ej. https://eventquery.km0lab.com). Mientras la
 *    API no permita CORS desde *.lovable.app, en Lovable esta variable debe
 *    apuntar al proxy (edge function `event-query` de Supabase) para POST
 *    /query; el resto de endpoints requieren añadir el dominio de Lovable a
 *    `allowed_origins` en events-query (app/main.py).
 *
 * Toda respuesta se valida con zod en los services (apiSchemas.ts): un
 * cambio de shape en el scraper produce `ApiContractError` explícito, nunca
 * una UI rota en silencio.
 */
import { z } from "zod";

// Todas las llamadas se enrutan por la edge function `event-query`, que actúa
// como proxy CORS hacia https://eventquery.km0lab.com. El upstream no permite
// llamadas directas desde *.lovable.app.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;
const BASE_URL: string =
  (import.meta.env.VITE_EVENTS_API_URL as string | undefined) ??
  (SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/event-query` : "");

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ApiContractError extends Error {
  constructor(
    public readonly endpoint: string,
    public readonly issues: z.ZodIssue[]
  ) {
    super(
      `La respuesta de ${endpoint} no cumple el contrato: ${issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    );
    this.name = "ApiContractError";
  }
}

export async function apiFetch<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit
): Promise<T> {
  const authHeaders: Record<string, string> = SUPABASE_KEY
    ? { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    : {};
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new ApiError(res.status, `API ${path} respondió ${res.status}`);
  }
  const json: unknown = await res.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ApiContractError(path, parsed.error.issues);
  }
  return parsed.data;
}
