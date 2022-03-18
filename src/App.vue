<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';
import { Maze, Position } from '@/types/maze';
import { addPositions, DIRECTIONS } from '@/utils/position-calculator';
import { generateMaze } from '@/utils/maze-generator';
import { drawMaze, drawTile } from '@/utils/maze-drawer';

const MAZE_WIDTH = 59;
const MAZE_HEIGHT = 41;
const TILE_SIZE = 10;
const START_POSITION: Position = { x: 1, y: 1 };
const GOAL_POSITION: Position = { x: MAZE_WIDTH - 2, y: MAZE_HEIGHT - 2 };

const initializeP5 = (p: P5) => {
  /* eslint-disable no-param-reassign */
  let maze: Maze;
  let histories: Position[][];
  const visited = new Set<Position>();
  p.setup = () => {
    maze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.clear(0, 0, 0, 0);
    p.fill('gray');
    drawMaze(p, maze, TILE_SIZE);
    p.fill('blue');
    drawTile(p, START_POSITION, TILE_SIZE);
    p.fill('red');
    drawTile(p, GOAL_POSITION, TILE_SIZE);
    // p.translate((MAZE_WIDTH + 1) * TILE_SIZE, 0);
    // drawMaze(p, maze, TILE_SIZE);
    histories = [[START_POSITION]];
  };
  p.draw = () => {
    if (!histories) return;
    const aroundPositions = new Set(
      histories.flatMap(
        (cursors) => cursors.flatMap(
          (cursor) => DIRECTIONS.map(
            (d) => addPositions(cursor, d),
          ),
        ),
      ),
    );
    aroundPositions.forEach((position) => drawTile(p, position, TILE_SIZE));
  };
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
