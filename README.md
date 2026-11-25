# Grant Assistance Information

A personal grant-research, education and website-building project.

## Current product boundary

The site provides a structured interface for studying grant information, eligibility, resources, application planning and content workflows. It is not a government service, funding authority, or application-processing organization.

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
- `POST /api/admin/grants`: protected server-side content upsert. Requires a separate bearer token and a Supabase secret key.

The legacy local `backend/` Express process is retained for security regression tests and local placeholder behavior. It is not the production API deployed by the Vite project.

## Database setup

See [database/README.md](database/README.md) and apply [database/schema.sql](database/schema.sql) to the Supabase Postgres project before expecting live records.

Required Vercel Production environment variables:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (server-only; never use a `VITE_` prefix)
- `NGA_CONTENT_ADMIN_TOKEN` (server-only random secret, at least 32 bytes)
- `NGA_ALLOWED_ORIGINS` (exact production origins)

No database credentials are committed to this repository.

## Security controls

- Public database access is limited by Postgres grants and row-level security to verified, published records.
- Public reads use the publishable key; the secret key is used only inside the server-side content-admin function.
- Admin writes require a separate bearer token and exact origin allowlisting.
- Content inputs are length-checked and source URLs are validated server-side.
- No public write endpoint, applicant intake, login, payment, or document-upload endpoint exists.
- The Vercel deployment applies CSP, HSTS, frame denial, MIME-sniffing protection, referrer policy, and restrictive permissions policy.

## Verification and release requirements

Before describing the content backend as live, verify:

1. The database exists and the schema has been applied.
2. Required variables exist in Vercel Production and no secret is exposed to the browser bundle.
3. `GET /api/health` returns HTTP 200 with a connected database.
4. `GET /api/grants` returns only verified and published records.
5. Unauthenticated admin writes return 401.
6. Browser navigation and content links work on the production domain.

The database starts empty. A human editor must review each grant record before publishing it.
