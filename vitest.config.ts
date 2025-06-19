import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Place cache outside of src directory
    cache: {
      dir: './.vitest-cache'
    },
    // Exclude compiled tests in dist and tests in the deleteme directory
    exclude: ['**/node_modules/**', '**/deleteme/**', '**/dist/**']
  }
});