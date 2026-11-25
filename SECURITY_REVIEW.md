# NGA acquisition-grade security and release review

**Review date:** 2026-11-24  
**Reviewed ref:** `codex/nga-repair-2026-11-20`  
**Review type:** Repository/source review, GitHub configuration inspection, and automated CI evidence review. This is not a legal opinion, compliance certification, live penetration test, or production approval.

## Executive decision

**NO-GO for production use as a grant application, funding, payment, or applicant-account portal.**

The current implementation is an informational React/Vite site with a deliberately disabled placeholder API. It has no operational applicant intake, authentication, authorization, applicant database, secure document upload, email delivery, payment processing, or grant-administration integration. The current UI correctly warns visitors not to submit sensitive data.

A limited static informational-site launch may be considered only after the owner verifies the operator identity, all published statements and links, the deployed hosting configuration, and the applicable legal/privacy requirements. A static-site launch must not imply grant approval authority, government affiliation, or a functioning application service.

## Controls and remediations verified in the repository

- Removed the stale root `server.js` that enabled unrestricted CORS and attempted a MongoDB connection using a default URI.
- Removed dormant, unverified grant amounts, deadlines, eligibility claims, team identities, FAQs, resource placeholders, and obsolete entrypoints with unverified government wording.
- Removed the local chat input and unverified support contact details.
- Removed US flag/monogram branding and added independent-site disclosures.
- Removed browser API-key shims, third-party import maps, Tailwind CDN loading, and remote font loading.
- Replaced runtime Tailwind CDN styling with locally bundled Tailwind CSS.
- Added a restrictive browser CSP in `index.html`.
- Added Vercel response-header configuration in `vercel.json` for CSP (including `frame-ancestors`), HSTS, nosniff, frame denial, Referrer Policy, and Permissions Policy. **The actual deployed response headers have not been independently verified.**
- API placeholder binds to loopback, exposes only `/health`, rejects `/submit` with 503, limits JSON request size, and sends defensive headers. It does not persist, forward, email, or intentionally log applicant payloads.
- Upgraded Vite to 8.3.8, React plugin to 6.3.0, and Express to 4.22.3.
- Committed frontend and backend npm lockfiles; CI uses `npm ci`.
- Upgraded GitHub Actions to `actions/checkout@v5` and `actions/setup-node@v6`.
- Corrected `metadata.json` to remove the false official-government description and unused microphone permission (commit `9ff3dde78592d2c0af1bba38c866c0dcb4827297`).

## Automated verification evidence

The previous completed PR verification run [45391173453](https://github.com/anne67j-boop/NGA/actions/runs/45391173453) passed:
- Frontend dependency audit (zero vulnerabilities).
- Backend dependency audit (zero vulnerabilities).
- Frontend and backend clean lockfile installs.
- TypeScript check and Vite production build.
- Four Chromium browser end-to-end tests.
- Backend API abuse-case tests.

A new CI run for the metadata correction is [45391832924](https://github.com/anne67j-boop/NGA/actions/runs/45391832924). Its result must be checked before treating that commit as fully verified.

## Remaining blockers — ranked

### P0 — Product capability and consumer-safety boundary

1. **No real grant application service exists.** There is no secure intake, authentication, authorization, case management, database, document upload, email, payment, or verified agency integration. Keep all such features disabled. Do not advertise this site as a portal that accepts applications or awards funding.
2. **No independently verified operator or program authority.** The repository contains disclaimers, but no documentary evidence of the legal operator, entity registration, beneficial ownership, authority to provide services, government relationships, grant-program sponsorship, or right to use any program branding. Disclaimers alone do not establish legitimacy.
3. **No verified program catalogue.** Grant listings and eligibility claims have been withdrawn. Do not republish grant names, deadlines, amounts, success rates, or eligibility rules without current primary-source evidence, source dates, and a maintenance owner.
4. **No legal/privacy readiness for future collection.** No verified privacy notice, terms, data controller/operator details, retention schedule, deletion process, complaint route, or jurisdiction-specific legal review is present. Before collecting personal information, define lawful basis, data minimization, retention, access/correction/deletion handling, processor contracts, cross-border transfer controls, and breach notification responsibilities.

### P1 — Repository and deployment security

5. **Default branch protection is absent.** GitHub reports `main` as unprotected with required status checks off. The repair branch is also unprotected. Configure rulesets/branch protection requiring PRs, passing CI, and appropriate review; prevent force-push and deletion; restrict direct pushes. Do not rely on a passing PR run as a merge gate until repository enforcement is enabled.
6. **Live response headers are unverified.** `vercel.json` now defines the intended headers, but no successful live HTTP response inspection was possible during this audit. Verify the exact production and preview domains for CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy. Confirm the Vercel project actually builds this repository/ref and serves the expected output. Review HSTS `includeSubDomains` against every subdomain before enabling it.
7. **No live external security assessment.** Automated tests and source review are not a penetration test. Before any service handles applicant data, commission an authorized independent test against a staging environment, remediate findings, and retest.
8. **No verified security scanning configuration evidence.** The repository tree does not contain a Dependabot configuration, CodeQL workflow, `SECURITY.md`, or `CODEOWNERS`. Confirm GitHub secret scanning, push protection, Dependabot alerts, and code scanning are enabled in repository settings; add ownership and vulnerability-reporting procedures. The current connection did not expose all account-level security settings, so their status is unknown, not assumed off.
9. **Commit provenance and release controls need strengthening.** The latest repair-branch commit is unsigned, and the branch is unprotected. Require signed commits if organizational policy requires them, reviewed changes, immutable release tags, and a documented release approval process.

### P2 — Quality, accessibility, and operations

10. **Browser coverage is narrow.** Current E2E checks use Chromium only. Add Firefox and WebKit coverage, responsive checks, and regression coverage for all routes.
11. **Accessibility is not certified.** No automated axe/WCAG scan, keyboard-only test, screen-reader review, color-contrast verification, or accessibility statement is present. Test to the applicable WCAG target before broad public launch.
12. **No production smoke test for headers or key disclosures.** Add a post-deploy check that fetches the actual deployed URL and asserts security headers, TLS/redirect behavior, expected page title, independent-site disclosure, and absence of forms or credential fields.
13. **No operational monitoring or incident runbook.** Define uptime/error monitoring, security contact, incident triage, evidence preservation, communications, rollback, and owner escalation. If a backend is later introduced, add backups and tested restoration, secrets rotation, access reviews, audit logging, and recovery objectives.
14. **No license or contribution/security governance is evident.** The repository has no root license file or contribution/security policy. Confirm code, design, copy, fonts, icons, and other assets have documented ownership and redistribution rights before commercial or public distribution.
15. **Legacy assets and naming need a final cleanup pass.** The repository still contains an apparently unused legacy stylesheet at `assets/css/style.css`, old Vision/Profile route placeholders, and inconsistent “National Grant Assistance” versus “Grant Assistance Information” naming. Confirm each is intentionally retained and cannot be mistaken for an operational service.

## CI workflow clarification

The workflow file is named `.github/workflows/deploy.yml`, but the inspected workflow performs lockfile maintenance, audits, build, and tests; it does not itself deploy the site. Vercel reports a successful status check on prior commits, but this audit could not inspect the Vercel project configuration or verify the live HTTP response. Do not interpret the workflow filename or a Vercel preview check as proof of a production deployment.

## Required release gates

A static informational release requires:
- Verified legal operator and ownership, accurate disclosures, source-backed content, and applicable legal review.
- Vercel project/ref/build/output verification and live HTTP header/TLS smoke test.
- Protected default branch with required reviews and CI.
- Cross-browser and accessibility testing appropriate to the intended audience.
- A clear support/security contact and basic incident/rollback ownership.

An applicant-processing release additionally requires:
- Approved product requirements, data-flow map, threat model, and privacy impact assessment.
- Authentication, MFA for staff, role-based authorization, secure sessions, CSRF protections where applicable, rate limiting, and abuse controls.
- Server-side validation, malware-scanned uploads, encryption in transit/at rest, least-privilege data access, audit trails, retention/deletion controls, and tested backups.
- Secure secrets management, verified email delivery, monitored integrations, and no client-side provider secrets.
- Independent penetration test and remediation/retest, operational runbooks, and legal approval.

## Final recommendation

**Keep PR #1 in draft and do not merge or enable applicant-data collection yet.** The current branch materially reduces the immediate risk of visitors submitting sensitive information to a fake/non-operational workflow, but it is not an acquisition-grade, production-ready grant-processing platform. Close the P0/P1 gates with evidence before release; close P2 items before broad public launch.
