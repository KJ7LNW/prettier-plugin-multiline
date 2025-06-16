import { describe, it, expect } from 'vitest';
import { MultilineImportsTransform } from '../../../src/transforms/imports/multiline';
import { ASTNode } from '../../../src/types';

describe('Import Formatting', () => {
  it('should mark imports for multiline formatting when option is enabled', () => {
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
    
    // Get the import declaration node
    const importNode = mockAST.body[0];
    
    // Verify the node has been marked for multiline formatting
    expect(importNode.multiline).toBe(true);
    expect(importNode.trailingComma).toBe(true);
    expect(importNode.forcedBreak).toBe(true);
    expect(importNode.breakParent).toBe(true);
    expect(importNode.isMultilineImport).toBe(true);
    
    // Verify specifiers have been marked for multiline formatting
    for (const specifier of importNode.specifiers) {
      expect(specifier.forcedBreak).toBe(true);
    }
  });
  
  it('should not mark imports for multiline formatting when option is disabled', () => {
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
    
    // Get the import declaration node
    const importNode = mockAST.body[0];
    
    // Verify the node has not been marked for multiline formatting
    expect(importNode.multiline).toBeUndefined();
    expect(importNode.trailingComma).toBeUndefined();
    expect(importNode.forcedBreak).toBeUndefined();
    expect(importNode.openingBraceToken).toBeUndefined();
    expect(importNode.closingBraceToken).toBeUndefined();
  });
  
  it('should respect minItemsForMultiline option', () => {
    // Create a mock AST with import declaration with 2 specifiers
    const mockAST: any = {
      type: 'Program',
      body: [{
        type: 'ImportDeclaration',
        specifiers: [
          { type: 'ImportSpecifier', imported: { name: 'a' }, local: { name: 'a' } },
          { type: 'ImportSpecifier', imported: { name: 'b' }, local: { name: 'b' } }
        ],
        source: { value: 'z' }
      }]
    };
    
    // Apply our transform with default minItemsForMultiline (3)
    const transform1 = new MultilineImportsTransform();
    transform1.transform(mockAST, { multilineImports: true });
    
    // Get the import declaration node
    const importNode1 = mockAST.body[0];
    
    // Verify the node has not been marked for multiline formatting
    // because it has fewer specifiers than the default threshold
    expect(importNode1.multiline).toBeUndefined();
    
    // Create a new mock AST for the second test
    const mockAST2: any = {
      type: 'Program',
      body: [{
        type: 'ImportDeclaration',
        specifiers: [
          { type: 'ImportSpecifier', imported: { name: 'a' }, local: { name: 'a' } },
          { type: 'ImportSpecifier', imported: { name: 'b' }, local: { name: 'b' } }
        ],
        source: { value: 'z' }
      }]
    };
    
    // Apply our transform with minItemsForMultiline set to 2
    const transform2 = new MultilineImportsTransform();
    transform2.transform(mockAST2, { multilineImports: true, minItemsForMultiline: 2 });
    
    // Get the import declaration node
    const importNode2 = mockAST2.body[0];
    
    // Verify the node has been marked for multiline formatting
    // because we lowered the threshold to 2
    expect(importNode2.multiline).toBe(true);
    expect(importNode2.trailingComma).toBe(true);
    expect(importNode2.forcedBreak).toBe(true);
    expect(importNode2.breakParent).toBe(true);
    expect(importNode2.isMultilineImport).toBe(true);
  });
});