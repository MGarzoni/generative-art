const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const risoColors = require('riso-colors');
const colormap = require('colormap');
const eases = require('eases');


const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;
let minDb, maxDb;

const sketch = () => {

  const numCircles = 10;
  const numSlices = 18;
  const slice = Math.PI * 2 / numSlices;
  const radius = 150;

  const bins = [];
  const lineWidths = [];
  const rotationOffsets = [];

  let lineWidth, bin, mapped, phi;

  const colors = colormap({
    colormap: 'plasma',
    nshades: 20,
    format: 'hex',
    alpha: 1
});

  for (let i = 0; i < numCircles * numSlices; i++) {
    bin = random.rangeFloor(100, 200);
    bins.push(bin);
  }

  for (let i = 0; i < numCircles; i++) {
    const t = i / (numCircles - 1);
    lineWidth = eases.elasticInOut(t) * 20 + 150;
    lineWidths.push(lineWidth);
  }

  for (let i = 0; i < numCircles; i++) {
    rotationOffsets.push(random.range(Math.PI * -0.25, Math.PI * 0.25) - Math.PI * 0.5);
  }

  return ({ context, width, height }) => {
    context.fillStyle = '#EEEAE0';
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;

    analyserNode.getFloatFrequencyData(audioData);

    context.save();
    context.translate(width * 0.5, height * 0.5);
    // context.scale(1, -1);

    let cradius = radius;

    for (let i = 0; i < numCircles; i++) {
      context.save();
      context.rotate(rotationOffsets[i]);

      cradius += context.lineWidth * 0.25 + 15;

      for (let j = 0; j < numSlices; j++) {
        context.rotate(slice);
        context.lineWidth = lineWidths[i];

        bin = bins[i * numSlices + j];

        mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true);

        phi = slice * mapped;

        context.beginPath();
        context.arc(0, 0, cradius / 1.75, 0, phi);
        context.strokeStyle = random.pick(colors);
        context.stroke();

      }

      cradius += lineWidths[i] * 0.05;

      context.restore();

    }

    context.restore();

  };
};

const addListeners = () => {
  window.addEventListener('mouseup', () => {
    if (!audioContext) createAudio();

    if (audio.paused) {
      audio.play();
      manager.play();
    }
    else {
      audio.pause();
      manager.pause();
    }
  });
};

const createAudio = () => {
  audio = document.createElement('audio');
  audio.src = '/audio/break.wav'; 

  audioContext = new AudioContext();

  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);

  minDb = analyserNode.minDecibels;
  maxDb = analyserNode.maxDecibels;

  audioData = new Float32Array(analyserNode.frequencyBinCount);
};

const start = async() => {
  addListeners();
  manager = await canvasSketch(sketch, settings);
  manager.pause();
};

start();
