import { ASTTransform } from '../types';
import sortImportsTransform from './imports/sort';
import multilineArraysTransform from './arrays/multiline';
import multilineObjectsTransform from './objects/multiline';

/**
 * Returns all available transformations
 */
export function getAllTransforms(): ASTTransform[] {
  return [
    sortImportsTransform,
    multilineArraysTransform,
    multilineObjectsTransform
  ];
}