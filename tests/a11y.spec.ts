import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Accessibility gate — axe-core driven through Playwright's OWN bundled
 * Chromium. This is the key move: it needs no system Chrome and no matching
 * ChromeDriver, so it sidesteps the ChromeDriver-version mismatch that blocks
 * the standalone `axe` CLI locally (the TVA a11y-refresh pain point).
 *
 * Zero WCAG 2.0/2.1/2.2 A + AA violations required on every route.
 */
const routes = ['/', '/thanks', '/privacy', '/404'];

for (const route of routes) {
  test(`no WCAG A/AA violations on ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    // Print any violations for a readable failure.
    if (results.violations.length) {
      console.log(
        `axe violations on ${route}:\n` +
          results.violations
            .map((v) => `  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node/s)`)
            .join('\n'),
      );
    }
    expect(results.violations).toEqual([]);
  });
}
