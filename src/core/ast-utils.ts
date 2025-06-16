import { ASTNode } from '../types';

/**
 * Recursively traverses an AST node and applies the visitor function to each node
 * @param node The AST node to traverse
 * @param visitor Function to apply to each node during traversal
 */
export function traverseAST(node: ASTNode, visitor: (node: ASTNode) => void): void {
  if (!node || typeof node !== 'object') {
    return;
  }

  visitor(node);

  for (const key in node) {
    if (node.hasOwnProperty(key)) {
      const child = node[key];
      
      if (child === null || typeof child !== 'object') {
        continue;
      }
      
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object') {
            traverseAST(item, visitor);
          }
        }
      } else {
        traverseAST(child, visitor);
      }
    }
  }
}