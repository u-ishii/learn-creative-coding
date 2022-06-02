import { Board, Piece, Move } from '@/utils/board-ai';
import { maxBy, minBy } from 'lodash-es';

interface MinimaxResult {
  eval: number;
  board: string;
  isWin: boolean;
  isDraw: boolean;
  depth: number;
}

// eslint-disable-next-line max-len
const minimax = (board: Board, maximizing: boolean, originalPlayer: Piece, maxDepth = 8): MinimaxResult => {
  if (board.isWin() || board.isDraw() || maxDepth === 0) {
    return {
      eval: board.evaluate(originalPlayer),
      board: board.buildText(),
      isWin: board.isWin(),
      isDraw: board.isDraw(),
      depth: maxDepth,
    };
  }
  const comparator = maximizing ? maxBy : minBy;
  const results = board.getLegalMoves()
    .map((move) => minimax(board.move(move), !maximizing, originalPlayer, maxDepth - 1));
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return comparator(results, (result) => result.eval)!;
};

export const findBestMove = (board: Board, maxDepth = 8): MinimaxResult & {move: Move} => {
  const results = board.getLegalMoves()
    .map((move) => (
      { move, ...minimax(board.move(move), false, board.getTurn(), maxDepth) }
    ));
  const bestResult = maxBy(results, (result) => result.eval);
  if (bestResult === undefined) {
    throw new Error();
  }
  return bestResult;
};
