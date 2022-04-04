/* eslint-disable max-classes-per-file */
export interface NodeIterator<T> {
    push(node: Node<T>): void;
    pop(): Node<T> | null;
    isEmpty(): boolean;
}

export class NodeStack<T> implements NodeIterator<T> {
  private nodes: Node<T>[] = [];

  push(node: Node<T>): void {
    this.nodes.push(node);
  }

  pop(): Node<T> | null {
    return castAsNull(this.nodes.pop());
  }

  isEmpty(): boolean {
    return this.nodes.length === 0;
  }
}

export class Node<T> {
  // eslint-disable-next-line no-useless-constructor
  constructor(
      public readonly state: T,
      public readonly parent: Node<T> | null,
  ) {}
}

const castAsNull = <T, > (value: T | undefined): T | null => (value === undefined ? null : value);
