/* eslint-disable max-classes-per-file */
export interface Iterator<T> {
    push(value: T): void;
    pop(): T | null;
    isEmpty(): boolean;
}

interface Element<T> {
  value: T;
  before: Element<T> | null;
}

export class Stack<T> implements Iterator<T> {
  private last: Element<T> | null = null;

  push(value: T): void {
    const last = { value, before: this.last };
    this.last = last;
  }

  pop(): T | null {
    const popped = this.last;
    this.last = this.last?.before ?? null;
    return popped?.value ?? null;
  }

  isEmpty(): boolean {
    return this.last === null;
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

const castAsNull = <T, > (value: T | undefined): T | null => value ?? null;
