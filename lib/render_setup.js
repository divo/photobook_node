import canvasSketch from 'canvas-sketch';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import extension from './file_util.js';

// Read in image, setup files and call render
const render_setup = function(sketch, page, job_id, size, output_file = null, width_offset = 0, logo_img = null) {
  return new Promise( async(resolve, reject) => {
    const canvas = createCanvas(size[0], size[1], 'pdf');

    const settings = {
      canvas,
      dimensions: size,
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
      caption : page.caption,
      width_offset: width_offset,
      logo_img: logo_img,
      transform_rot: convert_transform(page.transform)[0],
      transform_scale_x: convert_transform(page.transform)[1],
      transform_scale_y: convert_transform(page.transform)[2]
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

const convert_transform = (transform_string) => {
  return transform_string.split(",").map(x => parseInt(x))
};

export default render_setup;
