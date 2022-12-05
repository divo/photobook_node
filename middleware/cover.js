import canvasSketch from 'canvas-sketch';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import extension from '../lib/file_util.js';

const safe_area = 15; // mm!

const sketch = ({width, height, canvas, data}) => {
  return ({ context, width, height, data, canvas }) => {
    const img = data['img'];
    const name = data['name'];
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    let scale;
    let y = 0;
    let x = 0;

    if (is_landscape(img)) {
      scale = width / img.width;
    } else {
      scale = height / img.height; // TODO: How to layout landscape covers? Easiest way is to simply not allow it
    }

    const s_height = img.height * scale;

    context.drawImage(img, x, y, (img.width * scale), s_height);

    const fontSize = 6; //TODO: What is going on with the scaling here? What is canvas sketch doing? It's all in mm??
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = `normal ${fontSize}pt Helvetica`;
    context.fillText(name, width / 2, s_height + (( height - s_height) / 2), width);
 };
};

const is_landscape = (image) => {
  return image.width > image.height;
};

const render_cover = async (req, res, next) => {
  const render_promises = [];

  // This works because the cover is already part of the album
  // If it becomes a distrinct image, update the fetcher to download it
  const job_id = req.body.job_id;
  const page = req.body.cover;
  const render_promise = new Promise( async(resolve, reject) => {
    const canvas = createCanvas(210, 210, 'pdf'); //FIXME: I need to pass dimensions to set the type, they don't seem to break anything?

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
    let img = await loadImage('./tmp/images/' + job_id + '/' + key + ext);
    settings.data = { img: img, name: page.name };

    await canvasSketch.canvasSketch(sketch, settings);

    const out = fs.createWriteStream('./tmp/output/' + job_id + '/cover.pdf');
    const file_stream = canvas.createPDFStream(); // This call is sync and some update will probably make it async

    await file_stream.pipe(out);
    out.on('finish', () => { resolve(); } );
  });
  render_promises.push(render_promise);

  Promise.all(render_promises).then(() => {
    console.log('[' + job_id + ']' + ' Cover rendering complete');
    next();
  });
}

export default render_cover;
