declare module '@msamblanet/deep-iterator' {
  export interface DeepIteratorConfig {
    onlyLeaves?: boolean;
    circularReference?: string;
    search?: string;
    iterateOverObject?: boolean;
    skipIteration?: () => boolean;
  }

  export enum NodeType {
    Null = 'Null',
    Undefined = 'Undefined',
    Boolean = 'Boolean',
    String = 'String',
    Symbol = 'Symbol',
    Date = 'Date',
    RegExp = 'RegExp',
    Function = 'Function',
    GeneratorFunction = 'GeneratorFunction',
    Promise = 'Promise',
    Array = 'Array',
    Set = 'Set',
    Map = 'Map',
    UserDefinedIterable = 'UserDefinedIterable',
    NonIterableObject = 'NonIterableObject'
  }

  export type KeyType = string | number | symbol;

  export interface Node {
    type: NodeType;
    key: KeyType;
    path: KeyType[];
    value: unknown;
    parent: Record<KeyType, unknown>;
    parentNode: Node;
    isCircular: () => boolean;
    isLeaf: () => boolean;
  }

  function DeepIterator(object: unknown, config?: DeepIteratorConfig): Iterable<Node>;

  export default DeepIterator;
}
