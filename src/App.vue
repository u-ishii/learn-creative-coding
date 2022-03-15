<template>
  <div ref="canvas" class="canvas"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import P5 from 'p5';

type OriginalOperator = 'F' | 'X' | 'Y';
type GeneralOperator = '+' | '-' | '[' | ']';
type Operator = OriginalOperator | GeneralOperator;
type Command = ReadonlyArray<Operator>;
type Rules = Partial<Record<Operator, Command>>;

interface StackElement {
  readonly x: number;
  readonly y: number;
  readonly angle: number;
}

interface Data {
  readonly start: Command;
  readonly rules: Rules;
  readonly length: number;
  readonly depth: number;
  readonly x: number;
  readonly y: number;
  readonly startAngle: number;
  readonly angle: number;
  readonly none: Command;
}

const initializeP5 = (p: P5) => {
  /* eslint-disable no-param-reassign */
  const addCommand = (command: Command, rules: Rules): Command => (
    command
      .flatMap((operator: Operator) => rules?.[operator] || [operator])
  );
  const drawLSystem = (data: Data) => {
    let command = data.start;
    for (let i = 0; i < data.depth; i += 1) {
      command = addCommand(command, data.rules);
    }
    const stack: StackElement[] = [];
    // let angle = data.startAngle;
    let { x, y, startAngle: angle } = data;
    // eslint-disable-next-line no-restricted-syntax
    for (const c of command) {
      switch (c) {
        case '+':
          angle -= data.angle;
          break;
        case '-':
          angle += data.angle;
          break;
        case '[':
          stack.push({ angle, x, y });
          break;
        case ']':
          // eslint-disable-next-line no-case-declarations
          const d = stack.pop();
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          [angle, x, y] = [d!.angle, d!.x, d!.y];
          break;
        default:
          if (data.none.indexOf(c) === -1) {
            const tx = x + p.cos(angle) * data.length;
            const ty = y + p.sin(angle) * data.length;
            p.line(x, y, tx, ty);
            x = tx;
            y = ty;
          }
          break;
      }
    }
  };
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.stroke(240);
    p.noFill();
    drawLSystem({
      start: ['F'],
      rules: { F: ['F', '+', 'F', '-', '-', 'F', '+', 'F'] },
      length: 5,
      depth: 5,
      x: 0,
      y: p.height / 2,
      startAngle: 0,
      angle: 60,
      none: [],
    });
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
