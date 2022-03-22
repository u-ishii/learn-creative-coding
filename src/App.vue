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
import { generate2dArray } from '@/utils/array-generator';

const MAZE_WIDTH = 59;
const MAZE_HEIGHT = 41;
const TILE_SIZE = 10;
const START_POSITION: Position = { x: 1, y: 1 };
const GOAL_POSITION: Position = { x: MAZE_WIDTH - 2, y: MAZE_HEIGHT - 2 };

const initializeP5 = (p5: P5) => {
  /* eslint-disable no-param-reassign */
  let maze: Maze;
  let pastPositions: Position[][];
  const visitedMaze: boolean[][] = generate2dArray(MAZE_HEIGHT, MAZE_WIDTH, false);
  p5.setup = () => {
    maze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.clear(0, 0, 0, 0);
    p5.fill('gray');
    drawMaze(p5, maze, TILE_SIZE);
    p5.fill('blue');
    drawTile(p5, START_POSITION, TILE_SIZE);
    p5.fill('red');
    drawTile(p5, GOAL_POSITION, TILE_SIZE);
    // p.translate((MAZE_WIDTH + 1) * TILE_SIZE, 0);
    // drawMaze(p, maze, TILE_SIZE);
    pastPositions = [[START_POSITION]];
  };
  p5.draw = () => {
    if (!pastPositions) return;
    const aroundPositions = Array.from(new Set(
      pastPositions[pastPositions.length - 1].flatMap(
        (cursor) => DIRECTIONS.map(
          (direction) => addPositions(cursor, direction),
        ),
      ),
    ))
      .filter((position) => maze[position.y][position.x] === 'floor')
      .filter((position) => !visitedMaze[position.y][position.x]);
    console.log(aroundPositions);
    aroundPositions.forEach((position) => drawTile(p5, position, TILE_SIZE));
    aroundPositions.forEach((position) => { visitedMaze[position.y][position.x] = true; });
    pastPositions.push(aroundPositions);
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
