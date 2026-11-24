const API_VERSION = "v1";

export function sendJson(res, status, payload, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  for (const [name, value] of Object.entries(extraHeaders)) res.setHeader(name, value);
  res.end(JSON.stringify(payload));
}

export function methodNotAllowed(res, allowed) {
  res.setHeader("Allow", allowed.join(", "));
  return sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
}

export function getSupabaseConfig({ admin = false } = {}) {
  const baseUrl = process.env.SUPABASE_URL;
  const key = admin ? process.env.SUPABASE_SECRET_KEY : process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!baseUrl || !key) return null;

  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") return null;
  if (parsed.pathname !== "/" || parsed.search || parsed.hash) return null;

  return { baseUrl: parsed.origin, key };
}

export async function supabaseRest(path, { admin = false, method = "GET", body, prefer } = {}) {
  const config = getSupabaseConfig({ admin });
  if (!config) {
    const error = new Error("Database is not configured");
    error.code = "DATABASE_NOT_CONFIGURED";
    throw error;
  }

  const response = await fetch(new URL(`/rest/${API_VERSION}/${path}`, config.baseUrl), {
    method,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: "no-store",
  });

  if (!response.ok) {
    const error = new Error("Database request failed");
    error.code = "DATABASE_REQUEST_FAILED";
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return [];
  return response.json();
}

export function isOfficialAgencyUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === "https:" && (host === "grants.gov" || host.endsWith(".grants.gov") || host.endsWith(".gov"));
  } catch {
    return false;
  }
}
