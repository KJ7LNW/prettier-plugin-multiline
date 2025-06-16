import { Parser, Options } from 'prettier';
import { getAllTransforms } from '../transforms';
import { ASTTransform, PrettierPluginOptions } from '../types';

/**
 * Creates wrapped versions of Prettier parsers that apply our transformations
 */
export function createWrappedParsers(parserNames: string[]) {
  const transforms = getAllTransforms();
  const parsers: Record<string, Parser> = {};
  
  for (const parserName of parserNames) {
    parsers[parserName] = {
      parse: (text, options) => {
        // Get the original parser from Prettier
        const originalParser = require(`prettier/parser-${parserName}`).parsers[parserName];
        
        // Parse the text using the original parser
        const ast = originalParser.parse(text, options);
        
        // Apply our transformations
        applyTransforms(ast, options as PrettierPluginOptions, transforms, parserName);
        
        return ast;
      },
      astFormat: 'estree',
      locStart: (node) => node.start || 0,
      locEnd: (node) => node.end || 0,
    };
  }
  
  return parsers;
}

/**
 * Applies all relevant transforms to the AST
 */
function applyTransforms(
  ast: any,
  options: PrettierPluginOptions,
  transforms: ASTTransform[],
  parserName: string
): void {
  for (const transform of transforms) {
    // Only apply transforms that are enabled and support the current parser language
    if (
      transform.shouldRun(options) &&
      transform.languages.includes(parserName)
    ) {
      transform.transform(ast, options);
    }
  }
}