/* eslint-disable max-classes-per-file */
export interface Iterator<T> {
    push(value: T): void;
    pop(): T | null;
    isEmpty(): boolean;
}

interface Element<T> {
  value: T;
  next: Element<T> | null;
}

interface BiElement<T> {
  value: T;
  prev: BiElement<T> | null;
  next: BiElement<T> | null;
}

export class Stack<T> implements Iterator<T> {
  private head: Element<T> | null = null;

  push(value: T): void {
    const head = { value, next: this.head };
    this.head = head;
  }

  pop(): T | null {
    const popped = this.head;
    if (!popped) {
      return null;
    }
    this.head = popped.next;
    return popped.value;
  }

  isEmpty(): boolean {
    return this.head === null;
  }
}

export class Queue<T> implements Iterator<T> {
  private head: BiElement<T> | null = null;

  private last: BiElement<T> | null = null;

  push(value: T): void {
    if (this.isEmpty()) {
      const head = { value, prev: null, next: null };
      this.head = head;
      this.last = head;
      return;
    }
    const head = { value, prev: null, next: this.head };
    if (head.next) {
      head.next.prev = head;
    }
    this.head = head;
  }

  pop(): T | null {
    const { last } = this;
    if (!last) {
      return null;
    }
    if (!last.prev) {
      this.head = null;
      this.last = null;
      return last.value;
    }
    last.prev.next = null;
    this.last = last.prev;
    return last.value;
  }

  isEmpty(): boolean {
    return this.head === null;
  }
}
