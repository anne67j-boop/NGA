# NGA persistent application intake setup

## Architecture

The website remains React + Vite. Vercel serves the static frontend and the serverless endpoint at \`/api/grants/apply\`. Supabase Postgres stores submissions. Resend is optional for email receipts and staff alerts.

This implementation is a demonstration intake system for an independent information website. It is not a government portal, does not submit applications to grant administrators, and cannot make funding decisions.

## 1. Configure Supabase

1. Create a Supabase project that you control.
2. Open the SQL Editor and run \`supabase/migrations/202611250001_grant_applications.sql\`.
3. In Project Settings → API, copy the project URL and the service-role key.
4. Keep the service-role key server-side. Never put it in a \`VITE_*\` variable or frontend source.
5. The migration creates a private attachment bucket for a future upload workflow. The current React form submits JSON and does not upload files.

## 2. Configure Vercel

In Project → Settings → Environment Variables, add these to the Preview environment first:

- \`SUPABASE_URL\`: Supabase project URL.
- \`SUPABASE_SERVICE_ROLE_KEY\`: Supabase service-role key (Secret).
- \`RESEND_API_KEY\`: optional; only needed for outbound email.
- \`GRANT_FROM_EMAIL\`: optional verified sender address required when Resend is enabled.
- \`GRANT_ADMIN_EMAIL\`: optional staff notification recipient.

Add database secrets to Production only after preview testing and independent security review. Do not commit real secrets to Git.

## 3. Verify

After Vercel creates a preview deployment, run:

\`\`\`bash
npm run audit:production -- https://YOUR-PREVIEW-URL.vercel.app
\`\`\`

The audit checks HTTPS, baseline security headers, homepage metadata, and that the API route exists and rejects GET with HTTP 405.

Test a submission using synthetic data only. Confirm that the returned reference ID exists in Supabase and that email delivery behaves as configured. Confirm a request without Supabase environment variables returns HTTP 503 and does not report success.

## Current limitations and release gates

- The existing form currently sends JSON; file upload is not wired into the UI or endpoint. Do not treat the private bucket as an active upload feature.
- No applicant account authentication, staff review dashboard, CAPTCHA, or distributed rate limiter is implemented. Do not collect real sensitive documents or financial/identity data.
- Before accepting real applicants, add abuse controls and authentication appropriate to the threat model, privacy/retention/deletion controls, independent security review, and a verified support process.
- Program records are tutorial examples. Verify every program with its administering agency; do not imply government affiliation or eligibility.
- A successful API response means only that the demonstration record was stored in this site's database.
