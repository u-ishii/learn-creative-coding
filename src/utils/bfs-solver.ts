import { Position, Maze } from '@/types/maze';
import { addPositions, DIRECTIONS } from '@/utils/position-calculator';
import { generate2dArray } from './array-generator';

export const solveBfs = (
  (maze: Maze, startPosition: Position, goalPosition: Position): Position[][] => {
    const pastPositions: Position[][] = [[startPosition]];
    const visitedMaze: boolean[][] = generate2dArray(maze.length, maze[0].length, false);
    while (!visitedMaze[goalPosition.y][goalPosition.x]) {
      const aroundPositions = Array.from(new Set(
        pastPositions[pastPositions.length - 1].flatMap(
          (cursor) => DIRECTIONS.map(
            (direction) => addPositions(cursor, direction),
          ),
        ),
      ))
        .filter((position) => maze[position.y][position.x] === 'floor')
        .filter((position) => !visitedMaze[position.y][position.x]);
      aroundPositions.forEach((position) => { visitedMaze[position.y][position.x] = true; });
      pastPositions.push(aroundPositions);
    }
    return pastPositions;
  }
);
