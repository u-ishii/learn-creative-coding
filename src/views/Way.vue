<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';
import * as Papa from 'papaparse';
import * as Lodash from 'lodash-es';
import { CAPITALS_TEXT } from '@/data/capitals';

interface Capital {
  name: string;
  x: number;
  y: number;
}

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

const generateMst = (capitals: Capital[], distances: number[][]): [number, number][] => {
  const appendedIndices = [0];
  const restIndices = new Set([...Array(capitals.length).keys()]);
  const tree: [number, number][] = [];
  while (restIndices.size > 0) {
    const candidateIndices = appendedIndices.flatMap((i) => (
      [...restIndices].map((j) => (
        [i, j] as [number, number]
      ))
    ));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [nearestAppendedIndex, nearestRestIndex] = (
      Lodash.minBy(candidateIndices, ([i, j]) => distances[i][j])
    )!;
    appendedIndices.push(nearestRestIndex);
    restIndices.delete(nearestRestIndex);
    tree.push([nearestAppendedIndex, nearestRestIndex]);
  }
  return tree;
};

const initializeP5 = (p5: P5) => {
  /* eslint-disable no-param-reassign */
  p5.setup = () => {
    p5.createCanvas(1000, 500);
    const capitals = readCapitals(p5);
    p5.clear(0, 0, 0, 0);
    const distances = capitals.map((a) => (
      capitals.map((b) => (
        Math.floor(Math.sqrt(Math.abs(a.x - b.x) ** 2 + Math.abs(a.y - b.y) ** 2))
      ))
    ));
    const graph = generateMst(capitals, distances);
    p5.stroke(0);
    p5.fill('white');
    capitals
      .forEach((capital) => {
        p5.circle(capital.x, capital.y, 10);
      });
    p5.stroke('yellow');
    graph.forEach(([a, b]) => {
      p5.line(capitals[a].x, capitals[a].y, capitals[b].x, capitals[b].y);
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
