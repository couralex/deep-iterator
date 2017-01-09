import {getDeeperNode} from './node';
import isLeaf from './is-leaf';

export function* dfsPreOrder(node, selectIterator, onlyLeaves, seen) {
  const iterator = selectIterator(node);
  // if it's a leaf (i. e. a non-iterable node) or a circular reference
  if (isLeaf(node, iterator, seen)) {
    yield node;
    return;
  }
  if (!onlyLeaves) {
    yield node;
  }
  for (let child of iterator(node.value)) {
    yield* dfsPreOrder(
      getDeeperNode(child, node),
      selectIterator,
      onlyLeaves,
      seen.add(node.value)
    );
  }
}

export function* dfsPostOrder(node, selectIterator, onlyLeaves, seen) {
  const iterator = selectIterator(node);
  // if it's a leaf (i. e. a non-iterable node) or a circular reference
  if (isLeaf(node, iterator, seen)) {
    yield node;
    return;
  }
  for (let child of iterator(node.value)) {
    yield* dfsPostOrder(
      getDeeperNode(child, node),
      selectIterator,
      onlyLeaves,
      seen.add(node.value)
    );
  }
  if (!onlyLeaves) {
    yield node;
  }
}

// transpiled generator has uncovered branches
/* istanbul ignore next */
export function* bfs(rootNode, selectIterator, onlyLeaves, seen) {
  const queue = [{node: rootNode, seen}];
  for (let i = 0; i < queue.length; i++) {
    const node = queue[i].node;
    const iterator = selectIterator(node);
    if (isLeaf(node, iterator, queue[i].seen)) {
      yield node;
    } else {
      if (!onlyLeaves) {
        yield node;
      }
      for (let child of iterator(node.value)) {
        queue.push({
          node: getDeeperNode(child, node),
          seen: seen.add(node.value)
        });
      }
    }
  }
}
