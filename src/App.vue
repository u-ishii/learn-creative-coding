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

const dig = (x: number, y: number, maze: Maze, routes: Position[]) => {
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const dir of getDirections()) {
    const tx = x + dir.x;
    const ty = y + dir.y;
    const tx2 = x + dir.x * 2;
    const ty2 = y + dir.y * 2;
    if (tx2 >= 0 && tx2 < MAZE_WIDTH && ty2 >= 0 && ty2 < MAZE_HEIGHT && maze[ty2][tx2] === 'wall') {
      // eslint-disable-next-line no-param-reassign
      maze[ty][tx] = 'floor';
      // eslint-disable-next-line no-param-reassign
      maze[ty2][tx2] = 'floor';
      routes.push({ x, y });
      routes.push({ x: tx2, y: ty2 });
      return { x: tx2, y: ty2 };
    }
  }
  return null;
};

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
  const routes = [];
  const sx = Math.floor(Math.random() * (MAZE_WIDTH / 2)) * 2 + 1;
  const sy = Math.floor(Math.random() * (MAZE_HEIGHT / 2)) * 2 + 1;
  maze[sy][sx] = 'floor';
  routes.push({ x: sx, y: sy });
  while (routes.length > 0) {
    const next = routes.pop() as Position;
    dig(next.x, next.y, maze, routes);
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
