import { Board, Piece, Move } from '@/utils/board-ai';
import { max, min } from 'lodash-es';

const minimax = (
  board: Board, maximizing: boolean, originalPlayer: Piece, maxDepth = 8,
): Move => {
  if (board.isWin() || board.isDraw() || maxDepth === 0) {
    return board.evaluate(originalPlayer);
  }
  const comparator = maximizing ? max : min;
  const results = board.getLegalMoves()
    .map((move) => minimax(board.move(move), !maximizing, originalPlayer, maxDepth - 1));
  return comparator(results) as Move;
};

export const findBestMove = (board: Board, maxDepth = 8): Move => {
  let bestEval = Number.NEGATIVE_INFINITY;
  let bestMove: Move | null = null;
  board.getLegalMoves()
    .forEach((move) => {
      const result = minimax(board.move(move), false, board.getTurn(), maxDepth);
      if (result > bestEval) {
        bestEval = result;
        bestMove = move;
      }
    });
  if (bestMove === null) {
    throw new Error();
  }
  return bestMove;
};
