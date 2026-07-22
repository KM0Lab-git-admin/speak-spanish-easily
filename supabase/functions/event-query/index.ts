import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UPSTREAM = "https://eventquery.km0lab.com";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    // Path after the function name; supports both the legacy POST /event-query
    // (empty subpath → default to /api/v1/query) and the generic proxy.
    const marker = "/event-query";
    const idx = url.pathname.indexOf(marker);
    let subpath = idx >= 0 ? url.pathname.slice(idx + marker.length) : "";
    if (!subpath || subpath === "/") subpath = "/api/v1/query";

    const target = `${UPSTREAM}${subpath}${url.search}`;

    const hasBody = req.method !== "GET" && req.method !== "HEAD";
    const body = hasBody ? await req.text() : undefined;

    const apiRes = await fetch(target, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    const respBody = await apiRes.text();
    if (!apiRes.ok) {
      console.error("Upstream error:", apiRes.status, target, respBody.slice(0, 200));
    }
    return new Response(respBody, {
      status: apiRes.status,
      headers: {
        ...corsHeaders,
        "Content-Type": apiRes.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (e) {
    console.error("event-query error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
