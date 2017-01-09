export default function isLeaf(node, iterator, seen) {
  return iterator === null || seen.has(node.value);
}
