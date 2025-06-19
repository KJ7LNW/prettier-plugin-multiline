import { Options } from 'prettier';

export interface PrettierPluginOptions extends Options {
  multilineImports?: boolean;
  sortImports?: boolean;
  minItemsForMultiline?: number;
  [key: string]: any;
}

export interface ASTNode {
  type: string;
  [key: string]: any;
}