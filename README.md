# Grant Assistance Information Site

An independent grant-information website. It is **not** a government agency, official grant portal, funding authority, or representative of Grants.gov or any administering agency.

## Current product boundary

The site provides public information and links to official sources only. It does not accept grant applications, applicant accounts, identity documents, Social Security numbers, tax identifiers, bank details, payments, or application fees. Eligibility must be confirmed with the administering agency.

## Stack

- React 19 + Vite + TypeScript frontend
- Vercel Functions for same-origin production API routes in `/api`
- Supabase Postgres for curated public grant metadata
- Supabase Data API accessed server-side using publishable/secret keys

## Local development

Requirements: Node.js 22.12+ and npm 10+.

```bash
npm ci
npm run dev
```

## Production build and checks

```bash
npm run build
npm audit --audit-level=moderate
npm audit --prefix backend --audit-level=moderate
npm test --prefix backend
```

The frontend build runs TypeScript checks and creates the Vite production bundle in `dist/`.

## Production API

- `GET /api/health`: reports whether the content database is configured and reachable; never returns credentials.
- `GET /api/grants`: returns only open, verified, published grant records.
- `POST /api/admin/grants`: protected server-side content upsert. Requires a separate bearer token and a Supabase secret key. Official notice and agency URLs must use HTTPS on .gov domains.

The legacy local `backend/` Express process is retained for its security regression tests and local placeholder behavior. It is not the production API deployed by the Vite project.

## Database setup

See [database/README.md](database/README.md) and apply [database/schema.sql](database/schema.sql) to the Supabase Postgres project before expecting live records.

Required Vercel Production environment variables:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (server-only; never use a `VITE_` prefix)
- `NGA_CONTENT_ADMIN_TOKEN` (server-only random secret, at least 32 bytes)
- `NGA_ALLOWED_ORIGINS` (exact production origins)

No database credentials are committed to this repository. Until the database is provisioned, schema applied, and variables configured, `/api/health` and `/api/grants` deliberately fail closed and the grants page directs visitors to official sources.

## Security controls

- Public database access is limited by Postgres grants and row-level security to verified, published records.
- Public reads use the publishable key; the secret key is used only inside the server-side content-admin function.
- Admin writes require a separate bearer token and exact origin allowlisting.
- Content inputs are length-checked; official source URLs must be HTTPS .gov URLs.
- No public write endpoint, applicant intake, login, payment, or document-upload endpoint exists.
- The Vercel deployment applies CSP, HSTS, frame denial, MIME-sniffing protection, referrer policy, and restrictive permissions policy.

## Verification and release requirements

A successful frontend build does not prove database connectivity. Before describing the content backend as live, verify:

1. Supabase project exists and the schema has been applied.
2. All required variables exist in Vercel Production and no secret is exposed to the browser bundle.
3. `GET /api/health` returns HTTP 200 with `database: connected`.
4. `GET /api/grants` returns only verified and published records.
5. Unauthenticated admin writes return 401; invalid source URLs return 400.
6. Browser navigation and official-source links work on the production custom domain.

The database starts empty. A human editor must independently check each administering-agency notice before publishing a record.
