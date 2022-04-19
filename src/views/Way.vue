<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';

interface Station {
  name: string;
  x: number;
  y: number;
}

const getStations = (p5: P5): Station[] => {
  const pureStations: Station[] = [
    { name: '東京', y: 3568138, x: 13976608 },
    { name: '有楽町', y: 3567506, x: 13976332 },
    { name: '新橋', y: 3566549, x: 13975964 },
    { name: '浜松町', y: 3565564, x: 13975674 },
    { name: '田町', y: 3564573, x: 13974757 },
    { name: '品川', y: 3563015, x: 13974044 },
    { name: '大崎', y: 3561970, x: 13972855 },
    { name: '五反田', y: 3562644, x: 13972344 },
    { name: '目黒', y: 3563399, x: 13971582 },
    { name: '恵比寿', y: 3564669, x: 13971010 },
    { name: '渋谷', y: 3565851, x: 13970133 },
    { name: '原宿', y: 3567016, x: 13970268 },
    { name: '代々木', y: 3568306, x: 13970204 },
    { name: '新宿', y: 3569092, x: 13970025 },
    { name: '新大久保', y: 3570130, x: 13970004 },
    { name: '高田馬場', y: 3571228, x: 13970378 },
    { name: '目白', y: 3572120, x: 13970658 },
    { name: '池袋', y: 3572892, x: 13971038 },
    { name: '大塚', y: 3573140, x: 13972866 },
    { name: '巣鴨', y: 3573349, x: 13973934 },
    { name: '駒込', y: 3573648, x: 13974687 },
    { name: '田端', y: 3573806, x: 13976085 },
    { name: '西日暮里', y: 3573213, x: 13976678 },
    { name: '日暮里', y: 3572777, x: 13977098 },
    { name: '鶯谷', y: 3572049, x: 13977883 },
    { name: '上野', y: 3571376, x: 13977725 },
    { name: '御徒町', y: 3570743, x: 13977463 },
    { name: '秋葉原', y: 3569868, x: 13977421 },
    { name: '神田', y: 3569169, x: 13977088 },
    { name: '高輪ゲートウェイ', y: 3563554, x: 13974072 },
  ];
  const minPosition = {
    x: Math.min(...pureStations.map((s) => s.x)),
    y: Math.min(...pureStations.map((s) => s.y)),
  };
  const maxPosition = {
    x: Math.max(...pureStations.map((s) => s.x)),
    y: Math.max(...pureStations.map((s) => s.y)),
  };
  const aspect = (maxPosition.y - minPosition.y) / (maxPosition.x - minPosition.x);
  return pureStations.map((station) => ({
    ...station,
    x: p5.map(station.x, minPosition.x, maxPosition.x, 0, 1000 / aspect),
    y: p5.map(station.y, minPosition.y, maxPosition.y, 0, 1000),
  }));
};

const initializeP5 = (p5: P5) => {
  /* eslint-disable no-param-reassign */
  p5.setup = () => {
    p5.createCanvas(1000, 1000);
    p5.clear(0, 0, 0, 0);
    getStations(p5).forEach((station) => {
      p5.circle(station.x, station.y, 10);
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
