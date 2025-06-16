import * as prettier from 'prettier';
import prettierPluginMultiline from '../index';
import { describe, it, expect } from 'vitest';

/**
 * Tests for the multiline import transformation.
 */
describe('Multiline Imports Formatting', () => {
  it('should format imports on multiple lines when multilineImports is enabled', async () => {
    const input = `import {a, b, c} from 'z';`;
    
    const formatted = await prettier.format(input, {
      parser: 'typescript',
      plugins: [prettierPluginMultiline],
      multilineImports: true
    });
    
    // Expect multiline format with each import on its own line
    expect(formatted).toContain('import {');
    expect(formatted).toContain('  a,');
    expect(formatted).toContain('  b,');
    expect(formatted).toContain('  c,');
    expect(formatted).toContain('} from');
  });

  it('should not format imports on multiple lines when multilineImports is disabled', async () => {
    const input = `import {a, b, c} from 'z';`;
    
    const formatted = await prettier.format(input, {
      parser: 'typescript',
      plugins: [prettierPluginMultiline],
      multilineImports: false
    });
    
    // Expect single-line format
    expect(formatted).toContain('import { a, b, c }');
    // Check that it doesn't have a line break after the opening brace
    expect(formatted).not.toContain('import {\n');
    expect(formatted).not.toContain('  a,');
  });
  
  it('should respect minItemsForMultiline option', async () => {
    const input = `import {a} from 'z';`;
    
    const formatted = await prettier.format(input, {
      parser: 'typescript',
      plugins: [prettierPluginMultiline],
      multilineImports: true,
      minItemsForMultiline: 2
    });
    
    // Expect single-line format since there's only one import and minItemsForMultiline is 2
    expect(formatted).toContain('import { a }');
    // Check that it doesn't have a line break after the opening brace
    expect(formatted).not.toContain('import {\n');
    expect(formatted).not.toContain('  a,');
  });
});