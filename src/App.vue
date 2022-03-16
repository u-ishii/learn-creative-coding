<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';

type OriginalOperator = 'F' | 'X' | 'Y';
type GeneralOperator = '+' | '-' | '[' | ']';
type Operator = OriginalOperator | GeneralOperator;
type Command = ReadonlyArray<Operator>;
type Rules = Partial<Record<Operator, Command>>;

type Cell = 'floor' | 'wall';

interface Position {
  readonly x: number;
  readonly y: number;
}

const tileWidth = 59;
const tileHeight = 41;
const tileSize = 10;
const directions: ReadonlyArray<Position> = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];
let map: Cell[][];
let positions;

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

const initializeP5 = (p: P5) => {
  /* eslint-disable no-param-reassign */
  const dig = (x: number, y: number) => {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const dir of getDirections()) {
      const tx = x + dir.x;
      const ty = y + dir.y;
      const tx2 = x + dir.x * 2;
      const ty2 = y + dir.y * 2;

      if (tx2 >= 0 && tx2 < tileWidth && ty2 >= 0 && ty2 < tileHeight && map[ty2][tx2] === 'wall') {
        map[ty][tx] = 'floor';
        map[ty2][tx2] = 'floor';
        positions.push({ x, y });
        positions.push({ x: tx2, y: ty2 });
        return { x: tx2, y: ty2 };
      }
    }
    return null;
  };
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    map = [];
    for (let y = 0; y < tileHeight; y += 1) {
      map[y] = [];
      for (let x = 0; x < tileWidth; x += 1) {
        map[y][x] = 'wall';
      }
    }

    positions = [];

    const sx = p.floor(p.random((tileWidth - 1) / 2 - 1)) * 2 + 1;
    const sy = p.floor(p.random((tileHeight - 1) / 2 - 1)) * 2 + 1;
    map[sy][sx] = 'floor';
    positions.push({ x: sx, y: sy });

    while (positions.length > 0) {
      const next = positions.pop();
      dig(next!.x, next!.y);
    }

    p.clear(0, 0, 0, 0);
    p.fill('#666');
    p.strokeWeight(1);

    for (let y = 0; y < tileHeight; y += 1) {
      for (let x = 0; x < tileWidth; x += 1) {
        const tile = map[y][x];
        if (tile === 'wall') {
          const tx = x * tileSize;
          const ty = y * tileSize;
          p.rect(tx, ty, tileSize, tileSize);
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
