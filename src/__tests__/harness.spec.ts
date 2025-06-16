import * as prettier from 'prettier';
import prettierPluginMultiline from '../index';
// Using vitest as requested
import { describe, it, expect } from 'vitest';

/**
 * Basic test harness to verify Prettier can be invoked with our plugin
 * This serves as a foundation for more complex tests
 */
describe('Prettier Test Harness Bootstrap', () => {
  const options: prettier.Options = {
    parser: 'typescript',
    plugins: [prettierPluginMultiline],
  };

  it('should invoke Prettier with the plugin without throwing an error', async () => {
    const sourceCode = 'const x = 1;';
    
    let formattedCode = '';
    let error: Error | null = null;

    try {
      formattedCode = await prettier.format(sourceCode, options);
    } catch (e) {
      error = e as Error;
    }

    expect(error, "Prettier format should not throw an error").toBeNull();
    expect(typeof formattedCode).toBe('string');
  });

  it('should format a simple TypeScript code string correctly', async () => {
    const sourceCode = 'const x = 1 ;';
    const expected = 'const x = 1;\n';
    
    const formattedCode = await prettier.format(sourceCode, options);
    
    expect(formattedCode).toBe(expected);
  });

  it('should handle multiline expressions', async () => {
    const sourceCode = 'const arr = [1,2,3];';
    const expected = 'const arr = [1, 2, 3];\n';
    
    const options: prettier.Options = {
      parser: 'typescript',
      plugins: [prettierPluginMultiline],
      multilineArrays: false, // Don't force multiline for this test
    };
    
    const formattedCode = await prettier.format(sourceCode, options);
    
    expect(formattedCode).toBe(expected);
  });
});