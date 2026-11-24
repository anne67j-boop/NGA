import { sendJson, supabaseRest } from "./_lib/supabase.js";

const PUBLIC_FIELDS = [
  "id",
  "slug",
  "title",
  "administering_agency",
  "summary",
  "eligibility_summary",
  "official_notice_url",
  "official_agency_url",
  "deadline_at",
  "program_status",
  "source_checked_at",
  "verified_at",
].join(",");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "METHOD_NOT_ALLOWED" });
  }

  try {
    const query = new URLSearchParams({
      select: PUBLIC_FIELDS,
      is_published: "eq.true",
      verification_status: "eq.verified",
      program_status: "eq.open",
      order: "deadline_at.asc.nullslast",
      limit: "50",
    });
    const records = await supabaseRest(`grant_sources?${query.toString()}`);
    return sendJson(res, 200, {
      data: records,
      meta: { count: records.length, source: "verified_agency_records" },
    }, {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    });
  } catch (error) {
    const status = error.code === "DATABASE_NOT_CONFIGURED" ? 503 : 502;
    return sendJson(res, status, {
      error: status === 503 ? "CONTENT_DATABASE_NOT_CONFIGURED" : "CONTENT_SOURCE_UNAVAILABLE",
      message: "Verified grant listings are temporarily unavailable. Check the administering agency's official notice.",
    });
  }
}
