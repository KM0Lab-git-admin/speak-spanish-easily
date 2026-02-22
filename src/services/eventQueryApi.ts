const BASE_URL = "https://eventquery.km0lab.com";

export interface Evento {
  id_unico_evento: string;
  titulo: string;
  descripcion_corta: string;
  descripcion_larga: string;
  cp_evento: string;
  poblacion_nombre: string;
  lugar_nombre: string;
  direccion_completa: string;
  fecha_inicio: string;
  fecha_fin: string;
  hora_inicio: string;
  hora_fin: string;
  es_gratuito: boolean;
  precio_euros: number | null;
  categorias: string[];
  tags: string[];
  url_evento: string | null;
  url_imagen: string | null;
  distancia_km: number | null;
  similitud_score: number;
  nivel_coincidencia: string;
}

export interface QueryResponse {
  respuesta_texto: string;
  eventos: Evento[];
}

export async function queryEvents(
  pregunta: string,
  cpUsuario: string,
  limit = 20
): Promise<QueryResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pregunta,
      cp_usuario: cpUsuario,
      limit,
      debug: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
