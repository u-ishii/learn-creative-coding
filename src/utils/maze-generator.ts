import { Position, Maze, Cell } from '@/types/maze';
import { addPositions, getShuffledDirections } from '@/utils/position-calculator';
import { generate2dArray } from './array-generator';

const dig = (cursor: Position, maze: Maze, width: number, height: number)
    : [Position, Position] | undefined => (
  getShuffledDirections()
    .map<[Position, Position]>((direction) => ([
      addPositions(cursor, direction),
      addPositions(cursor, direction, direction),
    ]))
    .find(([, next]) => (
      next.x >= 0 && next.x < width && next.y >= 0 && next.y < height && maze[next.y][next.x] === 'wall'
    ))
);

export const generateMaze = (width: number, height: number): Maze => {
  const maze = generate2dArray<Cell>(height, width, 'wall');
  const routes: Position[] = [];
  const start: Position = {
    x: Math.floor(Math.random() * (width / 2)) * 2 + 1,
    y: Math.floor(Math.random() * (height / 2)) * 2 + 1,
  };
  maze[start.y][start.x] = 'floor';
  routes.push(start);
  while (routes.length > 0) {
    const next = routes.pop() as Position;
    const floors = dig(next, maze, width, height);
    if (floors) {
      maze[floors[0].y][floors[0].x] = 'floor';
      maze[floors[1].y][floors[1].x] = 'floor';
      routes.push(next);
      routes.push(floors[1]);
    }
  }
  return maze;
};
