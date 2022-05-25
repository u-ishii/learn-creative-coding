export interface Piece {
  getOpposite(): Piece;
}

export type Move = number;

export interface Board {
    getTurn(): Piece;
    move(location: Move): Board;
    getLegalMoves(): Move[];
    isWin(): boolean;
    isDraw(): boolean;
    evaluate(player: Piece): number;
    buildText(): string;
}

export const isSimpleDraw = (board: Board): boolean => (
  !board.isWin() && board.getLegalMoves().length === 0
);
