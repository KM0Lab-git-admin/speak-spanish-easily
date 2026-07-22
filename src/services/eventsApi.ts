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
  eventsListResponseSchema,
  type QueryResponse,
  type TodayResponse,
  type Category,
  type EventsListItem,
} from "@/services/apiSchemas";

const EVENTS_BASE: string =
  (import.meta.env.VITE_EVENTS_API_URL as string | undefined) ??
  "https://eventquery.km0lab.com";

/** Búsqueda en lenguaje natural (experiencia chat). Rate limit 30/min. */
export async function queryEvents(
  pregunta: string,
  cpUsuario: string,
  limit = 20,
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

/**
 * Evento adaptado para la Agenda: mismos nombres de campo que consumen
 * sus tarjetas. Título/descripción por idioma (por defecto es, fallback
 * ca). Las imágenes relativas de la API pasan a URL absoluta.
 */
export interface AgendaEvent {
  id_unico_evento: string;
  titulo: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  hora_inicio: string | null;
  hora_fin: string | null;
  es_gratuito: boolean;
  precio_euros: number | null;
  poblacion_nombre: string | null;
  lugar_nombre: string | null;
  categorias: string[];
  tags: string[];
  url_imagen: string | null;
}

function toAbsoluteImage(url?: string | null): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${EVENTS_BASE}${url}`;
}

function adaptListEvent(item: EventsListItem, lang: "es" | "ca"): AgendaEvent {
  const pick = (es?: string | null, ca?: string | null) =>
    (lang === "ca" ? (ca ?? es) : (es ?? ca)) ?? "";
  return {
    id_unico_evento: item.id,
    titulo: pick(item.titulo_es, item.titulo_cat),
    fecha_inicio: item.fecha_inicio ?? null,
    fecha_fin: item.fecha_fin ?? null,
    hora_inicio: item.hora_inicio ?? null,
    hora_fin: null,
    es_gratuito: item.es_gratuito ?? false,
    precio_euros: item.precio ?? null,
    poblacion_nombre: item.poblacion ?? null,
    lugar_nombre: item.lugar ?? null,
    categorias: item.categorias_nombres?.length
      ? item.categorias_nombres
      : item.categorias,
    tags: item.categorias,
    url_imagen: toAbsoluteImage(item.imagen_url),
  };
}

export interface ListEventsParams {
  categoria?: string; // slug de la API (musica, cultura, deportes…)
  poblacion?: string;
  fechaDesde?: string; // YYYY-MM-DD
  fechaHasta?: string; // YYYY-MM-DD
  esGratuito?: boolean;
  page?: number;
  pageSize?: number;
  lang?: "es" | "ca";
}

/**
 * Lista de eventos con filtros estructurados (GET /api/v1/events). Es el
 * MISMO endpoint que usa la web de eventquery, así que devuelve los
 * mismos resultados. Rate limit 100/min.
 */
export async function listEvents(
  params: ListEventsParams = {},
): Promise<{ eventos: AgendaEvent[]; total: number }> {
  const search = new URLSearchParams();
  search.set("page", String(params.page ?? 1));
  search.set("page_size", String(params.pageSize ?? 50));
  if (params.categoria) search.set("categoria", params.categoria);
  if (params.poblacion) search.set("poblacion", params.poblacion);
  if (params.fechaDesde) search.set("fecha_desde", params.fechaDesde);
  if (params.fechaHasta) search.set("fecha_hasta", params.fechaHasta);
  if (params.esGratuito != null)
    search.set("es_gratuito", String(params.esGratuito));

  const res = await apiFetch(
    `/api/v1/events?${search.toString()}`,
    eventsListResponseSchema,
  );
  const lang = params.lang ?? "es";
  return {
    eventos: res.data.map((item) => adaptListEvent(item, lang)),
    total: res.total,
  };
}
