// This test harness is designed to validate Prettier's core functionality
// without involving any plugins. It ensures that the basic formatting
// capabilities are working as expected.
import * as prettier from 'prettier';
// Using vitest as requested
import { describe, it, expect } from 'vitest';

/**
 * Basic test harness to verify Prettier's core functionality.
 */
describe('Prettier Core Functionality', () => {
  const options: prettier.Options = {
    parser: 'typescript',
  };

  it('should invoke Prettier without throwing an error', async () => {
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

});