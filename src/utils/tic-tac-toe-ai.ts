import {
  Piece, Board, isSimpleDraw, Move,
} from '@/utils/board-ai';

class TttPiece implements Piece {
  constructor(
    public readonly view: string,
    private readonly oppositeGetter: () => TttPiece,
  ) {
  }

  getOpposite(): TttPiece {
    return this.oppositeGetter();
  }
}

const PlayerPiece: TttPiece = new TttPiece('○', () => EnemyPiece);
const EnemyPiece: TttPiece = new TttPiece('×', () => PlayerPiece);
const NonePiece: TttPiece = new TttPiece('　', () => NonePiece);

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
    return TttIndexes.filter((i) => this.position[i] === NonePiece);
  }

  isWin(): boolean {
    return [
      EnemyPiece,
      PlayerPiece,
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
    return `
${this.position[0]}${this.position[1]}${this.position[2]}
${this.position[3]}${this.position[4]}${this.position[5]}
${this.position[6]}${this.position[7]}${this.position[8]}
    `.trim();
  }
}
