import * as search from './search';
import {getNode} from './node';
import makeSelectGenerator from './select-generator';
import makeSeen from './seen';

export default function* deepIterator(rootElement, options = {}) {
  const config = {
    onlyLeaves: false,
    circularReference: 'leaf',
    search: 'dfsPreOrder',
    iterateOverObject: true,
    skipIteration: () => false
  };

  if (options.onlyLeaves !== undefined) {
    config.onlyLeaves = options.onlyLeaves;
  }
  if (options.circularReference !== undefined) {
    config.circularReference = options.circularReference;
  }
  if (options.iterateOverObject !== undefined) {
    config.iterateOverObject = options.iterateOverObject;
  }
  if (options.skipIteration !== undefined) {
    config.skipIteration = options.skipIteration;
  }
  if (options.search !== undefined) {
    if (!(options.search in search)) {
      throw new Error(`The search algorithm ${options.search} is incorrect.`);
    }
    config.search = options.search;
  }
  const node = getNode(rootElement, undefined, undefined, []);
  const seen = makeSeen(config.circularReference);
  yield* search[config.search](node, makeSelectGenerator(config), config.onlyLeaves, seen);
}
