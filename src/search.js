import Node from './node';

export function* dfsPreOrder(node, onlyLeaves, parentSeen) {
  if (node.isLeaf()) {
    yield node;
    return;
  }
  if (!onlyLeaves) {
    yield node;
  }
  const seen = parentSeen.add(node.value);
  for (let [key, value] of node.createIterator()) {
    yield* dfsPreOrder(
      new Node(key, value, node, seen.has(value)),
      onlyLeaves,
      seen
    );
  }
}

export function* dfsPostOrder(node, onlyLeaves, parentSeen) {
  if (node.isLeaf()) {
    yield node;
    return;
  }
  const seen = parentSeen.add(node.value);
  for (let [key, value] of node.createIterator()) {
    yield* dfsPostOrder(
      new Node(key, value, node, seen.has(value)),
      onlyLeaves,
      seen
    );
  }
  if (!onlyLeaves) {
    yield node;
  }
}

// transpiled generator has uncovered branches
// istanbul issue #645
/* istanbul ignore next */
export function* bfs(rootNode, onlyLeaves, parentSeen) {
  const queue = [{node: rootNode, seen: parentSeen}];
  for (let i = 0; i < queue.length; i++) {
    const node = queue[i].node;
    if (node.isLeaf()) {
      yield node;
    } else {
      if (!onlyLeaves) {
        yield node;
      }
      const seen = queue[i].seen.add(node.value);
      for (let [key, value] of node.createIterator()) {
        queue.push({
          node: new Node(key, value, node, seen.has(value)),
          seen
        });
      }
    }
  }
}
