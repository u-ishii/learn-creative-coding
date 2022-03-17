<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';
import { generateMaze } from '@/utils/maze-generator';
import { drawMaze } from '@/utils/maze-drawer';

const MAZE_WIDTH = 59;
const MAZE_HEIGHT = 41;
const TILE_SIZE = 10;

const initializeP5 = (p: P5) => {
  /* eslint-disable no-param-reassign */
  p.setup = () => {
    const maze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.clear(0, 0, 0, 0);
    p.fill('#666');
    p.strokeWeight(1);
    drawMaze(p, maze, TILE_SIZE);
    p.translate((MAZE_WIDTH + 1) * TILE_SIZE, 0);
    drawMaze(p, maze, TILE_SIZE);
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
