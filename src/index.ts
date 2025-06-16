import { Plugin } from 'prettier';
import { createWrappedParsers } from './core/parser-wrapper';
import { getAllTransforms } from './transforms';
import { pluginOptions } from './config/options';

// Create and export the plugin
const prettierPluginMultiline: Plugin = {
  parsers: createWrappedParsers([
    'typescript',
    'babel',
    'babel-ts',
    'flow',
    'babel-flow'
  ]),
  options: pluginOptions
};

export default prettierPluginMultiline;