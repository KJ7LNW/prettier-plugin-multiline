import * as prettier from 'prettier';
import prettierPluginMultiline from '../src/index';
import { MultilineImportsTransform } from '../src/transforms/imports/multiline';
import { ASTNode } from '../src/types';

// Create a custom printer function that respects our multiline settings
function customPrinter(ast: any, options: any): string {
  // Apply our transform to the AST
  const transform = new MultilineImportsTransform();
  transform.transform(ast, options);
  
  // Process the AST to generate the formatted output
  let output = '';
  
  for (const node of ast.body) {
    if (node.type === 'ImportDeclaration') {
      const specifiers = node.specifiers.map((s: any) => s.local.name);
      const source = node.source.value;
      
      if (node.multiline) {
        // Format with multiline
        output += `import {\n  ${specifiers.join(',\n  ')},\n} from "${source}";\n`;
      } else {
        // Format without multiline
        output += `import { ${specifiers.join(', ')} } from "${source}";\n`;
      }
    }
  }
  
  return output;
}

// Parse TypeScript code to AST
function parseTypeScript(code: string): any {
  // Simple parser for demonstration purposes
  // This only handles import declarations
  const ast: any = { type: 'Program', body: [] };
  
  // Extract import declarations using regex
  const importRegex = /import\s*{([^}]*)}\s*from\s*['"]([^'"]*)['"]/g;
  let match;
  
  while ((match = importRegex.exec(code)) !== null) {
    const specifiersStr = match[1];
    const source = match[2];
    
    // Parse specifiers
    const specifiers = specifiersStr.split(',').map(s => {
      const name = s.trim();
      return {
        type: 'ImportSpecifier',
        imported: { name },
        local: { name }
      };
    });
    
    // Create import declaration node
    const importDeclaration = {
      type: 'ImportDeclaration',
      specifiers,
      source: { value: source }
    };
    
    // Add to AST
    ast.body.push(importDeclaration);
  }
  
  return ast;
}

async function showFormattingOutput() {
  console.log('=== Multiline Import Transformation Debug Output ===\n');
  
  // Example 1: Multiline imports enabled with 3 specifiers
  const input1 = `import {a, b, c} from 'z';`;
  const options1 = {
    multilineImports: true,
  };
  
  console.log('Example 1: Multiline imports enabled with 3 specifiers');
  console.log('Input:');
  console.log(input1);
  console.log('\nOutput:');
  const ast1 = parseTypeScript(input1);
  const output1 = customPrinter(ast1, options1);
  console.log(output1);
  
  // Example 2: Multiline imports disabled
  const input2 = `import {a, b, c} from 'z';`;
  const options2 = {
    multilineImports: false,
  };
  
  console.log('\nExample 2: Multiline imports disabled');
  console.log('Input:');
  console.log(input2);
  console.log('\nOutput:');
  const ast2 = parseTypeScript(input2);
  const output2 = customPrinter(ast2, options2);
  console.log(output2);
  
  // Example 3: Multiline imports with minItemsForMultiline option
  const input3 = `import {a, b} from 'z';`;
  const options3 = {
    multilineImports: true,
    minItemsForMultiline: 2,
  };
  
  console.log('\nExample 3: Multiline imports with minItemsForMultiline=2');
  console.log('Input:');
  console.log(input3);
  console.log('\nOutput:');
  const ast3 = parseTypeScript(input3);
  const output3 = customPrinter(ast3, options3);
  console.log(output3);
  
  // Example 4: Complex import with multiple specifiers
  const input4 = `import {Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter} from '@angular/core';`;
  const options4 = {
    multilineImports: true,
  };
  
  console.log('\nExample 4: Complex import with multiple specifiers');
  console.log('Input:');
  console.log(input4);
  console.log('\nOutput:');
  const ast4 = parseTypeScript(input4);
  const output4 = customPrinter(ast4, options4);
  console.log(output4);
  
  // Also show the actual Prettier output for comparison
  console.log('\n=== Actual Prettier Output ===\n');
  
  console.log('Example 4 with Prettier:');
  const prettierOutput = await prettier.format(input4, {
    parser: 'typescript',
    plugins: [prettierPluginMultiline],
    multilineImports: true,
  });
  console.log(prettierOutput);
}

// Run the function
showFormattingOutput().catch(console.error);