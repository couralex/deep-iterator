import Node from './node';
import SelectGenerator from './select-generator';

export default class RootNode extends Node {
  constructor(value, config) {
    const parentNode = {
      _selectGenerator: new SelectGenerator(config)
    }
    // probable transpilation issue - istanbul issue #690
    /*istanbul ignore next*/
    super(undefined, value, parentNode, false);
  }

  get parentNode() {
    return undefined;
  }

  get path() {
    return [];
  }
}
