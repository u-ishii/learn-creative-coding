<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';

const initializeP5 = (p: P5) => {
  /* eslint-disable no-param-reassign */
  let x = 0;
  let y = 0;
  let vx: number;
  let vy = 0;
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.stroke(240);
    vx = p.floor(p.random(1, 5));
  };
  p.draw = () => {
    vy += 0.1;
    x += vx;
    y += vy;
    p.clear(0, 0, 0, 0);
    p.noStroke();
    p.fill(240);
    p.circle(x, y, 10);
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
