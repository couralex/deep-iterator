import {LEAF} from './generators';
import {getTag, getTypeFromTag} from './tag';


export default class Node {
  constructor(key, value, parentNode, isCircular) {
    this._value = value;
    this._key = key;
    this._parent = parentNode.value,
    this._parentNode = parentNode;
    this._selectGenerator = parentNode._selectGenerator;
    this._tag = getTag(value);
    this._generator = this._selectGenerator.getGenerator(this._tag);
    this._isCircular = isCircular;
    this._isLeaf = this._generator === LEAF || this._isCircular;
    if (!this._isLeaf && this._selectGenerator.skipIteration(this)) {
      this._isLeaf = true;
      this._generator = LEAF;
    }
  }

  createIterator() {
    if (this._generator === LEAF) {
      throw new Error("createIterator called on a non iterable node.");
    }
    return this._generator(this.value);
  }

  get value() {
    return this._value;
  }

  get key() {
    return this._key;
  }

  get parent() {
    return this._parent;
  }

  get parentNode() {
    return this._parentNode;
  }

  get path() { // evaluated only when needed - could memoize it
    return [...this.parentNode.path, this.key];
  }

  get type() {
    // simple memoization
    /* istanbul ignore next */
    if (this._type === undefined) {
      this._type = getTypeFromTag(this._tag);
    }
    return this._type;
  }

  isCircular() {
    return this._isCircular;
  }

  isLeaf() {
    return this._isLeaf;
  }

  isNull() {
    return this.type === 'Null';
  }

  isUndefined() {
    return this.type === 'Undefined';
  }

  isBoolean() {
    return this.type === 'Boolean';
  }

  isNumber() {
    return this.type === 'Number';
  }

  isString() {
    return this.type === 'String';
  }

  isSymbol() {
    return this.type === 'Symbol';
  }

  isDate() {
    return this.type === 'Date';
  }

  isRegExp() {
    return this.type === 'RegExp';
  }

  isFunction() {
    return this.type === 'Function';
  }

  isGeneratorFunction() {
    return this.type === 'GeneratorFunction';
  }

  isPromise() {
    return this.type === 'Promise';
  }

  isArray() {
    return this.type === 'Array';
  }

  isSet() {
    return this.type === 'Set';
  }

  isMap() {
    return this.type === 'Map';
  }

  isUserDefinedIterable() {
    return this.type === 'UserDefinedIterable';
  }

  isNonIterableObject() {
    return this.type === 'NonIterableObject';
  }

}
