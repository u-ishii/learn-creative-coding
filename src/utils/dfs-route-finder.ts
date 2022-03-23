import { Position } from '@/types/maze';

export const findDfsRoute = (tree: Position[][]): Position[] => tree[tree.length - 1];
