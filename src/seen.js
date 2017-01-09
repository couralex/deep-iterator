class NoCheckSeen {
  add() {return this}
  has() {return false}
}

// TODO : use an immutable collection
class LeafSeen {
  constructor(arr) {
    this._arr = arr;
  }

  add(value) {
    return new LeafSeen([...this._arr, value]);
  }

  has(value) {
    return this._arr.includes(value);
  }
}

// TODO : use an immutable collection
class ThrowSeen {
  constructor(arr) {
    this._arr = arr;
  }

  add(value) {
    return new ThrowSeen([...this._arr, value]);
  }

  has(value) {
    if (this._arr.includes(value)) {
      throw new Error(`Circular reference : ${value}`);
    }
    return false;
  }
}

export default function makeSeen(circularReference) {
  switch (circularReference) {
    case 'leaf': return new LeafSeen([]);
    case 'throw': return new ThrowSeen([]);
    case 'noCheck': return new NoCheckSeen();
  }
  throw new Error(`Incorrect value ${circularReference} for circularReference option.`);
}
