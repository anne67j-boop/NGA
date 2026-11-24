# NGA security review — repair branch

**Review date:** 2026-11-24  
**Scope:** Source-level review of the frontend, placeholder API, repository entrypoints, dependency manifests, and CI workflow on `codex/nga-repair-2026-11-20`.

## Executive result

The project is currently an informational static website with a deliberately disabled API. Applicant intake, sign-in, applicant profiles, dashboard records, AI generation, and support delivery are not operational. The review does not certify the site as a production grant-processing service.

## Findings remediated in this pass

- Removed the stale root `server.js` that enabled unrestricted CORS and attempted a MongoDB connection using a default URI.
- Removed duplicate, unverified grant amounts, deadlines, eligibility claims, team identities, FAQs, and resource placeholders from inactive source files.
- Removed the obsolete frontend HTML entrypoint, including false official-government wording, remote import maps, browser API-key shim, Tailwind CDN, and remote font loading.
- Removed the local chat input so visitors are not encouraged to submit private information to a non-operational support interface.
- Removed US flag/monogram branding and an unverified support phone number; clarified the site's independent status.
- Removed the unused microphone permission request from app metadata.
- Replaced runtime Tailwind CDN styling with a locally bundled Tailwind build.
- Added a restrictive browser Content Security Policy meta policy for same-origin scripts, styles, images, fonts, and connections.
- Added API response headers: no-store, nosniff, frame denial, no-referrer, restricted browser permissions, same-origin resource policy, and a deny-by-default API CSP.
- Kept the API bound to loopback. Application submissions return HTTP 503; malformed JSON and oversized JSON receive sanitized 400/413 responses.
- Upgraded Vite from the vulnerable 5.x line to 8.3.8 and its React plugin to 6.3.0.
- Upgraded Express to 4.22.3 after the backend audit exposed vulnerable transitive `body-parser`, `path-to-regexp`, and `qs` versions.
- Generated and committed npm lockfiles for both the frontend (`package-lock.json`) and API (`backend/package-lock.json`). CI now uses `npm ci` for reproducible installs.
- Upgraded GitHub Actions from the deprecated `checkout@v4` / `setup-node@v4` to `checkout@v5` / `setup-node@v6`.

## Automated verification

GitHub Actions workflow: `.github/workflows/deploy.yml`.

- Frontend dependency audit: `npm audit --audit-level=moderate` — latest final CI: **0 vulnerabilities**.
- TypeScript and Vite production build.
- Chromium browser tests for navigation, mobile menu, disabled application/sign-in forms, and same-origin executable scripts.
- Backend dependency audit: `npm audit --prefix backend --audit-level=moderate` — latest final CI: **0 vulnerabilities**.
- Node test suite for health response, defensive headers, rejected submission, sensitive-data non-echo, malformed JSON, oversized JSON, and unknown routes.

Final clean-install verification passed in GitHub Actions run [45390833653](https://github.com/anne67j-boop/NGA/actions/runs/45390833653): frontend and backend `npm ci`, both audits (zero vulnerabilities), TypeScript/Vite production build, all four Chromium E2E tests, and all backend abuse-case tests passed.

## Residual risks and release blockers

1. **No live penetration test:** no authorized deployed target URL or production environment was available. This is a source review plus automated CI testing, not an external network penetration test.
2. **No applicant workflow:** there is no real authentication, authorization, application database, email delivery, or secure upload service. Do not enable sensitive data collection.
3. **Hosting headers:** the HTML CSP meta policy cannot replace HTTP response headers such as HSTS, X-Frame-Options, and a full CSP with frame-ancestors. Configure these at the eventual hosting/CDN layer and verify them against the deployed domain.
4. **Dependency reproducibility:** frontend and backend lockfiles are now committed, and CI verifies clean `npm ci` installs. Refresh lockfiles whenever dependency manifests change.
5. **Operational/legal verification:** site ownership, organization identity, government relationships, grant listings, and any support contact must be evidenced before publishing claims or accepting money/data.
6. **Browser coverage:** CI currently targets Chromium. Add Firefox/WebKit and accessibility testing before broad production release.

## Release decision

**Do not merge or enable application intake based solely on this review.** Keep the PR in draft until hosting headers are configured and the owner verifies all organizational and program claims. A live penetration test requires an explicitly authorized staging URL and defined test scope.
