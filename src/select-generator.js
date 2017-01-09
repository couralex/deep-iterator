import * as gen from './generators';

const LEAF = null;

const tagMap = {
  '[object Null]': LEAF,
  '[object Undefined]': LEAF,
  '[object Boolean]': LEAF,
  '[object Number]': LEAF,
  '[object String]': LEAF, // strings are excluded although they are iterable
  '[object Symbol]': LEAF,
  '[object Date]': LEAF,
  '[object RegExp]': LEAF,
  '[object Function]': LEAF,
  '[object GeneratorFunction]': LEAF,
  '[object Promise]': LEAF,
  '[object Array]': gen.arrayIterator,
  '[object Map]': gen.mapIterator
};

export default function makeSelectGenerator(config) {
  const skipIteration = config.skipIteration;
  const objectIterator = config.iterateOverObject ? gen.objectIterator : LEAF;
  return node => {
    if (skipIteration(node)) {
      return LEAF;
    }
    const stringTag = Object.prototype.toString.call(node.value);
    if (stringTag in tagMap) {
      return tagMap[stringTag];
    }
    if (typeof node.value[Symbol.iterator] === 'function') {
      return gen.genericIterator;
    }
    return objectIterator;
  }
}
