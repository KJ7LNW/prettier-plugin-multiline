import { AST } from 'prettier';
import { BaseTransform } from '../base-transform';
import { PrettierPluginOptions, ASTNode } from '../../types';

export class SortImportsTransform extends BaseTransform {
  name = 'sort-imports';
  optionKey = 'sortImports';
  languages = ['typescript', 'babel', 'babel-ts', 'flow', 'babel-flow'];

  transform(ast: AST, options: PrettierPluginOptions): void {
    // This will be implemented later
    // For now, just a stub to support our imports
  }
}

export default new SortImportsTransform();