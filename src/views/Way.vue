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

type Edge = [number, number];
type Graph = Edge[];

const WIDTH = 1000;
const HEIGHT = 500;

const readCapitals = (p5: P5): Capital[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = Papa.parse<Record<string, any>>(CAPITALS_TEXT, { header: true, dynamicTyping: true, delimiter: '\t' }).data;
  return rows
    .map((row) => ({
      name: row.name_ens,
      x: Math.floor(p5.map(row.lon, -180, 180, 0, WIDTH)),
      y: Math.floor(p5.map(row.lat * -1, -90, 90, 0, HEIGHT)),
    }));
};

const thinOutCapitals = (capitals: Capital[]): Capital[] => {
  const step = 20;
  return Lodash.range(0, WIDTH, step).flatMap((gridX) => (
    Lodash.range(0, HEIGHT, step).flatMap((gridY) => {
      const gridCapitals = capitals.filter((capital) => (
        capital.x >= gridX && capital.x < gridX + step
        && capital.y >= gridY && capital.y < gridY + step
      ));
      return gridCapitals.length > 0 ? gridCapitals[0] : [];
    })
  ));
};

const generateMst = (capitals: Capital[], distances: number[][]): Graph => {
  const appendedIndices = [0];
  const restIndices = new Set([...Array(capitals.length).keys()]);
  const graph: Edge[] = [];
  while (restIndices.size > 0) {
    const candidateEdges = appendedIndices.flatMap((i) => (
      [...restIndices].map((j) => (
        [i, j] as Edge
      ))
    ));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [nearestAppendedIndex, nearestRestIndex] = (
      Lodash.minBy(candidateEdges, ([i, j]) => distances[i][j])
    )!;
    appendedIndices.push(nearestRestIndex);
    restIndices.delete(nearestRestIndex);
    graph.push([nearestAppendedIndex, nearestRestIndex]);
  }
  return graph;
};

const initializeP5 = (p5: P5) => {
  /* eslint-disable no-param-reassign */
  let capitals: Capital[] = [];
  let graph: Graph = [];
  let drawingGraphIndex = 0;
  p5.setup = () => {
    p5.createCanvas(WIDTH, HEIGHT);
    p5.frameRate(10);
    capitals = thinOutCapitals(readCapitals(p5));
    p5.clear(0, 0, 0, 0);
    const distances = capitals.map((a) => (
      capitals.map((b) => (
        Math.floor(Math.sqrt(Math.abs(a.x - b.x) ** 2 + Math.abs(a.y - b.y) ** 2))
      ))
    ));
    graph = generateMst(capitals, distances);
  };
  p5.draw = () => {
    if (drawingGraphIndex >= graph.length) {
      return;
    }
    const [a, b] = graph[drawingGraphIndex];
    p5.push();
    p5.strokeWeight(2);
    p5.stroke('yellow');
    p5.line(capitals[a].x, capitals[a].y, capitals[b].x, capitals[b].y);
    p5.pop();
    p5.push();
    p5.stroke(0);
    p5.fill('white');
    capitals
      .forEach((capital) => {
        p5.circle(capital.x, capital.y, 10);
      });
    p5.pop();
    p5.push();
    p5.fill('green');
    Lodash.range(0, drawingGraphIndex + 1).forEach((i) => {
      const capital = capitals[graph[i][1]];
      p5.circle(capital.x, capital.y, 10);
    });
    p5.pop();
    drawingGraphIndex += 1;
  };
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
