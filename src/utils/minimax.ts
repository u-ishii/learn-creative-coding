import { Board, Piece } from '@/utils/board-ai';
import { max, min } from 'lodash-es';

const minimax = (
  board: Board, maximizing: boolean, originalPlayer: Piece, maxDepth = 8,
): number => {
  if (board.isWin() || board.isDraw() || maxDepth === 0) {
    return board.evaluate(originalPlayer);
  }
  const comparator = maximizing ? max : min;
  const results = board.getLegalMoves()
    .map((move) => minimax(board.move(move), !maximizing, originalPlayer, maxDepth - 1));
  return comparator(results) as number;
};
