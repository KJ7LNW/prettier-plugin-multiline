import { SupportOptions } from 'prettier';

export const pluginOptions: SupportOptions = {
  multilineImports: {
    type: 'boolean',
    category: 'Global',
    default: false,
    description: 'Format imports on multiple lines.',
  },
  multilineArrays: {
    type: 'boolean',
    category: 'Global',
    default: false,
    description: 'Format array literals on multiple lines.',
  },
  multilineObjects: {
    type: 'boolean',
    category: 'Global',
    default: false,
    description: 'Format object literals on multiple lines.',
  },
  sortImports: {
    type: 'boolean',
    category: 'Global',
    default: false,
    description: 'Sort import specifiers.',
  },
  minItemsForMultiline: {
    type: 'int',
    category: 'Global',
    default: 1,
    description: 'Minimum number of items to trigger multiline formatting.',
  },
  debug: {
    type: 'boolean',
    category: 'Global',
    default: false,
    description: 'Enable debug output for the plugin.',
  },
  hookVariableDeclarations: {
    type: 'boolean',
    category: 'Global',
    default: false,
    description: 'Add a hook marker before variable declarations.',
  },
};