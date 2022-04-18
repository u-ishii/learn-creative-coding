<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';
import { Position, Maze } from '@/types/maze';
import { generateDiggedMaze, generatePutMaze } from '@/utils/maze-generator';
import { drawMaze, drawTile } from '@/utils/maze-drawer';
import { solveMaze, Solution } from '@/utils/maze-solver';
import { Stack, Queue } from '@/types/iterator';

const MAZE_WIDTH = 25;
const MAZE_HEIGHT = 25;
// const MAZE_WIDTH = 59;
// const MAZE_HEIGHT = 41;
const TILE_SIZE = 10;
const START_POSITION: Position = {
  x: Math.ceil(MAZE_WIDTH / 4),
  y: Math.ceil(MAZE_HEIGHT / 4),
};
const GOAL_POSITION: Position = {
  x: MAZE_WIDTH - Math.floor(MAZE_WIDTH / 4),
  y: MAZE_HEIGHT - Math.floor(MAZE_HEIGHT / 4),
};

interface Experiment {
  maze: Maze;
  solution: Solution;
  transform: Position;
}

const initializeP5 = (p5: P5) => {
  /* eslint-disable no-param-reassign */
  const diggedMaze = generateDiggedMaze(MAZE_WIDTH, MAZE_HEIGHT);
  const putMaze = generatePutMaze(MAZE_WIDTH, MAZE_HEIGHT, [START_POSITION, GOAL_POSITION], 0.1);
  const experiments: Experiment[] = [
    {
      maze: diggedMaze,
      solution: solveMaze(diggedMaze, START_POSITION, GOAL_POSITION, () => new Queue()),
      transform: { x: 0, y: 0 },
    },
    {
      maze: diggedMaze,
      solution: solveMaze(diggedMaze, START_POSITION, GOAL_POSITION, () => new Stack()),
      transform: { x: 1, y: 0 },
    },
    {
      maze: putMaze,
      solution: solveMaze(putMaze, START_POSITION, GOAL_POSITION, () => new Queue()),
      transform: { x: 0, y: 1 },
    },
    {
      maze: putMaze,
      solution: solveMaze(putMaze, START_POSITION, GOAL_POSITION, () => new Stack()),
      transform: { x: 1, y: 1 },
    },
  ];
  let historyIndex = 1;
  let routeIndex = 1;
  const drawFixedTiles = (): void => {
    p5.fill('blue');
    drawTile(p5, START_POSITION, TILE_SIZE);
    p5.fill('red');
    drawTile(p5, GOAL_POSITION, TILE_SIZE);
  };
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.clear(0, 0, 0, 0);
    experiments.forEach((experiment) => {
      p5.push();
      p5.translate(
        (MAZE_WIDTH + 1) * experiment.transform.x * TILE_SIZE,
        (MAZE_HEIGHT + 1) * experiment.transform.y * TILE_SIZE,
      );
      p5.fill('gray');
      drawMaze(p5, experiment.maze, TILE_SIZE);
      drawFixedTiles();
      p5.pop();
    });
  };
  p5.draw = () => {
    const isHistoryDrawing = experiments
      .some((experiment) => historyIndex < experiment.solution.history.length - 1);
    const isRouteDrawing = !isHistoryDrawing && experiments
      .some((experiment) => routeIndex < experiment.solution.route.length - 1);
    if (!isHistoryDrawing && !isRouteDrawing) {
      return;
    }
    experiments.forEach((experiment) => {
      p5.push();
      p5.translate(
        (MAZE_WIDTH + 1) * experiment.transform.x * TILE_SIZE,
        (MAZE_HEIGHT + 1) * experiment.transform.y * TILE_SIZE,
      );
      if (isHistoryDrawing && historyIndex < experiment.solution.history.length - 1) {
        p5.fill('green');
        drawTile(p5, experiment.solution.history[historyIndex], TILE_SIZE);
      }
      if (isRouteDrawing && routeIndex < experiment.solution.route.length - 1) {
        p5.fill('yellow');
        drawTile(p5, experiment.solution.route[routeIndex], TILE_SIZE);
      }
      p5.pop();
    });
    if (isHistoryDrawing) {
      historyIndex += 1;
    }
    if (isRouteDrawing) {
      routeIndex += 1;
    }
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
