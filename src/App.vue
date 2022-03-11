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
  const lerp2d = (a: Point, b: Point, t: number) => (
    {
      x: p.lerp(a.x, b.x, t),
      y: p.lerp(a.y, b.y, t),
    }
  );
  const drawBezier = (a: Point, b: Point, c: Point) => {
    let prev = a;
    const n = 100;
    for (let i = 0; i <= n; i += 1) {
      const t = i / n;
      const d = lerp2d(a, b, t);
      const e = lerp2d(b, c, t);
      const f = lerp2d(d, e, t);
      p.line(prev.x, prev.y, f.x, f.y);
      prev = f;
    }
  };
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.stroke(240);
    drawBezier(
      { x: 0, y: p.height },
      { x: p.width / 2, y: 0 },
      { x: p.width, y: p.height },
    );
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
