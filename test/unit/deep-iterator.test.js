import {expect} from 'chai';
import deepIterator from '../../src/deep-iterator';

function deepIteratorResult(testee, options) {
  return [...deepIterator(testee, options)];
}

function deepIteratorResultValues(...args) {
  return deepIteratorResult(...args).map(element => element.value);
}

describe('deepIterator', function() {
  describe('incorrect options', function() {
    it('should throw on an incorrect search option ', function () {
      expect(() => deepIterator({}, {search: 'exotic'}).next()).to.throw();
    });
    it('should throw on an incorrect circularReference option ', function () {
      expect(() => deepIterator({}, {circularReference: 'exotic'}).next()).to.throw();
    });
  });
  describe('options: default', function() {
    describe('iteration', function() {
      it('should produce one element for a non-iterable argument', function () {
        const result = deepIteratorResultValues(3);
        const expected = [3];
        expect(result).to.deep.equal(expected);
      });
      it('should iterate over an object', function () {
        const testee = {a: 1, b: 2}
        const result = deepIteratorResultValues(testee);
        const expected = [testee, 1, 2];
        expect(result).to.deep.equal(expected);
      });
      it('should iterate over an array', function () {
        const testee = [1, 2, 3];
        const result = deepIteratorResultValues(testee);
        const expected = [testee, 1, 2, 3];
        expect(result).to.deep.equal(expected);
      });
      it('should iterate over a Map', function () {
        const testee = new Map([['k1', 1], ['k2', 2]]);
        const result = deepIteratorResultValues(testee);
        const expected = [testee, 1, 2];
        expect(result).to.deep.equal(expected);
      });
      it('should iterate over a Set', function () {
        const testee = new Set([1, 2, 3]);
        const result = deepIteratorResultValues(testee);
        const expected = [testee, 1, 2, 3];
        expect(result).to.deep.equal(expected);
      });
      it('should iterate over any iterable', function () {
        const testee = (function* () {yield 1; yield 2})();
        const result = deepIteratorResultValues(testee);
        const expected = [testee, 1, 2];
        expect(result).to.deep.equal(expected);
      });
      it('should iterate over nested iterables', function () {
        const testee1 = {c: 'z'};
        const testee2 = [1, 2, testee1];
        const testee3 = {a: 1, b: testee2};
        const result = deepIteratorResultValues(testee3);
        const expected = [testee3, 1, testee2, 1, 2, testee1, 'z'];
        expect(result).to.deep.equal(expected);
      });
      it('should treat circular references as leaves', function () {
        const testee = [1];
        testee.push(testee);
        const result = deepIteratorResultValues(testee);
        const expected = [testee, 1, testee];
        expect(result).to .deep.equal(expected);
      });
    });
    describe('node', function () {
      it('should have a key', function () {
        const testee = {a: 1, b: 2};
        const result = deepIteratorResult(testee).map(element => element.key);
        const expected = [undefined, 'a', 'b'];
        expect(result).to.deep.equal(expected);
      });
      it('should have a parent', function () {
        const testee = {a: {b: 2}};
        const result = deepIteratorResult(testee).map(element => element.parent);
        const expected = [undefined, testee, {b: 2}];
        expect(result).to.deep.equal(expected);
      });
      it('should have a path', function () {
        const testee = {a: {b: 2}};
        const result = deepIteratorResult(testee).map(element => element.path);
        const expected = [[], ['a'], ['a', 'b']];
        expect(result).to.deep.equal(expected);
      });
    });
  });
  describe('options: {onlyLeaves: false}', function() {
    it('should iterate leaves only', function () {
    });
    const testee = [[1, 2], {a: 3, b: 4}];
    const result = deepIteratorResultValues(testee, {onlyLeaves: true});
    const expected = [1 ,2, 3, 4];
    expect(result).to.deep.equal(expected);
  });
  describe('options: {iterateOverObject: false}', function() {
    it('should not iterate object', function () {
      const testee = [1, 2, {a: 3, b: 4}];
      const result = deepIteratorResultValues(testee, {iterateOverObject: false});
      const expected = [testee, 1, 2, {a: 3, b: 4}];
      expect(result).to.deep.equal(expected);
    });
  });
  describe("options: {circularReference: 'throw'}", function() {
    it('should throw if there is a circular reference', function () {
      const testee = [1, 2];
      testee.push(testee);
      expect(() => {deepIteratorResultValues(testee, {circularReference: 'throw'})}).to.throw();
    });
  });
  describe("options: {circularReference: 'noCheck'}", function() {
    it('should throw if there is a circular reference', function () {
      const testee = [1, 2];
      testee.push(testee);
      const func = () => {
        let i = 0;
        const it = deepIterator(testee, {circularReference: 'noCheck'});
        while (!it.next().done) {
          if (i++ === 10) throw new Error('infinite loop');
        }
      }
      expect(func).to.throw('infinite loop');
    });
  });
  describe('options: {skipIteration: <callback>}', function() {
    it('should skip iterations', function () {
      const testee = {a: 1, b: [1, 2]};
      const skipIteration = element => element.key === 'b';
      const result = deepIteratorResultValues(testee, {skipIteration});
      const expected = [testee, 1, [1, 2]];
      expect(result).to.deep.equal(expected);
    });
  });
  describe("options: {search: 'dfsPostOrder'}", function() {
    it('should use DFS post order algorithm', function () {
      const testee = [1, 2];
      const result = deepIteratorResultValues(testee, {search: 'dfsPostOrder'});
      const expected = [1, 2, testee];
      expect(result).to.deep.equal(expected);
    });
  });
  describe("options: {search: 'dfsPostOrder', onlyLeaves: true}", function() {
    it('should use DFS post order algorithm and iterate only leaves', function () {
      const testee = [1, 2];
      const result = deepIteratorResultValues(testee, {search: 'dfsPostOrder', onlyLeaves: true});
      const expected = [1, 2];
      expect(result).to.deep.equal(expected);
    });
  });
  describe("options: {search: 'dfsPostOrder', circularReference: 'throw'}", function() {
    it('should use DFS post order algorithm and iterate only leaves', function () {
      const testee = [1, 2];
      testee.push(testee);
      expect(() => {deepIteratorResultValues(testee, {search: 'dfsPostOrder', circularReference: 'throw'})}).to.throw();
    });
  });
  describe("options: {search: 'dfsPostOrder', circularReference: 'noCheck'}", function() {
    it('should use DFS post order algorithm and iterate only leaves', function () {
      const testee = [1, 2];
      testee.push(testee);
      const func = () => {
        let i = 0;
        const it = deepIterator(testee, {search: 'dfsPostOrder', circularReference: 'noCheck'});
        while (!it.next().done) {
          if (i++ === 10) throw new Error('infinite loop');
        }
      }
      expect(func).to.throw('infinite loop');
    });
  });
  describe("options: {search: 'bfs'}", function() {
    it('should use BFS algorithm', function () {
      const testee = [[1, 2], [3, 4]];
      const result = deepIteratorResultValues(testee, {search: 'bfs'});
      const expected = [testee, [1, 2], [3, 4], 1, 2, 3, 4];
      expect(result).to.deep.equal(expected);
    });
  });
  describe("options: {search: 'bfs', onlyLeaves: true}", function() {
    it('should use BFS algorithm and iterate only leaves', function () {
      const testee = [[1, 2], [3, 4]];
      const result = deepIteratorResultValues(testee, {search: 'bfs', onlyLeaves: true});
      const expected = [1, 2, 3, 4];
      expect(result).to.deep.equal(expected);
    });
  });
  describe("options: {search: 'bfs', circularReference: 'throw'}", function() {
    it('should use DFS post order algorithm and iterate only leaves', function () {
      const testee = [1, 2];
      testee.push(testee);
      expect(() => {deepIteratorResultValues(testee, {search: 'bfs', circularReference: 'throw'})}).to.throw();
    });
  });
  describe("options: {search: 'bfs', circularReference: 'noCheck'}", function() {
    it('should use DFS post order algorithm and iterate only leaves', function () {
      const testee = [1, 2];
      testee.push(testee);
      const func = () => {
        let i = 0;
        const it = deepIterator(testee, {search: 'bfs', circularReference: 'noCheck'});
        while (!it.next().done) {
          if (i++ === 10) throw new Error('infinite loop');
        }
      }
      expect(func).to.throw('infinite loop');
    });
  });
});
