const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [2048, 2048]
};

random.setSeed(random.getRandomSeed());
console.log(random.getSeed());

const sketch = () => {
  const numColors = random.rangeFloor(2, 6);
  const palette = random.pick(palettes).slice(0, numColors);

  const createGrid = () => {
    const points = [];
    const count = 50;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.15;
        const rotation = random.noise2D(u, v) * 2;

        points.push({
          radius,
          rotation,
          position: [u, v],
          color: random.pick(palette)
        });
      }
    }

    return points;
  };

  const points = createGrid().filter(() => random.value() > 0.5);

  return ({ context, width, height }) => {
    const margin = width * 0.05;
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(({ radius, position: [u, v], rotation, color }) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Arial"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('|', 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
