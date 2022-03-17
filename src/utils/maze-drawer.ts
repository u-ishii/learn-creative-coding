import P5 from 'p5';
import { Maze } from '@/types/maze';

export const drawMaze = (p: P5, maze: Maze, tileSize: number): void => {
  for (let y = 0; y < maze.length; y += 1) {
    for (let x = 0; x < maze[y].length; x += 1) {
      if (maze[y][x] === 'wall') {
        p.rect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
};
