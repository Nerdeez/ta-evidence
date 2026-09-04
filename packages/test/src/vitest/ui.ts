import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export type UiVitestConfigOptions = {
  setupFiles: string[];
  publicDir?: string;
  define?: Record<string, string>;
  resolve?: {
    alias?: Record<string, string>;
  };
};

export function createUiVitestConfig(options: UiVitestConfigOptions) {
  return defineConfig({
    ...(options.publicDir ? { publicDir: options.publicDir } : {}),
    ...(options.define ? { define: options.define } : {}),
    ...(options.resolve ? { resolve: options.resolve } : {}),
    plugins: [react(), tailwindcss()],
    test: {
      setupFiles: options.setupFiles,
      browser: {
        enabled: true,
        provider: playwright(),
        headless: true,
        screenshotFailures: false,
        instances: [{ browser: 'chromium' }],
      },
    },
  });
}
