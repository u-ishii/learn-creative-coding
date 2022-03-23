<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';
import { Position } from '@/types/maze';
import { unique } from '@/utils/unique';
import { generateMaze } from '@/utils/maze-generator';
import { drawMaze, drawTile } from '@/utils/maze-drawer';
import { solveBfs } from '@/utils/bfs-solver';
import { solveDfs } from '@/utils/dfs-solver';
import { findBfsRoute } from '@/utils/bfs-route-finder';
import { findDfsRoute } from '@/utils/dfs-route-finder';

const MAZE_WIDTH = 59;
const MAZE_HEIGHT = 41;
const TILE_SIZE = 10;
const START_POSITION: Position = {
  x: Math.floor(MAZE_WIDTH / 3),
  y: Math.floor(MAZE_HEIGHT / 3),
};
const GOAL_POSITION: Position = {
  x: MAZE_WIDTH - Math.floor(MAZE_WIDTH / 3) - 1,
  y: MAZE_HEIGHT - Math.floor(MAZE_HEIGHT / 3) - 1,
};

const initializeP5 = (p5: P5) => {
  /* eslint-disable no-param-reassign */
  const maze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);
  const bfsTree = solveBfs(maze, START_POSITION, GOAL_POSITION);
  const dfsTree = solveDfs(maze, START_POSITION, GOAL_POSITION);
  const bfsHistory = bfsTree.flat();
  const dfsHistory = unique(dfsTree.flat(), (p) => p.x * MAZE_HEIGHT + p.y);
  const bfsRoute = findBfsRoute(bfsTree);
  const dfsRoute = findDfsRoute(dfsTree);
  let historyIndex = 1;
  let routeIndex = 1;
  const drawWalls = (): void => {
    p5.fill('gray');
    drawMaze(p5, maze, TILE_SIZE);
  };
  const drawFixedTiles = (): void => {
    p5.fill('blue');
    drawTile(p5, START_POSITION, TILE_SIZE);
    p5.fill('red');
    drawTile(p5, GOAL_POSITION, TILE_SIZE);
  };
  const translateDfs = (): void => {
    p5.translate((MAZE_WIDTH + 1) * TILE_SIZE, 0);
  };
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.clear(0, 0, 0, 0);
    drawWalls();
    translateDfs();
    drawWalls();
  };
  p5.draw = () => {
    drawFixedTiles();
    p5.push();
    translateDfs();
    drawFixedTiles();
    p5.pop();
    const bfsHistoryDrawing = historyIndex < bfsHistory.length - 1;
    const dfsHistoryDrawing = historyIndex < dfsHistory.length - 1;
    p5.fill('green');
    if (bfsHistoryDrawing) {
      drawTile(p5, bfsHistory[historyIndex], TILE_SIZE);
    }
    if (dfsHistoryDrawing) {
      p5.push();
      translateDfs();
      drawTile(p5, dfsHistory[historyIndex], TILE_SIZE);
      p5.pop();
    }
    if (bfsHistoryDrawing || dfsHistoryDrawing) {
      historyIndex += 1;
      return;
    }
    const bfsRouteDrawing = routeIndex < bfsRoute.length - 1;
    const dfsRouteDrawing = routeIndex < dfsRoute.length - 1;
    p5.fill('yellow');
    if (bfsRouteDrawing) {
      drawTile(p5, bfsRoute[routeIndex], TILE_SIZE);
    }
    if (dfsRouteDrawing) {
      p5.push();
      translateDfs();
      drawTile(p5, dfsRoute[routeIndex], TILE_SIZE);
      p5.pop();
    }
    if (dfsRouteDrawing) {
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
