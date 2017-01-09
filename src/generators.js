export function* objectIterator(obj) {
  for (let key in obj) {
    yield [key, obj[key]];
  }
}

export function* arrayIterator(arr) {
  for (let i = 0; i < arr.length; i++) {
    yield [i, arr[i]];
  }
}

// transpiled generator has uncovered branches
/* istanbul ignore next */
export function* genericIterator(iterator) {
  for (let value of iterator) {
    yield [undefined, value];
  }
}

// transpiled generator has uncovered branches
/* istanbul ignore next */
export function* mapIterator(iterator) {
  for (let element of iterator) {
    yield element;
  }
}
