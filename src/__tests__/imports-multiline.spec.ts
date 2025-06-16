import * as prettier from 'prettier';
import prettierPluginMultiline from '../index';
import { describe, it, expect } from 'vitest';
import { MultilineImportsTransform } from '../transforms/imports/multiline';

/**
 * Tests for the multiline import transformation.
 */
describe('Multiline Imports Transformation', () => {
  it('should transform single-line imports to multiline format with trailing commas', async () => {
    // This test verifies that our transform correctly marks nodes for multiline formatting
    // Note: The actual printing of multiline format will be implemented in a separate task
    
    // Create a mock AST with import declaration
    const mockAST: any = {
      type: 'Program',
      body: [{
        type: 'ImportDeclaration',
        specifiers: [
          { type: 'ImportSpecifier', imported: { name: 'a' }, local: { name: 'a' } },
          { type: 'ImportSpecifier', imported: { name: 'b' }, local: { name: 'b' } },
          { type: 'ImportSpecifier', imported: { name: 'c' }, local: { name: 'c' } }
        ],
        source: { value: 'z' }
      }]
    };
    
    // Apply our transform
    const transform = new MultilineImportsTransform();
    transform.transform(mockAST, { multilineImports: true });
    
    // Verify the node has been marked for multiline formatting
    const importNode = mockAST.body[0];
    expect(importNode.multiline).toBe(true);
    expect(importNode.trailingComma).toBe(true);
    expect(importNode.forcedBreak).toBe(true);
  });

  it('should not transform imports when the option is disabled', async () => {
    // Create a mock AST with import declaration
    const mockAST: any = {
      type: 'Program',
      body: [{
        type: 'ImportDeclaration',
        specifiers: [
          { type: 'ImportSpecifier', imported: { name: 'a' }, local: { name: 'a' } },
          { type: 'ImportSpecifier', imported: { name: 'b' }, local: { name: 'b' } },
          { type: 'ImportSpecifier', imported: { name: 'c' }, local: { name: 'c' } }
        ],
        source: { value: 'z' }
      }]
    };
    
    // Apply our transform with the option disabled
    const transform = new MultilineImportsTransform();
    transform.transform(mockAST, { multilineImports: false });
    
    // Verify the node has not been marked for multiline formatting
    const importNode = mockAST.body[0];
    expect(importNode.multiline).toBeUndefined();
    expect(importNode.trailingComma).toBeUndefined();
    expect(importNode.forcedBreak).toBeUndefined();
  });
});