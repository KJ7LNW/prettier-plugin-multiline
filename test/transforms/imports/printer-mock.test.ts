import { describe, it, expect } from 'vitest';
import { MultilineImportsTransform } from '../../../src/transforms/imports/multiline';
import { ASTNode } from '../../../src/types';

describe('Import Formatting with Mock Printer', () => {
  // Create a mock printer function that simulates Prettier's printer
  // This function checks if the node has the multiline property and formats accordingly
  const mockPrinter = (node: ASTNode): string => {
    if (node.type === 'ImportDeclaration') {
      const specifiers = node.specifiers.map((s: any) => s.local.name).join(', ');
      
      if (node.multiline) {
        // Format with multiline
        return `import {\n  ${node.specifiers.map((s: any) => s.local.name).join(',\n  ')},\n} from "${node.source.value}";`;
      } else {
        // Format without multiline
        return `import { ${specifiers} } from "${node.source.value}";`;
      }
    }
    return '';
  };

  it('should format imports correctly when multiline option is enabled', () => {
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
    
    // Format the node using our mock printer
    const formatted = mockPrinter(importNode);
    
    // Expected output with multiline formatting
    const expected = `import {
  a,
  b,
  c,
} from "z";`;
    
    // Verify the formatting
    expect(formatted).toBe(expected);
  });
  
  it('should format imports correctly when multiline option is disabled', () => {
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
    
    // Format the node using our mock printer
    const formatted = mockPrinter(importNode);
    
    // Expected output with standard formatting (not multiline)
    const expected = `import { a, b, c } from "z";`;
    
    // Verify the formatting
    expect(formatted).toBe(expected);
  });
});