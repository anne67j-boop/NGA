# Grant Assistance Information Site

This repository currently contains an informational React/Vite frontend and a deliberately limited placeholder API.

## Current operational status

**Application intake, applicant login, contact delivery, applicant profiles, AI generation, and dashboard records are disabled.** These features must not be presented as operational until the required verified organization, security architecture, and backend services are implemented and tested.

This website is independent and is not a U.S. government agency or an official government grant portal. No government endorsement, partnership, or authorization is claimed.

For official U.S. federal grant opportunities and application guidance, visit [Grants.gov](https://www.grants.gov/).

## Requirements

- Node.js 20 or later
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

The GitHub Actions workflow runs these dependency checks, the production build, browser end-to-end tests, and backend abuse-case tests on the repair branch.

## Placeholder API

The backend is intentionally non-functional for application intake. It exposes only a health endpoint and returns HTTP 503 for `POST /submit`. It does not store, log, email, or process applicant data.

```bash
cd backend
npm install
npm start
```

The API binds to loopback (127.0.0.1) by default. It is not a production application backend.

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
