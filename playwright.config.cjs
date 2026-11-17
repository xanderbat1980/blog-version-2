const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:8766/blog-version-2/',
    headless: true,
    launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'python3 scripts/build_site.py && python3 scripts/serve_site.py',
    url: 'http://127.0.0.1:8766/blog-version-2/',
    reuseExistingServer: false
  }
});
