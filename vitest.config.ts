import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Place cache outside of src directory
    cache: {
      dir: './.vitest-cache'
    }
  }
});