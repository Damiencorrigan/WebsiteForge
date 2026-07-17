import { defineConfig, devices } from '@playwright/test';

// Behavioural smoketest + axe accessibility gate both run against the BUILT
// site, driven by Playwright's own bundled Chromium — no system Chrome or
// ChromeDriver required (this is what sidesteps the ChromeDriver-version
// mismatch that blocks the standalone `axe` CLI locally).
const PORT = 4321;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  // Serve the built output so tests exercise the real shipped artifact.
  webServer: {
    command: 'npm run preview',
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
