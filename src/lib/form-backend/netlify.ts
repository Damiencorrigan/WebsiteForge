/**
 * Netlify Forms adapter (default). Zero backend code: Netlify detects the
 * form at deploy time from the data-netlify attribute + a hidden form-name.
 * Notifications configured in the Netlify UI, OR add the dual-email function
 * in netlify/functions/ (see README "Netlify notification function").
 *
 * Proven on the TVA build (per-language contact-{L} forms + honeypot).
 */
import type { FormAdapter } from './index.ts';

export const netlifyAdapter: FormAdapter = {
  id: 'netlify',
  action: '/', // Netlify Forms POST to the same origin; thanks page via redirect
  hiddenFields: {
    'form-name': 'quote',
  },
};
