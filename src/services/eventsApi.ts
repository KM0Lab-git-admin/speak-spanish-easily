/**
 * eventsApi — consumo de la API real de eventos (events-query).
 *
 * Sustituye a `eventQueryApi.ts` (que llamaba al proxy Supabase sin
 * validación). Solo LECTURA: la lógica de scraping/procesado vive en el
 * repo events-query. Las pantallas consumen estas funciones vía React
 * Query; nunca hacen fetch directamente.
 *
 * Estados empty/error se prototipan con las fixtures de
 * `@/data/fixtures/` (query.json, events-today.json, categories.json).
 */
import { apiFetch } from "@/services/apiClient";
import {
  queryResponseSchema,
  todayResponseSchema,
  categoriesResponseSchema,
  type QueryResponse,
  type TodayResponse,
  type Category,
} from "@/services/apiSchemas";

/** Búsqueda en lenguaje natural (experiencia chat). Rate limit 30/min. */
export async function queryEvents(
  pregunta: string,
  cpUsuario: string,
  limit = 20
): Promise<QueryResponse> {
  return apiFetch("/api/v1/query", queryResponseSchema, {
    method: "POST",
    body: JSON.stringify({
      pregunta,
      cp_usuario: cpUsuario,
      limit,
      debug: false,
    }),
  });
}

/** Eventos de hoy (atajo optimizado para la Home/Agenda). */
export async function getTodayEvents(): Promise<TodayResponse> {
  return apiFetch("/api/v1/events/today", todayResponseSchema);
}

/** Categorías con conteo (filtros de Agenda). */
export async function getCategories(): Promise<Category[]> {
  const res = await apiFetch("/api/v1/categories", categoriesResponseSchema);
  return res.data;
}

/*
 * PENDIENTE (no implementar hasta que el backend lo arregle):
 * GET /api/v1/events (lista paginada con tarjetas por familia) devuelve
 * 500 en producción a 2026-07-21. Cuando esté operativo, añadir aquí
 * `listEvents({ page, pageSize, poblacion, categoria, ... })` con su
 * schema `{ data, total, page, page_size, total_pages }`.
 */
