import { Plugin } from 'prettier';
import { builders } from 'prettier/doc';
import { createWrappedParsers } from './core/parser-wrapper';
import { getAllTransforms } from './transforms';
import { pluginOptions } from './config/options';
import { PrintHookRegistry } from './hooks/registry';

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
        debug(options, 'Print function called');
        debug(options, 'Options:', options);
        
        const node = path.getValue();
        
        debug(options, 'Node type:', node.type);
        
        // Check if there's a registered hook for this node type
        const hook = PrintHookRegistry.getHook(node.type);
        
        // If a hook exists, use it
        if (hook) {
          debug(options, `Using registered hook for ${node.type}`);
          
          // Call the hook's print function
          const result = hook.print(path, options, print);
          
          // If the hook returns a non-null result, use it
          if (result !== null) {
            return result;
          }
          
          // Otherwise, fall back to the default printer
          debug(options, `Hook returned null, falling back to default printer`);
        }
        
        // For other nodes, return an empty string to defer to Prettier's default printer
        debug(options, `Returning empty string for ${node.type} node to use default printer`);
        
        return '';
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