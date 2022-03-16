<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';

type Cell = 'floor' | 'wall';

interface Position {
  readonly x: number;
  readonly y: number;
}

type Maze = Cell[][];

const MAZE_WIDTH = 59;
const MAZE_HEIGHT = 41;
const TILE_SIZE = 10;

const shuffle = <T, > ([...array]: T[]): T[] => {
  for (let i = array.length - 1; i >= 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getDirections = (): ReadonlyArray<Position> => (
  shuffle([
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ])
);

const dig = (x: number, y: number, maze: Maze): [Position, Position] | [] => (
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
      next.x >= 0 && next.x < MAZE_WIDTH && next.y >= 0 && next.y < MAZE_HEIGHT && maze[next.y][next.x] === 'wall'
    )) || []
);

const generateWallMaze = (): Maze => (
  Array.from(
    { length: MAZE_HEIGHT },
    () => Array.from(
      { length: MAZE_WIDTH },
      () => 'wall',
    ),
  )
);

const generateMaze = (): Maze => {
  const maze = generateWallMaze();
  const routes: Position[] = [];
  const sx = Math.floor(Math.random() * (MAZE_WIDTH / 2)) * 2 + 1;
  const sy = Math.floor(Math.random() * (MAZE_HEIGHT / 2)) * 2 + 1;
  maze[sy][sx] = 'floor';
  routes.push({ x: sx, y: sy });
  while (routes.length > 0) {
    const next = routes.pop() as Position;
    const [d1, d2] = dig(next.x, next.y, maze);
    if (d1 && d2) {
      maze[d1.y][d1.x] = 'floor';
      maze[d2.y][d2.x] = 'floor';
      routes.push(next);
      routes.push(d2);
    }
  }
  return maze;
};

const initializeP5 = (p: P5) => {
  /* eslint-disable no-param-reassign */
  p.setup = () => {
    const maze = generateMaze();
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.clear(0, 0, 0, 0);
    p.fill('#666');
    p.strokeWeight(1);
    for (let y = 0; y < MAZE_HEIGHT; y += 1) {
      for (let x = 0; x < MAZE_WIDTH; x += 1) {
        if (maze[y][x] === 'wall') {
          p.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  };
  // p.draw = () => {
  // };
  /* eslint-enable no-param-reassign */
};

export default defineComponent({
  name: 'App',
  mounted() {
    // eslint-disable-next-line no-new
    new P5(initializeP5, this.$refs.canvas as HTMLElement);
  },
});
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}
</style>

<style lang="scss" scoped>
.canvas {
  overflow: hidden;
  background: #292a33;
}
</style>
