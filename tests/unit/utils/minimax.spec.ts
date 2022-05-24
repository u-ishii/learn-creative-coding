import { findBestMove } from '../../../src/utils/minimax';
import {
  TttBoard, TttPlayer as P, TttEnemy as E, TttNone as N,
} from '../../../src/utils/tic-tac-toe-ai';

describe('findBestMove', () => {
  it('1手で勝つ', () => {
    const board = new TttBoard(
      [
        P, E, P,
        P, N, E,
        N, N, E,
      ],
      P,
    );
    const bestMove = findBestMove(board);
    expect(bestMove).toBe(6);
  });
});
