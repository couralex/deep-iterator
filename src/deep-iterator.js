import * as search from './search';
import RootNode from './root-node';
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
  const node = new RootNode(rootElement, config);
  const seen = makeSeen(config.circularReference);
  yield* search[config.search](node, config.onlyLeaves, seen);
}
