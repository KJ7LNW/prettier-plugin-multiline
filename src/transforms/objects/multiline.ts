import { AST } from 'prettier';
import { BaseTransform } from '../base-transform';
import { PrettierPluginOptions } from '../../types';

export class MultilineObjectsTransform extends BaseTransform {
  name = 'multiline-objects';
  optionKey = 'multilineObjects';
  languages = ['typescript', 'babel', 'babel-ts', 'flow', 'babel-flow'];

  transform(ast: AST, options: PrettierPluginOptions): void {
    // This will be implemented later
    // For now, just a stub to support our imports
  }
}

export default new MultilineObjectsTransform();