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

const readCapitals = (p5: P5): Capital[] => {
  const capitals = Papa.parse<Record<string, string>>(CAPITALS_TEXT, { header: true, delimiter: '\t' }).data;
  return capitals
    .map((capital) => ({
      name: capital.name_ens,
      x: parseFloat(capital.lon),
      y: parseFloat(capital.lat),
    }));
};

const initializeP5 = (p5: P5) => {
  /* eslint-disable no-param-reassign */
  p5.setup = () => {
    p5.createCanvas(1000, 1000);
    p5.clear(0, 0, 0, 0);
    readCapitals(p5).forEach((capital) => {
      p5.circle(capital.x, capital.y, 10);
    });
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
