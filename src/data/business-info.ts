/**
 * ⭐ THE single source of truth for this site.
 *
 * Every place a fact about the business appears — the header, the footer, the
 * JSON-LD structured data, the <title>/meta, the sticky call button — reads
 * from THIS object. NAP (name / address / phone) physically cannot drift,
 * because it is typed exactly once.
 *
 * To fork this template into a new client site, this is the main file you edit
 * (plus services.ts, brand.tokens.css, the fonts, and the photos).
 *
 * ── FORK CHECKLIST ────────────────────────────────────────────────────────
 * Anything still set to a TODO_ value is caught by `npm run gate:copy` and
 * will FAIL the build until filled — so an unfinished site can never ship.
 */

export const business = {
  // ── Identity ────────────────────────────────────────────────────────────
  legalName: 'Corrigan Carpentry & Construction Pty Ltd',
  displayName: 'Corrigan Carpentry',
  abn: '25 601 540 201',
  trades: ['carpentry', 'formwork'] as const,

  // ── Contact (the ONE number that answers) ─────────────────────────────────
  // Owed by Damien — NOT invented. gate:copy fails while these read TODO_.
  phone: 'TODO_PHONE', // e.g. '+61 4XX XXX XXX' — the mobile that answers
  phoneDisplay: 'TODO_PHONE', // human-formatted, e.g. '0400 000 000'
  email: 'TODO_EMAIL', // e.g. 'hello@corrigancarpentry.com.au'

  hours: {
    mon_fri: '7:00–17:00',
    sat: '8:00–12:00',
    sun: 'Closed',
  },

  // ── Location / service area ───────────────────────────────────────────────
  // Mobile trade: locality/region only, no street address.
  address: { locality: 'Perth', region: 'WA', country: 'AU' },
  // Ranked — most-wanted work first. Drives areaServed in JSON-LD.
  // CONFIRM with Damien (showcase plan flagged the northern corridor).
  serviceAreas: ['Perth', 'Joondalup', 'Wanneroo', 'Stirling', 'Perth Northern Suburbs'],

  // ── Proof band ────────────────────────────────────────────────────────────
  yearsOnTools: 25, // "25 years on the tools, 8 in Sydney structural" (TradeBridge CLAUDE.md)
  licences: [
    // { type: 'Registered Building Practitioner', number: 'TODO_LICENCE' }
  ] as Array<{ type: string; number: string }>,
  insurance: 'TODO_INSURANCE', // e.g. 'Public liability $20M'

  // ── Web / marketing ───────────────────────────────────────────────────────
  siteUrl: 'https://corrigancarpentry.com.au', // CONFIRM domain ownership
  socials: {
    instagram: '', // '' = hidden in footer
    facebook: '',
  },
  gbpUrl: '', // Google Business Profile — NAP here MUST match it exactly

  // ── Form backend (pick one adapter at fork time) ──────────────────────────
  // 'apps-script' | 'netlify' | 'resend'
  formBackend: 'netlify' as 'apps-script' | 'netlify' | 'resend',
} as const;

export type Business = typeof business;

/** Fields that must be filled before launch (checked by gate:copy). */
export const REQUIRED_BEFORE_LAUNCH = [
  'phone',
  'phoneDisplay',
  'email',
  'insurance',
] as const;
