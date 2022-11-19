const canvasSketch = require('canvas-sketch'); // importing canvas

const settings = {
  // [ 1080, 1080 ] for instagram
  dimensions: [ 1080, 1080 ] // values in pixels
  // check other settings to include here as the base fot he canvas, such as dimensions
};

const sketch = () => { // returning an anonymous function with different aspects of the sketch
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.lineWidth = width * 0.01;
    
    const w = width * 0.10; // scale to 10% of whatever the canvas width is
    const h = height * 0.10;
    const gap = width * 0.03;
    const ix = width * 0.17;
    const iy = height * 0.17;
    
    const off = width * 0.02;
    let x, y;
    
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j <5; j++) {
            x = ix + (w + gap) * i;
            y = iy + (h + gap) * j;
            
            context.beginPath();
            context.rect(x, y, w, h);
            context.stroke();
            
            if (Math.random() > 0.5) {
                context.beginPath();
                context.rect(x + off / 2, y + off / 2, w - off, h - off);
                context.stroke();
            }
        }
    }
  };
};

canvasSketch(sketch, settings); // call function and pass params
