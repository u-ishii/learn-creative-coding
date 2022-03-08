<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';

const initializeP5 = (p: P5) => {
  /* eslint-disable no-param-reassign */
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
  };
  let angle = 0;
  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);
    p.clear(0, 0, 0, 0);
    p.stroke(240);
    p.noFill();
    p.circle(0, 0, 100 * 2);
    p.noStroke();
    p.fill(240);
    p.circle(p.cos(angle) * 100, p.sin(angle) * 100, 10);
    angle = (angle + 5) % 360;
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
