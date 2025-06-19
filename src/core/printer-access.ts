import * as path from 'path';

/**
 * Gets the original printer from Prettier's internal implementation.
 * This is used to delegate printing to Prettier's default printer when needed.
 */
export function getOriginalPrinter() {
  console.log('getOriginalPrinter called');
  try {
    // Get the path to Prettier's installation
    const prettierPath = require.resolve('prettier');
    console.log('Prettier path:', prettierPath);
    const prettierDir = path.dirname(prettierPath);
    console.log('Prettier directory:', prettierDir);
    
    // The path to the internal printer may change between Prettier versions
    const originalPrinterPath = path.join(prettierDir, 'plugins', 'estree.js');
    console.log('Original printer path:', originalPrinterPath);
    
    // Try to require the original printer
    console.log('Requiring original printer module');
    const estreeModule = require(originalPrinterPath);
    console.log('Estree module keys:', Object.keys(estreeModule));
    console.log('Estree module printers keys:', Object.keys(estreeModule.printers));
    console.log('Estree module printers.estree keys:', Object.keys(estreeModule.printers.estree));
    
    // The printer is in the 'printers.estree.print' path
    const printer = estreeModule.printers.estree.print;
    console.log('Original printer type:', typeof printer);
    
    // Create a wrapper function to log calls to the original printer
    const wrappedPrinter = function(path: any, options: any, print: any) {
      console.log('Original printer called');
      const node = path.getValue();
      console.log('Node type in original printer:', node.type);
      
      if (node.type === 'VariableDeclarator') {
        console.log('VariableDeclarator node in original printer:', JSON.stringify(node, null, 2));
      }
      
      const result = printer(path, options, print);
      console.log('Original printer result:', result);
      console.log('Original printer result type:', typeof result);
      
      return result;
    };
    
    return wrappedPrinter;
  } catch (error) {
    console.error('Failed to load original printer:', error);
    throw new Error('Must be able to load the original printer');
  }
}