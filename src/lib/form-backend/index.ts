/**
 * Form-backend adapter interface. One contract, three implementations — pick
 * one per client at fork time via business.formBackend.
 *
 * The load-bearing rule (learned from the TradeBridge fire-and-forget bug):
 * EVERY adapter returns a JSON `{ ok: boolean }` that the client JS reads
 * back, so the form can show a real failure state. A submit that silently
 * "succeeds" while the backend rejected it is the bug class this prevents.
 */

export interface FormResult {
  ok: boolean;
  message?: string;
}

export interface FormAdapter {
  /** Which backend this is. */
  readonly id: 'apps-script' | 'netlify' | 'resend';
  /**
   * The <form> action attribute (or '' when the adapter posts via fetch).
   * For Netlify Forms this is '/'; for Apps Script/Resend it is the endpoint.
   */
  readonly action: string;
  /** Extra hidden inputs the form needs (e.g. Netlify's form-name). */
  readonly hiddenFields: Record<string, string>;
}

export { appsScriptAdapter } from './apps-script.ts';
export { netlifyAdapter } from './netlify.ts';
export { resendAdapter } from './resend.ts';
