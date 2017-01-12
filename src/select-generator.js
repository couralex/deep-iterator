import {getTagMap} from './tag';
import {LEAF} from './generators';

export default class SelectGenerator {
  constructor(config) {
    this.skipIteration = config.skipIteration;
    this.tagMap = getTagMap(config);
  }

  getGenerator(tag) {
    return this.tagMap[tag];
  }
}
