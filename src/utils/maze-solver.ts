import { Position, Maze } from '@/types/maze';
import { Node, NodeIterator } from '@/types/node-iterator';
import { addPositions, DIRECTIONS } from '@/utils/position-calculator';
import { generate2dArray } from './array-generator';

export const solveMaze = (
  (maze: Maze, start: Position, goal: Position, createFrontier: () => NodeIterator<Position>)
  : [Position[], Position[]] => {
    const frontier = createFrontier();
    frontier.push(new Node(start, null));
    const visitedMaze: boolean[][] = generate2dArray(maze.length, maze[0].length, false);
    const history: Position[] = [];
    while (!frontier.isEmpty() && history.length < 10000) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const current = frontier.pop()!;
      history.push(current.state);
      if (current.state.x === goal.x && current.state.y === goal.y) {
        return [extractRoute(current), history];
      }
      const aroundPositions = DIRECTIONS
        .map((direction) => addPositions(current.state, direction))
        .filter((position) => maze[position.y][position.x] === 'floor')
        .filter((position) => !visitedMaze[position.y][position.x]);
      aroundPositions
        .forEach((position) => {
          if (visitedMaze[position.y][position.x]) {
            return;
          }
          visitedMaze[position.y][position.x] = true;
          frontier.push(new Node(position, current));
        });
    }
    return [[], history];
  }
);

const extractRoute = (node: Node<Position>): Position[] => {
  let current: Node<Position> | null = node;
  const route: Position[] = [];
  while (current != null) {
    route.push(current.state);
    current = current.parent;
  }
  return route.reverse();
};
