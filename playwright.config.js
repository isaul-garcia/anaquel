import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  workers: 1,
  reporter: 'list',
  use: { viewport: { width: 1440, height: 1000 } }
});
