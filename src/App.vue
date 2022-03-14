<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';

interface Ball {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
}

const initializeP5 = (p: P5) => {
  /* eslint-disable no-param-reassign */
  let balls: ReadonlyArray<Ball> = [];
  let noiseX = 0;
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.stroke(240);
  };
  p.draw = () => {
    noiseX += 0.05;
    balls = [
      ...balls,
      {
        x: 0,
        y: 0,
        vx: p.noise(noiseX) * 10,
        vy: 0,
      },
    ]
      .map((ball): Ball => ({
        ...ball,
        vy: ball.vy + 0.1,
      }))
      .map((ball): Ball => ({
        ...ball,
        x: ball.x + ball.vx,
        y: ball.y + ball.vy,
      }))
      .filter((ball) => ball.y <= p.height);
    p.clear(0, 0, 0, 0);
    p.noStroke();
    p.fill(240);
    balls.forEach((ball) => {
      p.circle(ball.x, ball.y, 10);
    });
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
