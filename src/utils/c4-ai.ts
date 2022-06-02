import * as _ from 'lodash-es';
import {
  Piece, Board, isSimpleDraw, Move,
} from '@/utils/board-ai';

const C4_X_SIZE = 7;
const C4_Y_SIZE = 6;
const C4_SEGMENT_SIZE = 4;

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

const generateAllSegments = (
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
    private readonly values: C4Piece[],
  ) {
  }

  isFull(): boolean {
    return this.values.length >= this.length;
  }

  get restSize() {
    return this.length - this.values.length;
  }

  push(value: C4Piece): C4Column {
    if (this.isFull()) {
      throw new Error('COLUMN_FULL');
    }
    return new C4Column(this.length, [...this.values, value]);
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
    public readonly columns: C4Column[],
    private readonly turn: C4Piece,
  ) {
  }

  getTurn(): Piece {
    return this.turn;
  }

  move(location: number): C4Board {
    const newColumns = [...this.columns];
    newColumns[location] = newColumns[location].push(this.turn);
    return new C4Board(newColumns, this.turn.getOpposite());
  }

  getLegalMoves(): Move[] {
    return _.range(C4_X_SIZE).filter((i) => !this.columns[i].isFull());
  }

  isWin(): boolean {
    return [
      C4BPlayer,
      C4RPlayer,
    ].some((piece) => (
      generateAllSegments(C4_X_SIZE, C4_Y_SIZE, C4_SEGMENT_SIZE).some((segment) => (
        segment.every(([x, y]) => this.columns[x].get(y) === piece)
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
    return _.times(
      C4_Y_SIZE,
      (y) => _.times(
        C4_X_SIZE,
        (x) => this.columns[x].get(y).view,
      ).join(),
    ).join('\n');
  }
}
