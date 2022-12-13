import render_page from '../lib/render_setup.js';
import { createCanvas } from 'canvas';
import { photo_sketch } from 'sketches';

const photos = async (req, res, next) => {
  const render_promises = [];
  const job_id = req.body.job_id;

  req.body.pages.forEach(async (page) => {
    render_promises.push(render_page(photo_sketch, page, job_id));
  });

  Promise.all(render_promises).then(() => {
    console.log('[' + job_id + ']' + ' Rendering complete');
    next();
  });
}

export default photos;
