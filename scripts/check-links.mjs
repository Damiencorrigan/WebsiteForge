#!/usr/bin/env node
/**
 * check-links.mjs — build-integrity gate. Runs AFTER `astro build` against
 * dist/. Node stdlib only. Fails (exit 2) on:
 *   - internal href/src that points to a file not in dist
 *   - a page with zero or multiple <h1>
 *   - a content <img> with no alt attribute
 *   - a page missing <title>
 * External (http/https/tel/mailto) links are reported, not fetched.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

if (!existsSync(DIST)) {
  console.error('check-links: dist/ not found — run `astro build` first.');
  process.exit(2);
}

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}
const allFiles = walk(DIST);
const htmlFiles = allFiles.filter((f) => extname(f) === '.html');

const fails = [];
let internalChecked = 0;

function distHas(urlPath) {
  // Map a site-absolute or relative URL path to a dist file.
  let clean = urlPath.split('#')[0].split('?')[0];
  if (clean === '' ) return true;
  const abs = clean.startsWith('/')
    ? join(DIST, clean)
    : resolve(DIST, clean); // (relative — resolved below per-page anyway)
  if (existsSync(abs)) {
    if (statSync(abs).isDirectory()) return existsSync(join(abs, 'index.html'));
    return true;
  }
  // Astro pretty routes: /thanks → dist/thanks/index.html or dist/thanks.html
  if (existsSync(abs + '.html')) return true;
  if (existsSync(join(abs, 'index.html'))) return true;
  return false;
}

for (const file of htmlFiles) {
  const rel = file.slice(DIST.length + 1);
  const html = readFileSync(file, 'utf8');

  // title present
  if (!/<title>[^<]*<\/title>/i.test(html)) fails.push(`${rel}: missing <title>`);

  // exactly one h1
  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1s !== 1) fails.push(`${rel}: expected exactly 1 <h1>, found ${h1s}`);

  // content imgs need alt (allow empty alt="" for decorative)
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  for (const img of imgs) {
    if (!/\balt\s*=/i.test(img)) fails.push(`${rel}: <img> without alt — ${img.slice(0, 70)}`);
  }

  // internal links resolve
  const hrefs = [...html.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]);
  for (const h of hrefs) {
    if (/^(https?:|tel:|mailto:|data:|#|\/\/|javascript:)/i.test(h)) continue;
    internalChecked++;
    const base = h.startsWith('/') ? h : join('/', dirname(rel), h);
    if (!distHas(base)) fails.push(`${rel}: dead internal link → ${h}`);
  }
}

console.log(`check-links: ${htmlFiles.length} page(s), ${internalChecked} internal link(s) checked`);
if (fails.length) {
  console.error('\n✗ FAIL:');
  for (const f of fails) console.error('   ' + f);
  process.exit(2);
}
console.log('✓ check-links PASS — links resolve, one H1/page, all imgs have alt, titles present.');
process.exit(0);
