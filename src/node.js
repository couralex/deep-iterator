const KEY_INDEX = 0;
const VALUE_INDEX = 1;

export function getNode(value, key, parent, path) {
  return {value, key, parent, path};
}

export function getDeeperNode(child, parent) {
  return {
    value: child[VALUE_INDEX],
    key: child[KEY_INDEX],
    parent: parent.value,
    get path() { // evaluated only when needed
      return [...parent.path, child[KEY_INDEX]];
    }
  }
}
