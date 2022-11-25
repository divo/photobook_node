import canvasSketch from 'canvas-sketch';
import { createCanvas, loadImage } from 'canvas';
//import Canvas from 'canvas'
import fs from 'fs';
import extension from '../lib/file_util.js';

const safe_area = 15; // mm!

const sketch = ({width, height, canvas, data}) => {
  return ({ context, width, height, data, canvas }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    let scale;
    let y = 0;
    let x = 0;

    if (is_landscape(data)) {
      scale = width / data.width;
      y = (height - (data.height * scale)) / 2;
    } else {
      scale = height / data.height;
      x = (width - (data.width * scale)) / 2;
    }

    context.drawImage(data, safe_area + x, safe_area + y, (data.width * scale) - (safe_area * 2), (data.height * scale) - (safe_area * 2));
  };
};

const is_landscape = (image) => {
  return image.width > image.height;
};

const render_sketch = async (req, res, next) => {
  const render_promises = [];

  req.body.pages.forEach(async (page) => {
    const render_promise = new Promise( async(resolve, reject) => {
      const canvas = createCanvas();

      const settings = {
        canvas,
        dimensions: [210, 210],
        pixelsPerInch: 300,
        orientation: 'landscape',
        units: 'mm',
        hotkeys: false,
        scaleToFitPadding: 0,
      };

      const key = page.key;
      const ext = extension(page.content_type);
      // TODO: This seems pretty dumb, I should use a memory store.
      let img = await loadImage('./tmp/images/' + key + ext);
      settings.data = img;

      await canvasSketch.canvasSketch(sketch, settings);

      const out = fs.createWriteStream('./tmp/output/' + key + '.jpg');
      const file_stream = canvas.createJPEGStream({ quality: 1.0 }); // This call is sync and some update will probably make it async
      await file_stream.pipe(out);
      out.on('finish', () => { resolve(); } );
    });
    render_promises.push(render_promise);
  });

  Promise.all(render_promises).then(() => {
    console.log('Rendering complete');
    next();
  });
}

export default render_sketch;
