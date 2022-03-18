import { Position } from '@/types/maze';
import { shuffle } from '@/utils/random';

export const DIRECTIONS: ReadonlyArray<Position> = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

export const getShuffledDirections = (): ReadonlyArray<Position> => (
  shuffle([...DIRECTIONS])
);

export const addPositions = (...positions: Position[]): Position => (
  positions.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }))
);
