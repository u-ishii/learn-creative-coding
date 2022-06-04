<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as _ from 'lodash-es';
import P5 from 'p5';
import {
  C4Board, C4BPlayer, C4RPlayer,
} from '@/utils/c4-ai';
import { findBestMove } from '@/utils/minimax';

const initializeP5 = (p5: P5) => {
  let phase: 'Player' | 'EnemyStart' | 'EnemyThink' | 'End' = 'Player';
  let board = C4Board.empty();
  let playerMove = 0;
  const drawBoard = () => {
    p5.push();
    p5.stroke('white');
    p5.translate(40, 80);
    _.times(board.xSize, (x) => {
      _.times(board.ySize, (y) => {
        const piece = board.columns[x].get(y);
        // eslint-disable-next-line no-nested-ternary
        const color = piece === C4BPlayer ? 'darkblue' : piece === C4RPlayer ? 'darkred' : 'black';
        p5.fill(color);
        p5.circle(x * 40, y * 40, 30);
      });
    });
    p5.pop();
  };
  const drawArrow = () => {
    p5.push();
    p5.noFill();
    p5.stroke('white');
    p5.translate(40 + playerMove * 40, 30);
    p5.triangle(-15, -10, 15, -10, 0, 20);
    p5.pop();
  };
  const eraseArrow = () => {
    p5.push();
    p5.fill('black');
    p5.rect(10, 10, 40 * board.xSize + 10, 50);
    p5.pop();
  };
  /* eslint-disable no-param-reassign */
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.frameRate(10);
    p5.clear(0, 0, 0, 0);
    drawBoard();
    drawArrow();
  };
  p5.draw = () => {
    if (phase === 'EnemyStart') {
      phase = 'EnemyThink';
      (async () => {
        const { move: enemyMove } = findBestMove(board, 3);
        board = board.move(enemyMove);
        drawBoard();
        phase = board.isWin() ? 'End' : 'Player';
      })();
    }
  };
  p5.keyPressed = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      if (event.key === 'ArrowLeft' && playerMove > 0) {
        playerMove -= 1;
      }
      if (event.key === 'ArrowRight' && playerMove < board.xSize - 1) {
        playerMove += 1;
      }
      eraseArrow();
      drawArrow();
    }
    if (event.key === ' ' && phase === 'Player') {
      board = board.move(playerMove);
      drawBoard();
      phase = board.isWin() ? 'End' : 'EnemyStart';
    }
  };
  /* eslint-enable no-param-reassign */
};

export default defineComponent({
  name: 'C4',
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
  background: black;
}
</style>
