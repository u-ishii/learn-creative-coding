/* eslint-disable max-classes-per-file */
export interface Iterator<T> {
    push(value: T): void;
    pop(): T | null;
    isEmpty(): boolean;
}

export class Stack<T> implements Iterator<T> {
  private values: T[] = [];

  push(value: T): void {
    this.values.push(value);
  }

  pop(): T | null {
    return castAsNull(this.values.pop());
  }

  isEmpty(): boolean {
    return this.values.length === 0;
  }
}

export class Queue<T> implements Iterator<T> {
  private values: T[] = [];

  push(value: T): void {
    this.values.push(value);
  }

  pop(): T | null {
    return castAsNull(this.values.shift());
  }

  isEmpty(): boolean {
    return this.values.length === 0;
  }
}

const castAsNull = <T, > (value: T | undefined): T | null => (value === undefined ? null : value);
