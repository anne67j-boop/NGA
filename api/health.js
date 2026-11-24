import { getSupabaseConfig, sendJson, supabaseRest } from "../backend/lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
  }

  if (!getSupabaseConfig()) {
    return sendJson(res, 503, {
      status: "degraded",
      database: "not_configured",
      applicationIntake: "disabled",
    });
  }

  try {
    await supabaseRest("grant_sources?select=id&limit=1");
    return sendJson(res, 200, {
      status: "ok",
      database: "connected",
      applicationIntake: "disabled",
    });
  } catch (error) {
    return sendJson(res, 503, {
      status: "degraded",
      database: error.code === "DATABASE_NOT_CONFIGURED" ? "not_configured" : "unavailable",
      applicationIntake: "disabled",
    });
  }
}
