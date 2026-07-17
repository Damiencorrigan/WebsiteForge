# WebsiteForge Template

The canonical **Astro 5 + Tailwind v4** starter every WebsiteForge lead-gen
site forks. Static output (zero JS by default), a full quality-gate stack wired
as npm scripts, and **one data file** (`src/data/business-info.ts`) that drives
NAP, footer, and JSON-LD so facts can't drift.

First instantiation: **Corrigan Carpentry** (Perth carpentry + formwork).

> Governing principle (carried from the TVA & TradeBridge builds): **quality is
> enforced by gates in code, not review discipline.** A page that fails a gate
> cannot ship; a gate that passes is a receipt you can hand the client.

---

## Prerequisites

- Node ≥ 18.20.8 (this machine: Node 26 — fine)
- `npm install` once
- For `gate:e2e` / `gate:a11y`: `npx playwright install chromium` (bundled
  browser — no system Chrome / ChromeDriver needed)
- For `gate:lh`: a local Chrome/Chromium for Lighthouse (LHCI finds Chrome.app
  on macOS)
- For `tools/subset-fonts.sh`: `pip install "fonttools[woff]" brotli`

## Quick start

```bash
npm install
npm run dev            # local dev server
npm run build          # static build → dist/
npm run gate           # the whole gate stack (below)
```

## The gate stack (`npm run gate`)

Runs in order; a failure stops the line:

| Script | What it checks |
|---|---|
| `gate:copy`  | Banned phrases (unverifiable superlatives, guarantees) + launch-blocker TODOs. `--strict` makes unfilled TODOs hard-fail (use pre-deploy). |
| `build`      | `astro build` → `dist/` (minified HTML/CSS, fingerprinted assets, sitemap). |
| `gate:links` | Dead internal links, exactly one `<h1>`/page, every `<img>` has `alt`, `<title>` present. |
| `gate:a11y`  | axe-core (WCAG A/AA/2.2) via Playwright's bundled Chromium — **zero violations**. |
| `gate:e2e`   | Behavioural smoketest: clicks real controls, asserts navigation (desktop + mobile). |
| `gate:lh`    | Lighthouse budget: Perf ≥ 90, A11y = 100, BP = 100, SEO = 100. |

Run any one alone, e.g. `npm run gate:a11y`.

## Forking into a client site

1. `degit` or `git clone` this template into a new client repo.
2. Edit the **four fork files**:
   - `src/data/business-info.ts` — identity, phone, email, service areas, backend
   - `src/data/services.ts` — the offerings (or copy a `tools/presets/*.ts`)
   - `src/styles/brand.tokens.css` — colours + fonts (the whole re-skin)
   - swap `public/fonts/*.woff2` (use `tools/subset-fonts.sh`) + drop in photos
3. Pick a form backend in `business-info.ts` (`formBackend`): `netlify` |
   `apps-script` | `resend`. Wire its secret via `.env` / Script Properties —
   **never a literal** (the TradeBridge secrets lesson).
4. `npm run gate` must be green (and `gate:copy -- --strict` before deploy).
5. Deploy — **no deploy without Damien's go.**

## Form backends (`src/lib/form-backend/`)

One interface, three adapters — all return `{ ok: boolean }` the client JS
reads back (no fire-and-forget success):

- **netlify** (default) — Netlify Forms; notifications in the UI or a function.
- **apps-script** — Google Sheet-backed; keys in Script Properties.
- **resend** — transactional email via a serverless function (`RESEND_API_KEY`
  in the function env only). Claude Code's official `resend` plugin scaffolds it.

## Deploy targets (not wired — Damien's call per site)

Static `dist/` deploys to either:
- **Netlify** — `netlify deploy --prod --dir dist` (Netlify CLI already global).
- **Cloudflare Pages** — `wrangler pages deploy dist` (+ the TradeBridge
  stage-and-scrub pattern if the source tree holds private files).

`public/_headers` (CSP/HSTS/immutable caching) is read by both.

## Structure

```
src/data/          business-info.ts (⭐ source of truth) · services.ts
src/styles/        brand.tokens.css (⭐ re-skin here) · global.css
src/components/     Hero · ServicesGrid · ProofBand · ServiceArea · QuoteForm ·
                    Header · Footer · StickyCallCTA · Seo
src/layouts/        BaseLayout.astro
src/lib/            jsonld.ts · form-backend/{netlify,apps-script,resend}.ts
src/pages/          index · thanks · privacy · 404
scripts/            copy-gate.mjs · check-links.mjs · banned-phrases.json
tests/              smoke.spec.ts · a11y.spec.ts
tools/              subset-fonts.sh · presets/{chippie,sparky,plumber}.ts
public/             fonts/ · _headers · robots.txt · favicon.svg
```

**Template improvements flow back into THIS repo, never fork-local — that's the
compounding asset.**

## Content still owed by Damien (Corrigan instantiation)

Tracked as `TODO_` in `business-info.ts` (surfaced by `gate:copy`):
- the ONE phone number that answers (+ display format) · email
- insurance line + licence number(s) for the proof band
- 10+ job photos (hero + gallery) · 2–4 testimonials
- confirm service-area suburb ranking · confirm domain ownership

## Related (vault)

Specs this implements: `websiteforge-template-repo-structure`,
`websiteforge-process-playbook`, `websiteforge-stack-selection-guide`,
`website-quality-gate-checklist-2026`, `corrigan-carpentry-showcase-plan`.
