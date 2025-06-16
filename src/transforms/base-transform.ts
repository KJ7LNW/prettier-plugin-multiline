import { AST } from 'prettier';
import { ASTTransform, PrettierPluginOptions } from '../types';

export abstract class BaseTransform implements ASTTransform {
  abstract name: string;
  abstract optionKey: keyof PrettierPluginOptions;
  abstract languages: string[];
  
  abstract transform(ast: AST, options: PrettierPluginOptions): void;
  
  shouldRun(options: PrettierPluginOptions): boolean {
    return Boolean(options[this.optionKey]);
  }
}