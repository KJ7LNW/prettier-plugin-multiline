import { Plugin } from 'prettier';
import { builders } from 'prettier/doc';
import { pluginOptions } from './config/options';
import { PrintHookRegistry } from './hooks/registry';
import { getOriginalPrinter } from './core/printer-access';
import { debug, setDebugState } from './utils/debug';

// Import hooks
import './hooks/import-multiline';

// Import the doc builders from prettier
const { group, indent, hardline, join, line } = builders;

// Initialize debug state to off by default
setDebugState(false);

// Create and export the plugin
const prettierPluginMultiline: Plugin = {
  parsers: {
    typescript: {
      ...require("prettier/parser-typescript").parsers.typescript
    },
    babel: {
      ...require("prettier/parser-babel").parsers.babel
    },
    "babel-ts": {
      ...require("prettier/parser-babel").parsers["babel-ts"]
    },
    flow: {
      ...require("prettier/parser-flow").parsers.flow
    },
    "babel-flow": {
      ...require("prettier/parser-babel").parsers["babel-flow"]
    }
  },
  options: pluginOptions,
  printers: {
    estree: {
      print: (path, options, print) => {
        // Set global debug state based on options as early as possible
        setDebugState(options && options.debug === true);
        
        debug('=== Plugin print function called ===');
        debug('Print function called');
        debug('Options:', options);
        
        const node = path.getValue();
        debug('Node type:', node.type);
        
        if (node.type === 'VariableDeclaration') {
          debug('Variable declaration node structure:', JSON.stringify(node, null, 2));
        }
        
        // Get the original printer - pass options to ensure debug state is considered
        const originalPrinter = getOriginalPrinter(options);
        debug('Original printer type:', typeof originalPrinter);
        
        // Check if there's a registered hook for this node type
        const hook = PrintHookRegistry.getHook(node.type);
        debug('Hook found for node type:', node.type, !!hook);
        
        // If a hook exists, use it
        if (hook) {
          debug('Using hook for node type:', node.type);
          debug(`Using registered hook for ${node.type}`);
          
          // Call the hook's print function with originalPrinter as fourth argument
          debug('Calling hook.print');
          const result = hook.print(path, options, print, originalPrinter);
          debug('Hook result:', result);
          debug('Hook result type:', typeof result);
          
          if (Array.isArray(result)) {
            debug('Result is an array with length:', result.length);
            debug('Array elements:', result.map((item: any) => typeof item));
          }
          
          // If the hook returns a non-null result, use it
          if (result !== null) {
            debug('Returning hook result');
            return result;
          }
          
          debug('Hook returned null');
          debug(`Hook returned null, using original printer`);
        }
        
        // For all other cases, use the original printer directly
        debug('Using original printer for node type:', node.type);
        debug(`Using original printer for ${node.type} node`);
        
        const originalResult = originalPrinter(path, options, print);
        debug('Original printer result:', originalResult);
        
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