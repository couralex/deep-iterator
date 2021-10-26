import * as gen from './generators.js';

const TYPE_POSITION_IN_TAG = 8;

const tagMap = {
  '[object Null]': gen.LEAF,
  '[object Undefined]': gen.LEAF,
  '[object Boolean]': gen.LEAF,
  '[object Number]': gen.LEAF,
  '[object String]': gen.LEAF, // strings are excluded although they are iterable
  '[object Symbol]': gen.LEAF,
  '[object Date]': gen.LEAF,
  '[object RegExp]': gen.LEAF,
  '[object Function]': gen.LEAF,
  '[object GeneratorFunction]': gen.LEAF,
  '[object Promise]': gen.LEAF,
  '[object Array]': gen.arrayIterator,
  '[object Set]': gen.genericIterator,
  '[object Map]': gen.mapIterator,
  '[object UserDefinedIterable]': gen.genericIterator,
  '[object NonIterableObject]': gen.objectIterator
};

export function getTypeFromTag(tag) {
  return tag.slice(TYPE_POSITION_IN_TAG, tag.length - 1);
}

export function getTag(element) {
  const stringTag = Object.prototype.toString.call(element);
  if (stringTag in tagMap) {
    return stringTag;
  }
  if (typeof element[Symbol.iterator] === 'function') {
    return '[object UserDefinedIterable]';
  }
  return '[object NonIterableObject]';
}

export function getTagMap(config) {
  const myTagMap = Object.create(tagMap);
  if (!config.iterateOverObject) {
    myTagMap['[object NonIterableObject]'] = gen.LEAF;
  }
  return myTagMap;
}
