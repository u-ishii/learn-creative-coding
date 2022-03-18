import P5 from 'p5';
import { Maze, Position } from '@/types/maze';

export const drawMaze = (p: P5, maze: Maze, tileSize: number): void => {
  for (let y = 0; y < maze.length; y += 1) {
    for (let x = 0; x < maze[y].length; x += 1) {
      if (maze[y][x] === 'wall') {
        drawTile(p, { x, y }, tileSize);
      }
    }
  }
};

export const drawTile = (p: P5, position: Position, tileSize: number): void => {
  p.rect(position.x * tileSize, position.y * tileSize, tileSize, tileSize);
};
