import type { Evento } from "./types";

export type { Evento };
export type { QueryResponse } from "./types";

export async function queryEvents(
  pregunta: string,
  cpUsuario: string,
  limit = 20
): Promise<import("./types").QueryResponse> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/event-query`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
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
