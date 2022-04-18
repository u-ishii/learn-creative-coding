import { Stack, Queue } from '../../src/types/iterator';

describe('Stack', () => {
  it('Push / Pop', () => {
    const stack = new Stack();
    expect(stack.isEmpty()).toBe(true);
    stack.push('A');
    stack.push('B');
    stack.push('C');
    expect(stack.isEmpty()).toBe(false);
    expect(stack.pop()).toBe('C');
    expect(stack.pop()).toBe('B');
    expect(stack.pop()).toBe('A');
    expect(stack.isEmpty()).toBe(true);
  });
});

describe('Queue', () => {
  it('Push / Pop', () => {
    const queue = new Queue();
    expect(queue.isEmpty()).toBe(true);
    queue.push('A');
    queue.push('B');
    queue.push('C');
    expect(queue.isEmpty()).toBe(false);
    expect(queue.pop()).toBe('A');
    expect(queue.pop()).toBe('B');
    expect(queue.pop()).toBe('C');
    expect(queue.isEmpty()).toBe(true);
  });
});
