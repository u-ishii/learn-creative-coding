import { Position, Maze } from '@/types/maze';
import { addPositions, DIRECTIONS } from '@/utils/position-calculator';
import { generate2dArray } from './array-generator';

export const solveDfs = (
  (maze: Maze, start: Position, goal: Position): Position[][] => {
    const visitedMaze: boolean[][] = generate2dArray(maze.length, maze[0].length, false);
    const loop = (current: Position): Position[][] => {
      visitedMaze[current.y][current.x] = true;
      if (current.x === goal.x && current.y === goal.y) return [[current]];
      if (visitedMaze[goal.y][goal.x]) return [];
      const aroundPositions = DIRECTIONS
        .map((direction) => addPositions(current, direction))
        .filter((position) => maze[position.y][position.x] === 'floor')
        .filter((position) => !visitedMaze[position.y][position.x]);
      if (aroundPositions.length === 0) {
        return [[current]];
      }
      // return aroundPositions
      //   .map((position) => [current, ...loop(position).flat()]);
      const tree: Position[][] = [];
      aroundPositions.forEach((p) => {
        tree.push(...loop(p).map((branch) => [current, ...branch]));
      });
      return tree;
    };
    return loop(start);
  }
);
