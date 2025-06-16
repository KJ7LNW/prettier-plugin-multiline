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
    // Unformatted code with spacing issues
    const unformattedCode = 'function test(  ){   return 42;}';
    
    // Format the code
    const formattedCode = await prettier.format(unformattedCode, options);
    
    // Check that the code was actually formatted (changed)
    expect(formattedCode).not.toBe(unformattedCode);
    
    // Simple check for expected formatting patterns
    expect(formattedCode).toContain('function test()');
    expect(formattedCode).toContain('return 42;');
  });

  it('should handle multiline expressions', async () => {
    // Unformatted multiline code
    const unformattedCode = `
    const arr = [1,2,3,4,5,6,7,8,9,10];
    const obj = {a:1,b:2,c:3,d:4,e:5,f:6};
    `;
    
    // Format the code
    const formattedCode = await prettier.format(unformattedCode, options);

    // Verify the code was formatted
    expect(formattedCode).not.toBe(unformattedCode);
    
    // The formatted code should maintain all the values
    expect(formattedCode).toContain('1');
    expect(formattedCode).toContain('10');
    expect(formattedCode).toContain('a:');
    expect(formattedCode).toContain('f:');
  });
});