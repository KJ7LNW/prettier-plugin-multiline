import { AST } from 'prettier';
import { BaseTransform } from '../base-transform';
import { PrettierPluginOptions, ASTNode } from '../../types';
import { traverseAST } from '../../core/ast-utils';

export class MultilineImportsTransform extends BaseTransform {
  name = 'multiline-imports';
  optionKey = 'multilineImports';
  languages = ['typescript', 'babel', 'babel-ts', 'flow', 'babel-flow'];

  transform(ast: AST, options: PrettierPluginOptions): void {
    if (!options.multilineImports) {
      return;
    }

    // For multiline imports, we need to modify the AST structure
    // to force Prettier to format the imports on multiple lines
    if (!options.multilineImports) {
      return;
    }
    
    traverseAST(ast, (node: ASTNode) => {
      if (node.type === 'ImportDeclaration' && node.specifiers) {
        // Only apply to import declarations with named specifiers
        const namedSpecifiers = node.specifiers.filter(
          (specifier: ASTNode) => specifier.type === 'ImportSpecifier'
        );

        if (namedSpecifiers.length >= (options.minItemsForMultiline || 3)) {
          // Set properties that Prettier's printer will recognize for multiline formatting
          
          // Mark the node for multiline formatting
          node.multiline = true;
          
          // Add importKind if not present to ensure proper formatting
          node.importKind = node.importKind || 'value';
          
          // Set flags to force multiline formatting
          node.forcedBreak = true;
          node.breakParent = true;
          
          // Set the trailingComma property
          node.trailingComma = true;
          
          // Add a property to the node to indicate that it should be printed with a trailing comma
          node.isMultilineImport = true;
          
          // Add a property to force line breaks between specifiers
          node.importSpecifiers = true;
          
          // Add a property to force the printer to use multiline formatting
          node.loc = {
            start: { line: 1, column: 0 },
            end: { line: namedSpecifiers.length + 2, column: 0 }
          };
          
          // Replace the original specifiers with a new array of specifiers
          // that have the necessary properties to force multiline formatting
          const newSpecifiers = [];
          
          for (let i = 0; i < node.specifiers.length; i++) {
            const specifier = node.specifiers[i];
            
            // Create a new specifier with the same properties
            const newSpecifier = { ...specifier };
            
            // Add properties to force line breaks
            newSpecifier.forcedBreak = true;
            newSpecifier.breakParent = true;
            
            // Add location information to force line breaks
            newSpecifier.loc = {
              start: { line: i + 2, column: 0 },
              end: { line: i + 2, column: 10 }
            };
            
            // Add the new specifier to the array
            newSpecifiers.push(newSpecifier);
          }
          
          // Replace the original specifiers with the new ones
          node.specifiers = newSpecifiers;
          
          // Modify the node's properties to make it appear very long
          // This will trick Prettier into formatting it on multiple lines
          node.original = {
            range: [0, 1000],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 100, column: 0 }
            }
          };
        }
      }
    });
  }
}

export default new MultilineImportsTransform();