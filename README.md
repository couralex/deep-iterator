# deep-iterator
[![Build Status](https://travis-ci.org/couralex/deep-iterator.svg?branch=master)](https://travis-ci.org/couralex/deep-iterator)
[![Coverage Status](https://coveralls.io/repos/github/couralex/deep-iterator/badge.svg?branch=master)](https://coveralls.io/github/couralex/deep-iterator?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

deep-iterator iterates recursively through objects, arrays, sets, maps, generic iterables, or any mix of them.

## Features
- several search algorithms: bfs, dfs pre/post order
- circular references detection
- can iterate either all the nodes or just the leaves
- can skip iteration of specified objects

## Installation

```
npm install deep-iterator
```

## Usage

```js
import deepIterator from 'deep-iterator';
// commonJS : var deep-iterator = require(deep-iterator).default;

const obj = {a: 1, b: [2, 3]};
for (let {value} of deepIterator(obj)) {
  console.log(value);
}
/* outputs:
{a: 1, b: [2, 3]}  (the root) - use the onlyLeaves option to remove
1
[2, 3] - use the onlyLeaves option to remove
2
3
*/

const deepArray = [[1, 2], [3, 4]];
const it = deepIterator(deepArray, {onlyLeaves: true});
for (let {parent, key} of it) {
  parent[key]++;
}
// deepArray ===  [[2, 3], [4, 5]]
```

## The node object

For each iteration, deep-iterator yields a node object containing the following properties :
- value: the value of the node
- parent: the parent of the node
- key: the key of the node in its parent
- path: an array containing all the keys from the root down to the node

Note that :
- parent[key] lets you update the current node
- key is undefined if the node is the root or the iterated collection is a generic iterable
- path is lazy evaluated : not using it will improve performance, i. e. :
 for (let {value, parent, key} of it) => path is not evaluated
 for (let {value, parent, key, path} of it) => path is evaluated

## Options

Default options are :

```js
const iterator = deepIterator(obj, {
  search: 'dfsPreOrder', // DFS algorithm / parent before child
  onlyLeaves: false, // all nodes are iterated
  circularReference: 'leaf', // circular references are treated as leaves (not recursively iterated)
  iterateOverObject: true, // non-iterable objects are iterated through their properties
  skipIteration : node => false // no node are skipped
});
```

### `search`
*accepted values*: 'dfsPreOrder'(default), 'dfsPostOrder', 'bfs'

Specifies the iteration algorithm:
- dfsPreOrder: Depth First Search, parent before child
- dfsPostOrder: Depth First Search, child before parent
- bfs: Breadth First Search

### `onlyLeaves`
*accepted values*: false (default) or true

Iterates  all the nodes or only leaves

### `circularReference`
*accepted values*: 'leaf', 'throw', 'noCheck'

Handles the circular references detection :
- leaf: circular references are treated as leaves (no further iteration)
- throw: circular references throw an error
- noCheck: circular detection is off (this improves performances)

### `iterateOverObject`
*accepted values*: true(default) or false

Enables iteration over non-iterable objects or not.

### `skipIteration`
*accepted values*: callback: node => true or false

Specifies when to iterate or not.
if the callback returns true : the node is not iterated itself and is considered as a leaf
if the callback returns false : the node is deeply iterated
Example : Skip iteration of all arrays :
```js
const it = deepIterator(obj, {skipIteration: node => Array.isArray(node.value)});
```
