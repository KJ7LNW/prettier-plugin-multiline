import { AST, Options, Parser } from 'prettier';

export interface PrettierPluginOptions extends Options {
  multilineImports?: boolean;
  multilineArrays?: boolean;
  multilineObjects?: boolean;
  sortImports?: boolean;
  minItemsForMultiline?: number;
  [key: string]: any;
}

export interface ASTTransform {
  name: string;
  optionKey: keyof PrettierPluginOptions;
  languages: string[];
  transform(ast: AST, options: PrettierPluginOptions): void;
  shouldRun(options: PrettierPluginOptions): boolean;
}

export interface ASTNode {
  type: string;
  [key: string]: any;
}