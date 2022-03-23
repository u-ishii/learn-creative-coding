import { Position } from '@/types/maze';

export const findBfsRoute = (tree: Position[][]): Position[] => {
  const goal = tree[tree.length - 1][tree[tree.length - 1].length - 1];
  const areAdjacent = (a: Position, b: Position): boolean => (
    Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1
  );
  const loop = (current: Position, depth: number): Position[] | undefined => {
    if (current.x === goal.x && current.y === goal.y) return [current];
    if (depth >= tree.length) return undefined;
    const adjacentPositions = tree[depth]
      .filter((next) => areAdjacent(current, next));
    if (adjacentPositions.length === 0) return undefined;
    const foundRoute = adjacentPositions
      .map((next) => loop(next, depth + 1))
      .find((result) => result !== undefined);
    if (!foundRoute) return undefined;
    return [current, ...foundRoute];
  };
  const route = loop(tree[0][0], 1);
  if (!route) throw Error();
  return route;
};
