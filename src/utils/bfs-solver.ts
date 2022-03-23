import { Position, Maze } from '@/types/maze';
import { addPositions, DIRECTIONS } from '@/utils/position-calculator';
import { generate2dArray } from './array-generator';

export const solveBfs = (
  (maze: Maze, start: Position, goal: Position): Position[][] => {
    const pastPositions: Position[][] = [[start]];
    const visitedMaze: boolean[][] = generate2dArray(maze.length, maze[0].length, false);
    while (!visitedMaze[goal.y][goal.x]) {
      const aroundPositions = Array.from(new Set(
        pastPositions[pastPositions.length - 1].flatMap(
          (cursor) => DIRECTIONS.map(
            (direction) => addPositions(cursor, direction),
          ),
        ),
      ))
        .filter((position) => maze[position.y][position.x] === 'floor');
      pastPositions.push([]);
      // eslint-disable-next-line no-restricted-syntax
      for (const position of aroundPositions) {
        if (visitedMaze[position.y][position.x]) {
          // eslint-disable-next-line no-continue
          continue;
        }
        pastPositions[pastPositions.length - 1].push(position);
        visitedMaze[position.y][position.x] = true;
        if (visitedMaze[goal.y][goal.x]) {
          break;
        }
      }
    }
    return pastPositions;
  }
);
