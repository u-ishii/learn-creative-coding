export class Node<T> {
  // eslint-disable-next-line no-useless-constructor
  constructor(
      public readonly state: T,
      public readonly parent: Node<T> | null,
  ) {}
}
