/**
 * Resend transactional-email adapter. Use when there is no Sheet and no
 * Netlify Forms — a serverless function (Netlify/CF Pages Functions) receives
 * the POST and calls the Resend API. The RESEND_API_KEY lives in the function
 * environment, never in client source.
 *
 * The matching function stub lives in netlify/functions/quote.ts (see README).
 * Claude Code has an official `resend` plugin that scaffolds the send call.
 */
import type { FormAdapter } from './index.ts';

export const resendAdapter: FormAdapter = {
  id: 'resend',
  action: '/api/quote', // serverless function route
  hiddenFields: {},
};
