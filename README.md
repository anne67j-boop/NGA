# Grant Assistance Information Site

This repository currently contains an informational React/Vite frontend and a deliberately limited placeholder API.

## Current operational status

**Application intake is implemented as a demonstration workflow but remains disabled until Supabase environment variables are configured and the release gates in `docs/APPLICATION_INTAKE_SETUP.md` are completed.** Applicant login, staff authentication, contact delivery, and AI generation are not operational.

This website is independent and is not a U.S. government agency or an official government grant portal. No government endorsement, partnership, or authorization is claimed.

For official U.S. federal grant opportunities and application guidance, visit [Grants.gov](https://www.grants.gov/).

## Requirements

- Node.js 22.12 or later
- npm 10 or later
- npm

## Frontend development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The build command runs TypeScript checks and creates the Vite production bundle in `dist/`. Tailwind CSS is compiled into the bundle; the page does not load the Tailwind CDN, remote fonts, or third-party import maps.

## Verification

```bash
npm audit --audit-level=moderate
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --prefix backend --audit-level=moderate
npm test --prefix backend
```

The repository commits root and backend npm lockfiles. GitHub Actions installs from those lockfiles with `npm ci`, then runs both dependency audits, the production build, browser end-to-end tests, and backend abuse-case tests. The workflow uses `actions/checkout@v5` and `actions/setup-node@v6`.

## Application intake API

The Vercel serverless endpoint `POST /api/grants/apply` validates the tutorial form and persists submissions through Supabase Postgres. It returns HTTP 503 until the server-side Supabase environment variables are configured. Optional email receipts use Resend. Setup, limitations, and verification steps are documented in `docs/APPLICATION_INTAKE_SETUP.md`.

The legacy `backend/` Express service remains a local placeholder and is not the Vercel production intake API.

## Before enabling applicant workflows

A future implementation requires, at minimum:

- Documentary verification of legal ownership, agency relationships, and each advertised funding program.
- A threat model and privacy impact assessment.
- Applicant and staff authentication, role-based authorization, session security, and rate limiting.
- Server-side validation, CSRF protections where applicable, secure secrets management, and strict CORS.
- Encryption in transit and at rest, least-privilege database access, audit trails, data minimization, retention and deletion controls.
- Independent security review and automated tests.
- Verified support and email delivery infrastructure.
- Server-side AI provider integration; never expose API keys in browser code.

Do not collect Social Security numbers, tax identifiers, bank account details, or other sensitive information until these controls have been implemented and independently tested.
