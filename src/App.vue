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
  };
  let t = 0;
  p.draw = () => {
    t += 0.005;
    if (t > 1) {
      t = 0;
    }

    p.clear(0, 0, 0, 0);
    p.fill('blue');
    p.circle(
      p.lerp(0, p.width, t),
      p.lerp(0, p.height, t),
      20,
    );
    p.fill('red');
    p.circle(
      p.lerp(0, p.width, t * t),
      p.lerp(0, p.height, t * t),
      20,
    );
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
