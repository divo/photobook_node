const canvasSketch = require('canvas-sketch');
const Canvas = require('canvas');
const fs = require('fs');

const canvas = Canvas.createCanvas();

const settings = {
  canvas,
  dimensions: [ 400, 480 ],
};

const sketch = (img) => {
  return ({ context, width, height }) => {
    context.fillStyle = 'blue';
    context.fillRect(0, 0, width, height);
    context.drawImage(img, 0, 0);
  };
};

const loadImage = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new Canvas.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};

const render_sketch = async (req, res, next) => {
  // TODO: This seems pretty dumb, I should use a memory store.
  const img = await loadImage(req.file.path);
  await canvasSketch(sketch(img), settings)

  // Once sketch is loaded & rendered, stream a PNG with node-canvas
  // This is also dumb, it should render to an in memory object
  // TODO: Render to in memory
  const out = fs.createWriteStream('./output/' + req.file.originalname);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => next());
}

module.exports = render_sketch;
