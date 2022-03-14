<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';

interface Point {
  x: number;
  y: number;
}

const initializeP5 = (p: P5) => {
  /* eslint-disable no-param-reassign */
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.stroke(240);
  };
  let angle = 0;
  p.draw = () => {
    p.clear(0, 0, 0, 0);
    p.applyMatrix(1, 0, 0, 1, p.width / 2, p.height / 2);
    p.applyMatrix(2, 0, 0, 2, 0, 0);
    p.applyMatrix(
      // p.cos(angle),
      0,
      p.sin(angle),
      -p.sin(angle),
      // p.cos(angle),
      0,
      0, 0,
    );
    p.circle(100, 0, 20);
    angle += 0.02;
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
