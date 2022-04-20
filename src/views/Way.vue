<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';
import * as Papa from 'papaparse';
import { CAPITALS_TEXT } from '@/data/capitals';

interface Capital {
  name: string;
  x: number;
  y: number;
}

// const mst = () => {

// };

const readCapitals = (p5: P5): Capital[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = Papa.parse<Record<string, any>>(CAPITALS_TEXT, { header: true, dynamicTyping: true, delimiter: '\t' }).data;
  return rows
    .map((row) => ({
      name: row.name_ens,
      x: Math.floor(p5.map(row.lon, -180, 180, 0, p5.width)),
      y: Math.floor(p5.map(row.lat * -1, -90, 90, 0, p5.height)),
    }));
};

const initializeP5 = (p5: P5) => {
  /* eslint-disable no-param-reassign */
  p5.setup = () => {
    p5.createCanvas(1000, 500);
    const capitals = readCapitals(p5);
    p5.clear(0, 0, 0, 0);
    capitals
      .forEach((capital) => {
        p5.circle(capital.x, capital.y, 10);
      });
    const distances = capitals.map((a) => (
      capitals.map((b) => (
        Math.floor(Math.sqrt(Math.abs(a.x - b.x) ** 2 + Math.abs(a.y - b.y) ** 2))
      ))
    ));
    console.log(distances);
  };
  // p5.draw = () => {
  // };
  /* eslint-enable no-param-reassign */
};

export default defineComponent({
  name: 'Way',
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
