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
        
        // Handle ImportDeclaration nodes
        if (node.type === 'ImportDeclaration') {
          debug(options, 'Processing ImportDeclaration', {
            multilineImports: options.multilineImports,
            sortImports: options.sortImports,
            minItemsForMultiline: options.minItemsForMultiline,
            specifiersCount: node.specifiers?.length,
            hasSortedImports: node.hasSortedImports
          });
          
          // Get all specifiers
          const defaultSpecifiers = node.specifiers.filter(
            (specifier: any) => specifier.type === 'ImportDefaultSpecifier'
          );
          
          const namespaceSpecifiers = node.specifiers.filter(
            (specifier: any) => specifier.type === 'ImportNamespaceSpecifier'
          );
          
          const namedSpecifiers = node.specifiers.filter(
            (specifier: any) => specifier.type === 'ImportSpecifier'
          );
          
          // Check if multilineImports option is enabled
          if (options.multilineImports === true &&
              namedSpecifiers.length >= (options.minItemsForMultiline || 1)) {
            debug(options, 'Applying multiline formatting');
            
            // Build the import parts
            const importParts: any[] = ['import '];
            
            // Add default import if present
            if (defaultSpecifiers.length > 0) {
              importParts.push(path.call(print, 'specifiers', node.specifiers.indexOf(defaultSpecifiers[0])));
              
              if (namespaceSpecifiers.length > 0 || namedSpecifiers.length > 0) {
                importParts.push(', ');
              }
            }
            
            // Add namespace import if present
            if (namespaceSpecifiers.length > 0) {
              importParts.push(path.call(print, 'specifiers', node.specifiers.indexOf(namespaceSpecifiers[0])));
              
              if (namedSpecifiers.length > 0) {
                importParts.push(', ');
              }
            }
            
            // Add named imports if present
            if (namedSpecifiers.length > 0) {
              // For multiline imports, we need to sort the specifiers if sortImports is enabled
              if (options.sortImports) {
                // Sort the named specifiers alphabetically and case-insensitively
                namedSpecifiers.sort((a: any, b: any) => {
                  const nameA = a.imported?.name || a.local?.name || '';
                  const nameB = b.imported?.name || b.local?.name || '';
                  
                  return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
                });
              }
              
              importParts.push(
                '{',
                indent([
                  hardline,
                  join([',', hardline], namedSpecifiers.map((_: any, i: number) =>
                    path.call(print, 'specifiers', node.specifiers.indexOf(namedSpecifiers[i]))
                  ))
                ]),
                ',', // Add trailing comma
                hardline,
                '}'
              );
            }
            
            // Add source
            importParts.push(' from ', path.call(print, 'source'), ';');
            
            return group(importParts);
          } else {
            // For single-line imports, build the parts
            const importParts: any[] = ['import '];
            
            // Add default import if present
            if (defaultSpecifiers.length > 0) {
              importParts.push(path.call(print, 'specifiers', node.specifiers.indexOf(defaultSpecifiers[0])));
              
              if (namespaceSpecifiers.length > 0 || namedSpecifiers.length > 0) {
                importParts.push(', ');
              }
            }
            
            // Add namespace import if present
            if (namespaceSpecifiers.length > 0) {
              importParts.push(path.call(print, 'specifiers', node.specifiers.indexOf(namespaceSpecifiers[0])));
              
              if (namedSpecifiers.length > 0) {
                importParts.push(', ');
              }
            }
            
            // Add named imports if present
            if (namedSpecifiers.length > 0) {
              // For single-line imports, we need to sort the specifiers if sortImports is enabled
              if (options.sortImports) {
                // Sort the named specifiers alphabetically and case-insensitively
                namedSpecifiers.sort((a: any, b: any) => {
                  const nameA = a.imported?.name || a.local?.name || '';
                  const nameB = b.imported?.name || b.local?.name || '';
                  
                  return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
                });
              }
              
              importParts.push('{ ');
              
              importParts.push(
                join(', ', namedSpecifiers.map((_: any, i: number) =>
                  path.call(print, 'specifiers', node.specifiers.indexOf(namedSpecifiers[i]))
                ))
              );
              
              importParts.push(' }');
            }
            
            // Add source
            importParts.push(' from ', path.call(print, 'source'), ';');
            
            return group(importParts);
          }
        }
        
        // Handle ImportSpecifier nodes
        if (node.type === 'ImportSpecifier') {
          debug(options, 'Processing ImportSpecifier node');
          
          // Print the local name of the import specifier
          return node.local.name;
        }
        
        // Handle ImportDefaultSpecifier nodes
        if (node.type === 'ImportDefaultSpecifier') {
          debug(options, 'Processing ImportDefaultSpecifier node');
          
          // Print the local name of the default import specifier
          return node.local.name;
        }
        
        // Handle ImportNamespaceSpecifier nodes
        if (node.type === 'ImportNamespaceSpecifier') {
          debug(options, 'Processing ImportNamespaceSpecifier node');
          
          // Print the namespace import specifier
          return `* as ${node.local.name}`;
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