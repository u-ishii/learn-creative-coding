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
  private head: Element<T> | null = null;

  push(value: T): void {
    const head = { value, next: this.head };
    this.head = head;
  }

  pop(): T | null {
    const { head } = this;
    if (!head) {
      return null;
    }
    if (!head.next) {
      this.head = null;
      return head.value;
    }
    let beforeLast = head;
    let last = head.next;
    while (last.next) {
      beforeLast = last;
      last = last.next;
    }
    beforeLast.next = null;
    return last.value;
  }

  isEmpty(): boolean {
    return this.head === null;
  }
}
