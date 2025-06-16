import { Plugin } from 'prettier';
import { builders } from 'prettier/doc';
import { createWrappedParsers } from './core/parser-wrapper';
import { getAllTransforms } from './transforms';
import { pluginOptions } from './config/options';

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
        
        // Handle Program node by printing all its children
        if (node.type === 'Program') {
          debug(options, 'Processing Program node');
          
          // Print all the body elements
          return join(hardline, path.map(print, 'body'));
        }
        
        // Handle ImportDeclaration nodes when multilineImports is enabled
        if (node.type === 'ImportDeclaration') {
          debug(options, 'Processing ImportDeclaration', {
            multilineImports: options.multilineImports,
            minItemsForMultiline: options.minItemsForMultiline,
            specifiersCount: node.specifiers?.length
          });
          
          // Check if multilineImports option is enabled
          if (options.multilineImports === true) {
            // Filter for ImportSpecifier nodes (named imports)
            const specifiers = node.specifiers.filter(
              (specifier: any) => specifier.type === 'ImportSpecifier'
            );
            
            debug(options, 'Filtered specifiers count:', specifiers.length);
            
            // Check if we have enough specifiers to trigger multiline formatting
            if (specifiers.length >= (options.minItemsForMultiline || 1)) {
              debug(options, 'Applying multiline formatting');
              
              // Return a doc that formats the import declaration with each specifier on its own line
              return group([
                'import ',
                '{',
                indent([
                  hardline,
                  join([',', hardline], path.map(print, 'specifiers'))
                ]),
                ',', // Add trailing comma
                hardline,
                '}',
                ' from ',
                path.call(print, 'source'),
                ';'
              ]);
            }
          }
        }
        
        // Handle ImportSpecifier nodes
        if (node.type === 'ImportSpecifier') {
          debug(options, 'Processing ImportSpecifier node');
          
          // Print the local name of the import specifier
          return node.local.name;
        }
        
        // Handle Literal nodes (for the source of import declarations)
        if (node.type === 'Literal') {
          debug(options, 'Processing Literal node');
          
          // Print the string literal with quotes
          return `"${node.value}"`;
        }
        
        // For other nodes, return an empty string to defer to Prettier's default printer
        debug(options, `Returning empty string for ${node.type} node`);
        
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