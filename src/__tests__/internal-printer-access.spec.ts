import { expect, it, describe } from 'vitest';
import * as prettier from 'prettier';
import { Plugin } from 'prettier';
import * as path from 'path';

describe('Internal Printer Access', () => {
  it('should demonstrate accessing the internal printer', async () => {
    // Simple test code with multiple variable declarations
    const input = `
import { a } from 'z';
const x =          1;
const y = 2;
const z = 3;
    `;
    
    // Step 1: Format with default prettier to see the expected output
    const standardOutput = await prettier.format(input, {
      parser: 'typescript',
    });
    console.log('Standard output:', standardOutput);
    
    // Step 2: Create a plugin that accesses the internal printer
    // Note: This approach is not recommended for production use as it relies on
    // Prettier's internal implementation details, which may change between versions.
    
    // Get the original printer - this happens only once when the plugin is initialized
    let originalPrinter;
    try {
      // Get the path to Prettier's installation
      const prettierPath = require.resolve('prettier');
      const prettierDir = path.dirname(prettierPath);
      
      // The path to the internal printer may change between Prettier versions
      const originalPrinterPath = path.join(prettierDir, 'plugins', 'estree.js');
      
      // Try to require the original printer
      const estreeModule = require(originalPrinterPath);
      console.log('estree module structure:', Object.keys(estreeModule));
      
      // The printer is in the 'printers.estree.print' path
      originalPrinter = estreeModule.printers.estree.print;
      console.log('Successfully loaded original printer');
    } catch (error) {
      console.error('Failed to load original printer:', error);
      throw new Error('Must be able to load the original printer');
    }
    
    const internalPrinterPlugin: Plugin = {
      parsers: {
        typescript: {
          ...require('prettier/parser-typescript').parsers.typescript,
        }
      },
      printers: {
        estree: {
          print: (path, options, print) => {
            const node = path.getValue();
            // Only modify VariableDeclaration nodes
            if (node.type === 'VariableDeclaration') {
              console.log('Plugin handling VariableDeclaration');
              
              // Use the original printer to print the declarations
              const declarationDocs = path.map(
                (childPath) => originalPrinter(childPath, options, print),
                'declarations'
              );
              
              // Add our hook marker before the variable declaration
              return ['/* Hooked */ ', ...declarationDocs];
            }

            // Use the original printer for all other node types
            return originalPrinter(path, options, print);
          }
        }
      }
    };
    
    // Step 3: Format with our plugin
    const pluginOutput = await prettier.format(input, {
      parser: 'typescript',
      plugins: [internalPrinterPlugin],
    });
    
    console.log('Plugin output:', pluginOutput);
    
    // Step 4: Verify the plugin output contains our hook marker
    expect(pluginOutput).toContain('/* Hooked */');
    
    // Step 5: Verify the plugin is working by checking that it's different from standard output
    expect(pluginOutput).not.toBe(standardOutput);
  });
});