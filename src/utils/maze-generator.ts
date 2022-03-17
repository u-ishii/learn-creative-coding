import { Position, Maze } from '@/types/maze';
import { shuffle } from '@/utils/random';

const getDirections = (): ReadonlyArray<Position> => (
  shuffle([
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ])
);

const dig = (x: number, y: number, maze: Maze, width: number, height: number)
    : [Position, Position] | undefined => (
  getDirections()
    .map<[Position, Position]>((direction) => ([
      {
        x: x + direction.x,
        y: y + direction.y,
      },
      {
        x: x + direction.x * 2,
        y: y + direction.y * 2,
      },
    ]))
    .find(([, next]) => (
      next.x >= 0 && next.x < width && next.y >= 0 && next.y < height && maze[next.y][next.x] === 'wall'
    ))
);

const generateWallMaze = (width: number, height: number): Maze => (
  Array.from(
    { length: height },
    () => Array.from(
      { length: width },
      () => 'wall',
    ),
  )
);

export const generateMaze = (width: number, height: number): Maze => {
  const maze = generateWallMaze(width, height);
  const routes: Position[] = [];
  const start: Position = {
    x: Math.floor(Math.random() * (width / 2)) * 2 + 1,
    y: Math.floor(Math.random() * (height / 2)) * 2 + 1,
  };
  maze[start.y][start.x] = 'floor';
  routes.push(start);
  while (routes.length > 0) {
    const next = routes.pop() as Position;
    const floors = dig(next.x, next.y, maze, width, height);
    if (floors) {
      maze[floors[0].y][floors[0].x] = 'floor';
      maze[floors[1].y][floors[1].x] = 'floor';
      routes.push(next);
      routes.push(floors[1]);
    }
  }
  return maze;
};
