import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env['E2E_BASE_URL'] ?? 'http://127.0.0.1:4200/embotelladora-cool-ice/';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: process.env['E2E_BASE_URL']
    ? undefined
    : {
        command:
          'npx ng serve --configuration=github-pages --host 127.0.0.1 --port 4200 --no-hmr',
        url: baseURL,
        reuseExistingServer: !process.env['CI'],
        timeout: 180_000,
      },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          executablePath: process.env['PLAYWRIGHT_CHROME'] ?? '/usr/bin/google-chrome',
        },
      },
    },
  ],
});
