export type Cell = 'floor' | 'wall';
export type Maze = Cell[][];

export interface Position {
  readonly x: number;
  readonly y: number;
}
