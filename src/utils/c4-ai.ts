import * as _ from 'lodash-es';
import {
  Piece, Board, isSimpleDraw, Move,
} from '@/utils/board-ai';

export class C4Piece implements Piece {
  constructor(
    public readonly view: string,
    private readonly oppositeGetter: () => C4Piece,
  ) {
  }

  getOpposite(): C4Piece {
    return this.oppositeGetter();
  }
}

export const C4BPlayer: C4Piece = new C4Piece('B', () => C4RPlayer);
export const C4RPlayer: C4Piece = new C4Piece('R', () => C4BPlayer);
export const C4Empty: C4Piece = new C4Piece(' ', () => C4Empty);

const generateVectorSegments = (
  (
    xEnd: number,
    yEnd: number,
    xAdd: number,
    yAdd: number,
    segmentSize: number,
  ): [number, number][][] => (
    _.range(xEnd).flatMap((x) => (
      _.range(yEnd).map((y) => (
        _.range(segmentSize).map<[number, number]>((i) => (
          [x + xAdd * i, y + yAdd * i]
        ))
      ))
    ))
  )
);

export const generateAllSegments = (
  (xSize: number, ySize: number, segmentSize: number): [number, number][][] => {
    const xEnd = xSize - segmentSize + 1;
    const yEnd = ySize - segmentSize + 1;
    const crossSegments = generateVectorSegments(xEnd, yEnd, 1, 1, segmentSize);
    const flippedCrossSegments = crossSegments
      .map((segment) => segment
        .map<[number, number]>(([x, y], i) => [x + ((segmentSize - 1) - i * 2), y]));
    return [
      ...generateVectorSegments(xSize, yEnd, 0, 1, segmentSize),
      ...generateVectorSegments(xEnd, ySize, 1, 0, segmentSize),
      ...crossSegments,
      ...flippedCrossSegments,
    ];
  }
);

export class C4Column {
  constructor(
    private readonly length: number,
    private readonly values: ReadonlyArray<C4Piece>,
  ) {
  }

  get full(): boolean {
    return this.restSize <= 0;
  }

  get restSize() {
    return this.length - this.values.length;
  }

  push(value: C4Piece): C4Column {
    if (this.full) {
      throw new Error('COLUMN_FULL');
    }
    return new C4Column(this.length, [value, ...this.values]);
  }

  get(i: number): C4Piece {
    if (i < this.restSize) {
      return C4Empty;
    }
    return this.values[i - this.restSize];
  }
}

export class C4Board implements Board {
  constructor(
    public readonly columns: ReadonlyArray<C4Column>,
    public readonly xSize: number = 7,
    public readonly ySize: number = 6,
    public readonly segmentSize: number = 4,
    public readonly turn: C4Piece = C4BPlayer,
  ) {
  }

  public static empty(
    xSize = 7,
    ySize = 6,
    segmentSize = 4,
    turn: C4Piece = C4BPlayer,
  ): C4Board {
    return new C4Board(
      _.times(xSize, () => new C4Column(ySize, [])),
      xSize,
      ySize,
      segmentSize,
      turn,
    );
  }

  getTurn(): Piece {
    return this.turn;
  }

  move(location: number): C4Board {
    const newColumns = [...this.columns];
    newColumns[location] = newColumns[location].push(this.turn);
    return new C4Board(
      newColumns,
      this.xSize,
      this.ySize,
      this.segmentSize,
      this.turn.getOpposite(),
    );
  }

  getLegalMoves(): Move[] {
    return _.range(this.xSize).filter((i) => !this.columns[i].full);
  }

  isWin(): boolean {
    return [
      C4BPlayer,
      C4RPlayer,
    ].some((piece) => (
      generateAllSegments(this.xSize, this.ySize, this.segmentSize).some((segment) => (
        segment.every(([x, y]) => this.columns[x].get(y) === piece)
      ))
    ));
  }

  isDraw(): boolean {
    return isSimpleDraw(this);
  }

  evaluate(player: Piece): number {
    const countPieces = (segment: [number, number][], piece: Piece): number => (
      segment.filter(([x, y]) => this.columns[x].get(y) === piece).length
    );
    return _.sum(
      generateAllSegments(this.xSize, this.ySize, this.segmentSize)
        .map((segment) => {
          const playerCount = countPieces(segment, player);
          const enemyCount = countPieces(segment, player.getOpposite());
          if (playerCount > 0 && enemyCount > 0) {
            return 0;
          }
          const maxCount = Math.max(playerCount, enemyCount);
          const sign = playerCount > enemyCount ? 1 : -1;
          if (maxCount === 2) {
            return 1 * sign;
          }
          if (maxCount === 3) {
            return 100 * sign;
          }
          if (maxCount === 4) {
            return 1000000 * sign;
          }
          return 0;
        }),
    );
  }

  buildText(): string {
    return _.times(
      this.ySize,
      (y) => _.times(
        this.xSize,
        (x) => this.columns[x].get(y).view,
      ).join(),
    ).join('\n');
  }
}
