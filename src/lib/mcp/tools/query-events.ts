import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "query_local_events",
  title: "Query local events",
  description:
    "Search local events near the signed-in user using the KM0 Lab event-query engine. Uses the user's saved postal code by default; pass postal_code to override.",
  inputSchema: {
    question: z.string().min(1).describe("Natural-language question about local events."),
    postal_code: z
      .string()
      .optional()
      .describe("Optional 5-digit Spanish postal code. Defaults to the user's profile postal code."),
    limit: z.number().int().min(1).max(50).optional().describe("Max events to return (default 20)."),
  },
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ question, postal_code, limit }, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }

    let cp = postal_code;
    if (!cp) {
      const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
        global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data } = await supabase
        .from("profiles")
        .select("postal_code")
        .eq("user_id", ctx.getUserId())
        .maybeSingle();
      cp = data?.postal_code ?? "08001";
    }

    const url = `${process.env.SUPABASE_URL}/functions/v1/event-query`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ pregunta: question, cp_usuario: cp, limit: limit ?? 20, debug: false }),
    });
    if (!res.ok) {
      return { content: [{ type: "text", text: `Event API error: ${res.status}` }], isError: true };
    }
    const data = await res.json();
    return {
      content: [{ type: "text", text: data.respuesta_texto ?? "" }],
      structuredContent: { answer: data.respuesta_texto, events: data.eventos ?? [] },
    };
  },
});
