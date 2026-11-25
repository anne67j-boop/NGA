# NGA content database

This database is for **public grant-program metadata only**. It must not store applicant profiles, Social Security numbers, tax IDs, bank details, identity documents, passwords, or application submissions.

## Provider and setup

The API is designed for Supabase Postgres through its REST Data API, using only server-side environment variables.

1. Provision a Supabase Postgres project through the Vercel Marketplace or the Supabase dashboard. Review the selected plan and any billing before confirming.
2. In the Supabase SQL Editor, run [schema.sql](./schema.sql).
3. In the Vercel project **nga**, add these Production environment variables:
   - `SUPABASE_URL`: the Supabase project URL.
   - `SUPABASE_PUBLISHABLE_KEY`: the publishable key (safe for public-role requests; still keep it in Vercel configuration).
   - `SUPABASE_SECRET_KEY`: the secret key, server-side only, used only by the protected content-admin endpoint.
   - `NGA_CONTENT_ADMIN_TOKEN`: a separate random secret of at least 32 bytes for the content editor API.
   - `NGA_ALLOWED_ORIGINS`: comma-separated exact production origins, for example `https://nga-beta.vercel.app,https://nga-rebirths-projects.vercel.app`.
4. Redeploy the project after the environment variables and schema are ready.

Do not put the Supabase secret key or admin token in source control, frontend variables, screenshots, browser storage, or client-side JavaScript. Do not prefix either secret with `VITE_`.

## API

- `GET /api/health`: confirms whether the content database is configured and reachable; never returns credentials.
- `GET /api/grants`: returns only open, verified, published records.
- `POST /api/admin/grants`: upserts a record; requires `Authorization: Bearer <NGA_CONTENT_ADMIN_TOKEN>`. Both official URLs must use HTTPS and a .gov domain. Set `publish: true` only after manually checking the current official notice.

To withdraw a listing, upsert it with `program_status: "withdrawn"` and `publish: false`. No public deletion or applicant-submission endpoint exists.

## Editorial audit trail

Every insert or update to a grant source writes a separate audit record containing the source ID/slug, operation, prior and new publication state, database role, and timestamp. Public and authenticated roles cannot read or write this audit table. It contains no visitor or applicant data.

## Important limitations

The code and schema can be reviewed before provisioning, but the database is not live until a Supabase project is connected, the schema is applied, and Vercel Production variables are configured. The initial database is intentionally empty; no grant program is represented as verified by default.
