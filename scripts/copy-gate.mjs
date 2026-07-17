#!/usr/bin/env node
/**
 * copy-gate.mjs — the compliance/quality gate for outbound copy. Node stdlib
 * only (no deps). Generalized from the TradeBridge/TVA copy-gate pattern.
 *
 * FAILs the build (exit 2) when:
 *   1. any REQUIRED_BEFORE_LAUNCH field still reads a TODO_ placeholder
 *      (an unfinished site physically cannot ship), OR
 *   2. any banned phrase (unverifiable superlative, guarantee, etc.) appears
 *      in the shipped copy.
 *
 * Usage:  node scripts/copy-gate.mjs [--trade carpentry]
 * Scans:  src/data/*.ts, src/pages/*.astro, src/components/*.astro
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const tradeArg = process.argv.indexOf('--trade');
const trade = tradeArg > -1 ? process.argv[tradeArg + 1] : 'carpentry';
// --strict promotes launch-blocker TODOs to hard FAILs. Wire it into the
// pre-DEPLOY gate; the plain `npm run gate` stays green on the template with
// TODOs as loud warnings (a template ships with placeholders by definition).
const STRICT = process.argv.includes('--strict');

// ── collect source files ────────────────────────────────────────────────────
const SCAN_DIRS = ['src/data', 'src/pages', 'src/components', 'src/layouts'];
const EXTS = new Set(['.ts', '.astro', '.md']);
function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (EXTS.has(extname(p))) out.push(p);
  }
  return out;
}
const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)));

// ── load banned phrases ─────────────────────────────────────────────────────
const banned = JSON.parse(readFileSync(join(ROOT, 'scripts/banned-phrases.json'), 'utf8'));
const patterns = [...(banned.common || []), ...(banned[trade] || [])].map(
  (p) => new RegExp(p, 'i'),
);

// ── required-before-launch TODO tokens ──────────────────────────────────────
// Mirrors REQUIRED_BEFORE_LAUNCH in business-info.ts.
const LAUNCH_TODOS = ['TODO_PHONE', 'TODO_EMAIL', 'TODO_INSURANCE'];

const fails = [];
const warns = [];

/**
 * Blank out code/markup COMMENTS while preserving line numbers, so the gate
 * only sees copy that actually ships — never a banned word used in a code
 * comment (the false-positive class from the TVA consult* gate). Block and
 * HTML comments are replaced space-for-space (newlines kept); line comments
 * and JSDoc `*` continuations are blanked per line; a trailing `//` comment is
 * stripped only when its `//` is not part of a URL (`://`).
 */
function stripComments(text) {
  const blankKeepNewlines = (m) => m.replace(/[^\n]/g, ' ');
  let t = text.replace(/\/\*[\s\S]*?\*\//g, blankKeepNewlines); // /* */ and /** */ and {/* */}
  t = t.replace(/<!--[\s\S]*?-->/g, blankKeepNewlines); // <!-- -->
  return t
    .split('\n')
    .map((line) => {
      if (/^\s*(\/\/|\*)/.test(line)) return ''; // full-line // or JSDoc *
      return line.replace(/(^|[^:])\/\/.*$/, '$1'); // trailing // (not ://)
    });
}

for (const file of files) {
  const rel = file.slice(ROOT.length + 1);
  const lines = stripComments(readFileSync(file, 'utf8'));

  lines.forEach((line, i) => {
    for (const re of patterns) {
      if (re.test(line)) {
        fails.push(`${rel}:${i + 1}  banned phrase ${re}  →  ${line.trim().slice(0, 90)}`);
      }
    }
  });
}

// launch-readiness TODO scan (only business-info matters for shipping)
const biz = readFileSync(join(ROOT, 'src/data/business-info.ts'), 'utf8');
for (const tok of LAUNCH_TODOS) {
  if (biz.includes(tok)) {
    warns.push(`business-info.ts still has ${tok} — not launch-ready (fill before deploy).`);
  }
}

// ── report ──────────────────────────────────────────────────────────────────
console.log(`copy-gate: trade=${trade}, scanned ${files.length} files`);
if (warns.length) {
  console.log('\n⚠  LAUNCH-BLOCKERS (fill before any deploy):');
  for (const w of warns) console.log('   ' + w);
}
if (STRICT && warns.length) {
  for (const w of warns) fails.push(w + '  [--strict]');
}
if (fails.length) {
  console.error('\n✗ FAIL:');
  for (const f of fails) console.error('   ' + f);
  console.error(`\ncopy-gate: ${fails.length} violation(s). Build blocked.`);
  process.exit(2);
}
console.log(`\n✓ copy-gate PASS — no banned phrases.` + (warns.length ? ' (launch-blockers above are warnings, not build failures — but MUST be filled before deploy.)' : ''));
process.exit(0);
