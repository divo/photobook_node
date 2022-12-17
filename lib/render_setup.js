import canvasSketch from 'canvas-sketch';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import extension from './file_util.js';

// Read in image, setup files and call render
const render_setup = function(sketch, page, job_id, output_file = null) {
  return new Promise( async(resolve, reject) => {
    const canvas = createCanvas(148, 210, 'pdf');

    const settings = {
      canvas,
      dimensions: [148, 210],
      pixelsPerInch: 300,
      orientation: 'landscape',
      units: 'mm',
      hotkeys: false,
      scaleToFitPadding: 0,
    };

    const key = page.key;
    const ext = extension(page.content_type);
    let img = await loadImage(global.__basedir + '/tmp/images/' + job_id + '/' + key + ext);
    settings.data = {
      img: img,
      name: page.name,
      address: page.address,
      country : page.country,
    };

    await canvasSketch.canvasSketch(sketch, settings);

    if(!output_file) {
      output_file = key
    }
    const out = fs.createWriteStream(global.__basedir + '/tmp/output/' + job_id + '/' + output_file + '.pdf');
    const file_stream = canvas.createPDFStream(); // This call is sync and some update will probably make it async

    await file_stream.pipe(out);
    out.on('finish', () => { resolve(); } );
  });
}

export default render_setup;
