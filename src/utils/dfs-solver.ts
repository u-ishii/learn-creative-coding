import { Position, Maze } from '@/types/maze';
import { addPositions, DIRECTIONS } from '@/utils/position-calculator';
import { generate2dArray } from './array-generator';

export const solveDfs = (
  (maze: Maze, startPosition: Position, goalPosition: Position): Position[][] => {
    const visitedMaze: boolean[][] = generate2dArray(maze.length, maze[0].length, false);
    const loop = (current: Position): Position[][] => {
      visitedMaze[current.y][current.x] = true;
      if (visitedMaze[goalPosition.y][goalPosition.x]) return [];
      const aroundPositions = DIRECTIONS
        .map((direction) => addPositions(current, direction))
        .filter((position) => maze[position.y][position.x] === 'floor')
        .filter((position) => !visitedMaze[position.y][position.x]);
      if (aroundPositions.length === 0) {
        return [[current]];
      }
      return aroundPositions
        .map((position) => [current, ...loop(position).flat()]);
    };
    return loop(startPosition);
  }
);
