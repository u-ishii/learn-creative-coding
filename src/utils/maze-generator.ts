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

export const generateDiggedMaze = (width: number, height: number): Maze => {
  const maze = generate2dArray<Cell>(height, width, 'wall');
  const routes: Position[] = [];
  const start: Position = {
    x: Math.floor(Math.random() * (width / 2)) * 2 + 1,
    y: Math.floor(Math.random() * (height / 2)) * 2 + 1,
  };
  maze[start.y][start.x] = 'floor';
  routes.push(start);
  while (routes.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const next = routes.pop()!;
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

export const generatePutMaze = (
  (width: number, height: number, reserved: Position[], probability: number): Maze => {
    const maze = generate2dArray<Cell>(height, width, 'floor');
    for (let y = 0; y < height; y += 1) {
      maze[y][0] = 'wall';
      maze[y][width - 1] = 'wall';
    }
    for (let x = 0; x < width; x += 1) {
      maze[0][x] = 'wall';
      maze[height - 1][x] = 'wall';
    }
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        if (Math.random() <= probability) {
          maze[y][x] = 'wall';
        }
      }
    }
    reserved.forEach((p) => { maze[p.y][p.x] = 'floor'; });
    return maze;
  }
);
