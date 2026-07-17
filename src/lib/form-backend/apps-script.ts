/**
 * Google Apps Script form backend (Sheet-backed). Generalized from the
 * TradeBridge Code.gs pattern. The client posts as text/plain to skip the
 * CORS preflight; the Apps Script doPost appends a row to a Sheet and emails
 * an acknowledgement + owner alert.
 *
 * SECRETS RULE (the TradeBridge lesson): any dashboard/metrics key lives in
 * the Apps Script's PropertiesService Script Properties — NEVER a literal in
 * the deployed .gs, and never echoed in client-reachable source.
 *
 * Set endpoint to the deployed web-app /exec URL at fork time (env, not here).
 */
import type { FormAdapter } from './index.ts';

const ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT ?? '';

export const appsScriptAdapter: FormAdapter = {
  id: 'apps-script',
  action: ENDPOINT,
  hiddenFields: {
    form_type: 'quote',
  },
};
