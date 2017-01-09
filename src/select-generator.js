import * as gen from './generators';

const tagMap = {
  '[object Null]': null,
  '[object Undefined]': null,
  '[object Array]': gen.arrayIterator,
  '[object String]': null, // strings are excluded although they are iterable
  '[object Date]': null,
  '[object Number]': null,
  '[object RegExp]': null,
  '[object Function]': null,
  '[object Map]': gen.mapIterator
};

export default function makeSelectGenerator(config) {
  const skipIteration = config.skipIteration;
  const objectIterator = config.iterateOverObject ? gen.objectIterator : null;
  return node => {
    if (skipIteration(node)) {
      return null;
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
