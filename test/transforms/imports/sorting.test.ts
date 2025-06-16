import { describe, it, expect } from 'vitest';
import * as prettier from 'prettier';
import prettierPluginMultiline from '../../../src/index';

/**
 * Tests for the import specifiers sorting transformation.
 */
describe('Import Specifiers Sorting', () => {
  it('should sort named import specifiers alphabetically when sortImports is enabled', async () => {
    const input = `import { c, a, b } from 'module';`;
    
    const formatted = await prettier.format(input, {
      parser: 'typescript',
      plugins: [prettierPluginMultiline],
      sortImports: true
    });
    
    // Expect alphabetically sorted imports
    expect(formatted).toContain('import { a, b, c }');
  });

  it('should sort named import specifiers case-insensitively', async () => {
    const input = `import { C, a, B } from 'module';`;
    
    const formatted = await prettier.format(input, {
      parser: 'typescript',
      plugins: [prettierPluginMultiline],
      sortImports: true
    });
    
    // Expect case-insensitive sorting (a, B, C or a, C, B depending on the implementation)
    // We're checking that 'a' comes before both 'B' and 'C'
    const match = formatted.match(/import\s*{\s*([^}]+)\s*}/);
    const importList = match ? match[1].trim() : '';
    
    expect(importList.indexOf('a')).toBeLessThan(importList.indexOf('B'));
    expect(importList.indexOf('a')).toBeLessThan(importList.indexOf('C'));
  });

  it('should not change the order of default and named imports', async () => {
    const input = `import DefaultExport, { c, a, b } from 'module';`;
    
    const formatted = await prettier.format(input, {
      parser: 'typescript',
      plugins: [prettierPluginMultiline],
      sortImports: true
    });
    
    // Expect default import to remain in its leading position,
    // but named imports to be sorted
    expect(formatted).toContain('import DefaultExport, { a, b, c }');
  });

  it('should handle namespace imports correctly', async () => {
    const input = `import * as namespaceImport from 'module';`;
    
    const formatted = await prettier.format(input, {
      parser: 'typescript',
      plugins: [prettierPluginMultiline],
      sortImports: true
    });
    
    // Namespace imports don't have specifiers to sort
    expect(formatted).toContain('import * as namespaceImport from');
  });

  it('should not sort import specifiers when sortImports is disabled', async () => {
    const input = `import { c, a, b } from 'module';`;
    
    const formatted = await prettier.format(input, {
      parser: 'typescript',
      plugins: [prettierPluginMultiline],
      sortImports: false
    });
    
    // Expect imports to remain in the original order
    expect(formatted).toContain('import { c, a, b }');
  });

  it('should handle default import alongside named imports', async () => {
    const input = `import MyDefault, { c, a, b } from 'module';`;
    
    const formatted = await prettier.format(input, {
      parser: 'typescript',
      plugins: [prettierPluginMultiline],
      sortImports: true
    });
    
    // Expect default import to remain in its leading position
    // and named imports to be sorted
    expect(formatted).toContain('import MyDefault, { a, b, c }');
  });
});