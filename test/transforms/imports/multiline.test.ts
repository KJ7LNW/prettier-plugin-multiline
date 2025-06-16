import { describe, it, expect } from 'vitest';
import { AST } from 'prettier';
import { ASTNode, PrettierPluginOptions } from '../../../src/types';
import { MultilineImportsTransform } from '../../../src/transforms/imports/multiline';

describe('MultilineImportsTransform', () => {
  // Create an instance of the transform
  const transform = new MultilineImportsTransform();

  // Helper function to create a mock AST with import declarations
  function createMockAST(specifiersCount: number): AST {
    const importDeclaration: ASTNode = {
      type: 'ImportDeclaration',
      specifiers: Array(specifiersCount).fill(0).map(() => ({
        type: 'ImportSpecifier',
        imported: { type: 'Identifier', name: 'mockImport' },
        local: { type: 'Identifier', name: 'mockImport' }
      })),
      source: { type: 'StringLiteral', value: 'mock-module' }
    };

    return {
      type: 'Program',
      body: [importDeclaration]
    } as AST;
  }

  it('should mark import declarations with enough specifiers as multiline', () => {
    // Create a mock AST with 4 import specifiers (above the default threshold of 3)
    const ast = createMockAST(4);
    const options: PrettierPluginOptions = {
      multilineImports: true
    };

    // Apply the transform
    transform.transform(ast, options);

    // Get the import declaration node
    const importDeclaration = (ast as any).body[0];

    // Verify that the node has been marked for multiline formatting
    expect(importDeclaration.multiline).toBe(true);
    expect(importDeclaration.trailingComma).toBe(true);
    expect(importDeclaration.importKind).toBe('value');
    expect(importDeclaration.forcedBreak).toBe(true);
    expect(importDeclaration.breakParent).toBe(true);
    expect(importDeclaration.isMultilineImport).toBe(true);
  });

  it('should not mark import declarations with few specifiers as multiline', () => {
    // Create a mock AST with 2 import specifiers (below the default threshold of 3)
    const ast = createMockAST(2);
    const options: PrettierPluginOptions = {
      multilineImports: true
    };

    // Apply the transform
    transform.transform(ast, options);

    // Get the import declaration node
    const importDeclaration = (ast as any).body[0];

    // Verify that the node has not been marked for multiline formatting
    expect(importDeclaration.multiline).toBeUndefined();
    expect(importDeclaration.trailingComma).toBeUndefined();
  });

  it('should respect the minItemsForMultiline option', () => {
    // Create a mock AST with 2 import specifiers
    const ast = createMockAST(2);
    const options: PrettierPluginOptions = {
      multilineImports: true,
      minItemsForMultiline: 2 // Set threshold to 2 instead of default 3
    };

    // Apply the transform
    transform.transform(ast, options);

    // Get the import declaration node
    const importDeclaration = (ast as any).body[0];

    // Verify that the node has been marked for multiline formatting
    // because we lowered the threshold to 2
    expect(importDeclaration.multiline).toBe(true);
    expect(importDeclaration.trailingComma).toBe(true);
    expect(importDeclaration.forcedBreak).toBe(true);
    expect(importDeclaration.breakParent).toBe(true);
    expect(importDeclaration.isMultilineImport).toBe(true);
  });

  it('should not transform anything when multilineImports option is disabled', () => {
    // Create a mock AST with 4 import specifiers (above the default threshold of 3)
    const ast = createMockAST(4);
    const options: PrettierPluginOptions = {
      multilineImports: false
    };

    // Apply the transform
    transform.transform(ast, options);

    // Get the import declaration node
    const importDeclaration = (ast as any).body[0];

    // Verify that the node has not been marked for multiline formatting
    expect(importDeclaration.multiline).toBeUndefined();
    expect(importDeclaration.trailingComma).toBeUndefined();
  });
});