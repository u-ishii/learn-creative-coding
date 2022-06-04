import {
  C4Column, generateAllSegments, C4BPlayer as B, C4RPlayer as R, C4Empty as E, C4Board,
} from '../../../src/utils/c4-ai';

it('generateAllSegments', () => {
  const segments = generateAllSegments(3, 2, 2);
  expect(segments[0]).toEqual([[0, 0], [0, 1]]);
  expect(segments[1]).toEqual([[1, 0], [1, 1]]);
  expect(segments[2]).toEqual([[2, 0], [2, 1]]);
  expect(segments[3]).toEqual([[0, 0], [1, 0]]);
  expect(segments[4]).toEqual([[0, 1], [1, 1]]);
  expect(segments[5]).toEqual([[1, 0], [2, 0]]);
  expect(segments[6]).toEqual([[1, 1], [2, 1]]);
  expect(segments[7]).toEqual([[0, 0], [1, 1]]);
  expect(segments[8]).toEqual([[1, 0], [2, 1]]);
  expect(segments[9]).toEqual([[1, 0], [0, 1]]);
  expect(segments[10]).toEqual([[2, 0], [1, 1]]);
});

it('C4Column', () => {
  let column = new C4Column(3, []).push(B).push(R);
  expect(column.get(0)).toBe(E);
  expect(column.get(1)).toBe(R);
  expect(column.get(2)).toBe(B);
  expect(column.full).toBe(false);
  column = column.push(B);
  expect(column.full).toBe(true);
});

it('C4Board', () => {
  let board = C4Board.empty(2, 3, 3);
  board = board.move(0).move(1).move(0).move(1);
  expect(board.getLegalMoves()).toEqual([0, 1]);
  expect(board.isWin()).toBe(false);
  board = board.move(0);
  expect(board.getLegalMoves()).toEqual([1]);
  expect(board.isWin()).toBe(true);
});
