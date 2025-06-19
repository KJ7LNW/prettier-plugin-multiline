import * as path from 'path';
import { debug, isDebugMode } from '../utils/debug';

/**
 * Gets the original printer from Prettier's internal implementation.
 * This is used to delegate printing to Prettier's default printer when needed.
 */
export function getOriginalPrinter(options?: any) {
  debug('getOriginalPrinter called');
  try {
    // Get the path to Prettier's installation
    const prettierPath = require.resolve('prettier');
    debug('Prettier path:', prettierPath);
    const prettierDir = path.dirname(prettierPath);
    debug('Prettier directory:', prettierDir);
    
    // The path to the internal printer may change between Prettier versions
    const originalPrinterPath = path.join(prettierDir, 'plugins', 'estree.js');
    debug('Original printer path:', originalPrinterPath);
    
    // Try to require the original printer
    debug('Requiring original printer module');
    const estreeModule = require(originalPrinterPath);
    debug('Estree module keys:', Object.keys(estreeModule));
    debug('Estree module printers keys:', Object.keys(estreeModule.printers));
    debug('Estree module printers.estree keys:', Object.keys(estreeModule.printers.estree));
    
    // The printer is in the 'printers.estree.print' path
    const originalPrinter = estreeModule.printers.estree.print;
    debug('Original printer type:', typeof originalPrinter);
    
    // Only return wrapped printer if debugging is enabled
    if (isDebugMode()) {
      // Create a wrapper function to log calls to the original printer
      const wrappedPrinter = function(path: any, options: any, print: any) {
        debug('Original printer called');
        const node = path.getValue();
        debug('Node type in original printer:', node.type);
        
        if (node.type === 'VariableDeclarator') {
          debug('VariableDeclarator node in original printer:', JSON.stringify(node, null, 2));
        }
        
        const result = originalPrinter(path, options, print);
        debug('Original printer result:', result);
        debug('Original printer result type:', typeof result);
        
        return result;
      };
      
      return wrappedPrinter;
    }
    
    // Return the original printer directly when debug is disabled
    return originalPrinter;
  } catch (error) {
    console.error('Failed to load original printer:', error);
    throw new Error('Must be able to load the original printer');
  }
}