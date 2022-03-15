<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';

interface Position {
  readonly x: number;
  readonly y: number;
}

const initializeP5 = (p: P5) => {
  /* eslint-disable no-param-reassign */
  const dragon = (n: number, a: Position, b: Position, sign: 1 | -1) => {
    if (n === 0) {
      p.line(a.x, a.y, b.x, b.y);
      return;
    }
    const deg = p.atan2(b.y - a.y, b.x - a.x) - 45 * sign;
    const d = p.dist(a.x, a.y, b.x, b.y) * (p.sqrt(2) / 2);
    const c = { x: a.x + p.cos(deg) * d, y: a.y + p.sin(deg) * d };
    dragon(n - 1, a, c, 1);
    dragon(n - 1, c, b, -1);
  };
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.stroke(240);
    p.noFill();
    const a = { x: p.width * 0.25, y: p.height / 2 };
    const b = { x: p.width * 0.75, y: p.height / 2 };
    dragon(20, a, b, 1);
  };
  // p.draw = () => {
  // };
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
