import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getProfileTool from "./tools/get-profile";
import queryEventsTool from "./tools/query-events";

// The OAuth issuer MUST be the direct Supabase host (not the .lovable.cloud proxy).
// VITE_SUPABASE_PROJECT_ID is inlined by Vite at build time so this stays import-safe.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "km0lab-mcp",
  title: "KM0 Lab MCP",
  version: "0.1.0",
  instructions:
    "Tools for the KM0 Lab local-assistant app. Use `get_profile` to read the signed-in user's profile and `query_local_events` to search local events near them.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getProfileTool, queryEventsTool],
});
