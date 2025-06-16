import { AST } from 'prettier';
import { BaseTransform } from '../base-transform';
import { PrettierPluginOptions, ASTNode } from '../../types';

export class SortImportsTransform extends BaseTransform {
  name = 'sort-imports';
  optionKey = 'sortImports';
  languages = ['typescript', 'babel', 'babel-ts', 'flow', 'babel-flow'];

  transform(ast: AST, options: PrettierPluginOptions): void {
    if (!options.sortImports) {
      return;
    }

    this.traverseAST(ast as ASTNode, options);
  }

  private traverseAST(node: ASTNode, options: PrettierPluginOptions): void {
    // Process the current node if it's an import declaration
    if (node.type === 'ImportDeclaration') {
      this.sortImportSpecifiers(node);
      
      // Mark the node as having sorted imports
      node.hasSortedImports = true;
      
      // Store the original specifiers order for debugging
      node.originalSpecifiers = [...node.specifiers];
    }

    // Recursively process child nodes
    for (const key in node) {
      const child = node[key];
      
      // Skip non-object properties and null values
      if (child === null || typeof child !== 'object') {
        continue;
      }
      
      // Handle arrays of nodes
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object' && 'type' in item) {
            this.traverseAST(item, options);
          }
        }
      }
      // Handle single node objects
      else if ('type' in child) {
        this.traverseAST(child, options);
      }
    }
  }

  private sortImportSpecifiers(node: ASTNode): void {
    if (!node.specifiers || !Array.isArray(node.specifiers)) {
      return;
    }

    // Separate different types of import specifiers
    const defaultSpecifiers = node.specifiers.filter(
      spec => spec.type === 'ImportDefaultSpecifier'
    );
    
    const namespaceSpecifiers = node.specifiers.filter(
      spec => spec.type === 'ImportNamespaceSpecifier'
    );
    
    const namedSpecifiers = node.specifiers.filter(
      spec => spec.type === 'ImportSpecifier'
    );

    // Sort named import specifiers alphabetically and case-insensitively
    namedSpecifiers.sort((a, b) => {
      const nameA = a.imported?.name || a.local?.name || '';
      const nameB = b.imported?.name || b.local?.name || '';
      
      return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
    });

    // Reconstruct the specifiers array with the original order of different types
    // but with named imports sorted
    node.specifiers = [
      ...defaultSpecifiers,
      ...namespaceSpecifiers,
      ...namedSpecifiers
    ];
  }
}

export default new SortImportsTransform();