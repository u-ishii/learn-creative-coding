import {
  Piece, Board, isSimpleDraw, Move,
} from '@/utils/board-ai';

export class TttPiece implements Piece {
  constructor(
    public readonly view: string,
    private readonly oppositeGetter: () => TttPiece,
  ) {
  }

  getOpposite(): TttPiece {
    return this.oppositeGetter();
  }
}

export const TttXPlayer: TttPiece = new TttPiece('×', () => TttOPlayer);
export const TttOPlayer: TttPiece = new TttPiece('○', () => TttXPlayer);
export const TttEmpty: TttPiece = new TttPiece('　', () => TttEmpty);

const TttIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export class TttBoard implements Board {
  constructor(
    public readonly position: TttPiece[],
    private readonly turn: TttPiece,
  ) {
  }

  getTurn(): Piece {
    return this.turn;
  }

  move(location: number): TttBoard {
    const tempPosition = [...this.position];
    tempPosition[location] = this.turn;
    return new TttBoard(tempPosition, this.turn.getOpposite());
  }

  getLegalMoves(): Move[] {
    return TttIndexes.filter((i) => this.position[i] === TttEmpty);
  }

  isWin(): boolean {
    return [
      TttOPlayer,
      TttXPlayer,
    ].some((piece) => (
      [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ].some((indexes) => (
        indexes.every((i) => this.position[i] === piece)
      ))
    ));
  }

  isDraw(): boolean {
    return isSimpleDraw(this);
  }

  evaluate(player: Piece): number {
    if (this.isWin()) {
      return this.turn === player ? -1 : 1;
    }
    return 0;
  }

  buildText(): string {
    return this.position.map((piece) => piece.view).toString();
  }
}
