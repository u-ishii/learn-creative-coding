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
    p.pixelDensity(1);
  };
  p.draw = () => {
    p.loadPixels();
    for (let i = 0; i < p.pixels.length; i += 1) {
      p.pixels[i + 0] = p.random(256);
      p.pixels[i + 1] = p.random(256);
      p.pixels[i + 2] = p.random(256);
      p.pixels[i + 3] = p.random(256);
    }
    p.updatePixels();
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
