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
