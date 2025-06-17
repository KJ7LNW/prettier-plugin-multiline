import { ASTTransform } from '../types';
import multilineArraysTransform from './arrays/multiline';
import multilineObjectsTransform from './objects/multiline';

/**
 * Returns all available transformations
 */
export function getAllTransforms(): ASTTransform[] {
  return [
    multilineArraysTransform,
    multilineObjectsTransform
  ];
}