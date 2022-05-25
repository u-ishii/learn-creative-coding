import { findBestMove } from '../../../src/utils/minimax';
import {
  TttBoard, TttXPlayer as X, TttOPlayer as O, TttEmpty as E,
} from '../../../src/utils/tic-tac-toe-ai';

describe('findBestMove', () => {
  it('1手で勝つ', () => {
    const board = new TttBoard(
      [
        X, O, X,
        X, E, O,
        E, E, O,
      ],
      X,
    );
    const bestResult = findBestMove(board);
    expect(bestResult.move).toBe(6);
    expect(bestResult.isWin).toBe(true);
  });
  it('相手をブロックする', () => {
    const board = new TttBoard(
      [
        X, E, E,
        E, E, O,
        E, X, O,
      ],
      X,
    );
    const bestResult = findBestMove(board);
    expect(bestResult.move).toBe(2);
    expect(bestResult.isWin).toBe(true);
  });
});
