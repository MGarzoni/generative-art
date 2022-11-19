const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const risoColors = require('riso-colors');
const colormap = require('colormap');
const { range } = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1920 ],
  // pixelRatio: 16/9,
  animate: true,
  name: '-spotify-canvas'
};

const sketch = ({ width, height }) => {

  const cols = 100;
  const rows = 10;
  const numCells = cols * rows;

  // grid
  const gw = width;
  const gh = height;

  // cell
  const cw = gw / cols;
  const ch = gh / rows;

  // margin
  const mx = (width - gw) * 0.5;
  const my = (height - gh) * 0.5;

  const points = [];

  let x, y, n, lineWidth, color;
  let frequency = 0.0009;
  let amplitude = 250;

  const colors = colormap({
    colormap: 'hsv',
    nshades: amplitude,
  });

  const bgColor = random.pick(risoColors).hex;
  // console.log(bgColor);

  for (let i = 0; i < numCells; i++) {
    x = (i % cols) * cw;
    y = Math.floor(i / cols) * ch;

    n = random.noise2D(x, y, frequency, amplitude);

    lineWidth = math.mapRange(n, -amplitude, amplitude, 750, 300);

    color = colors[Math.floor(math.mapRange(n, -amplitude, amplitude, 0, amplitude))];

    points.push(new Point({ x, y, lineWidth, color }));
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = '#0C0C0CA';
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mx, my);
    context.translate(cw * 0.5, ch * 0.5);

    // update positions
    points.forEach(point => {
      n = random.noise2D(point.ix + frame * 40, point.iy, frequency, amplitude);
      point.x = point.ix + n;
      point.y = point.iy + n;
    })

    let lastx, lasty;


    // draw lines
    for (let r = 0; r < rows; r++) {

      for (let c = 0; c < cols - 1; c++) {
        const curr = points[r * cols + c + 0];
        const next = points[r * cols + c + 1];

        const mx = curr.x + (next.x - curr.x) * 5;
        const my = curr.y + (next.y - curr.y) * 25;

        if (!c) {
          lastx = curr.x;
          lasty = curr.y;
        }

        context.beginPath();
        context.lineWidth = curr.lineWidth * 0.005;
        context.strokeStyle = curr.color;

        // if (c == 0) context.moveTo(curr.x, curr.y);
        // else if (c == cols - 2) context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
        // else context.quadraticCurveTo(curr.x, curr.y, mx, my);

        context.moveTo(lastx, lasty);
        context.quadraticCurveTo(curr.x, curr.y, mx, my);

        context.stroke();

        lastx = mx - c / cols * 250;
        lasty = my - r / rows * 250;

      };

    };


    // draw point
    points.forEach(point => {
      // point.draw(context);
    })

    context.restore();
  };
};

canvasSketch(sketch, settings);

class Point {

  constructor({ x, y, lineWidth, color }) {

    this.x = x;
    this.y = y;
    this.lineWidth = lineWidth;
    this.color = color;

    this.ix = x;
    this.iy = y;

  };

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = 'red';

    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fill();

    context.restore();
  };

};
