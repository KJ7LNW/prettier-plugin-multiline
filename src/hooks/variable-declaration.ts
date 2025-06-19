import { PrinterHook } from './types';
import { PrintHookRegistry } from './registry';
import { getOriginalPrinter } from '../core/printer-access';

// Unregister the LiteralHook to prevent it from converting numbers to strings
// when using the variable declaration hook
PrintHookRegistry.unregister('Literal');

/**
 * Hook for handling VariableDeclaration nodes.
 * This hook adds a "/* Hooked *\/" comment before variable declarations.
 */
const VariableDeclarationHook: PrinterHook = {
  nodeType: 'VariableDeclaration',
  optionKey: 'hookVariableDeclarations',
  print: (path, options, print, originalPrinter) => {
    console.log('VariableDeclarationHook.print called');
    
    if (!options.hookVariableDeclarations) {
      console.log('hookVariableDeclarations option is disabled');
      return originalPrinter ? originalPrinter(path, options, print) : null;
    }

    const node = path.getValue();
    console.log('Node type:', node.type);
    console.log('Node structure:', JSON.stringify(node, null, 2));

    // Use the original printer to print each declaration individually
    console.log('Mapping over declarations');
    const declarationDocs = path.map(
      (childPath: any) => {
        const childNode = childPath.getValue();
        console.log('Declaration node type:', childNode.type);
        console.log('Declaration node structure:', JSON.stringify(childNode, null, 2));
        
        const result = originalPrinter(childPath, options, print);
        console.log('Original printer result for declaration:', result);
        console.log('Result type:', typeof result);
        
        return result;
      },
      'declarations'
    );
    
    console.log('All declaration docs:', declarationDocs);
    console.log('Declaration docs types:', declarationDocs.map((doc: any) => typeof doc));
    
    // Add our hook marker before the variable declaration
    const finalResult = ['/* Hooked */ ', ...declarationDocs];
    console.log('Final result:', finalResult);
    
    return finalResult;
  }
};

// Register the hook
PrintHookRegistry.register(VariableDeclarationHook);

// Export for testing
export { VariableDeclarationHook };