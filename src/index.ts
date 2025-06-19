import { Plugin } from 'prettier';
import { builders } from 'prettier/doc';
import { createWrappedParsers } from './core/parser-wrapper';
import { getAllTransforms } from './transforms';
import { pluginOptions } from './config/options';
import { PrintHookRegistry } from './hooks/registry';
import { getOriginalPrinter } from './core/printer-access';

// Import hooks
import './hooks/import-multiline';

// Import the doc builders from prettier
const { group, indent, hardline, join, line } = builders;

// Debug function to log information
function debug(options: any, ...args: any[]) {
  if (options && options.debug === true) {
    console.log('[prettier-plugin-multiline]', ...args);
  }
}

// Create and export the plugin
const prettierPluginMultiline: Plugin = {
  parsers: createWrappedParsers([
    'typescript',
    'babel',
    'babel-ts',
    'flow',
    'babel-flow'
  ]),
  options: pluginOptions,
  printers: {
    estree: {
      print: (path, options, print) => {
        console.log('=== Plugin print function called ===');
        debug(options, 'Print function called');
        debug(options, 'Options:', options);
        
        const node = path.getValue();
        console.log('Node type:', node.type);
        
        if (node.type === 'VariableDeclaration') {
          console.log('Variable declaration node structure:', JSON.stringify(node, null, 2));
        }
        
        debug(options, 'Node type:', node.type);
        
        // Get the original printer - this happens only once when the plugin is initialized
        const originalPrinter = getOriginalPrinter();
        console.log('Original printer type:', typeof originalPrinter);
        
        // Check if there's a registered hook for this node type
        const hook = PrintHookRegistry.getHook(node.type);
        console.log('Hook found for node type:', node.type, !!hook);
        
        // If a hook exists, use it
        if (hook) {
          console.log('Using hook for node type:', node.type);
          debug(options, `Using registered hook for ${node.type}`);
          
          // Call the hook's print function with originalPrinter as fourth argument
          console.log('Calling hook.print');
          const result = hook.print(path, options, print, originalPrinter);
          console.log('Hook result:', result);
          console.log('Hook result type:', typeof result);
          
          if (Array.isArray(result)) {
            console.log('Result is an array with length:', result.length);
            console.log('Array elements:', result.map((item: any) => typeof item));
          }
          
          // If the hook returns a non-null result, use it
          if (result !== null) {
            console.log('Returning hook result');
            return result;
          }
          
          console.log('Hook returned null');
          debug(options, `Hook returned null, using original printer`);
        }
        
        // For all other cases, use the original printer directly
        console.log('Using original printer for node type:', node.type);
        debug(options, `Using original printer for ${node.type} node`);
        
        const originalResult = originalPrinter(path, options, print);
        console.log('Original printer result:', originalResult);
        console.log('Original printer result type:', typeof originalResult);
        
        return originalResult;
      }
    }
  }
};

// Export the plugin
export default prettierPluginMultiline;

// Also export as CommonJS for compatibility
// @ts-ignore
if (typeof module !== 'undefined') {
  // @ts-ignore
  module.exports = prettierPluginMultiline;
}