import render_page from '../lib/render_setup.js';
import { createCanvas } from 'canvas';
import { photo_sketch, section_sketch } from 'sketches';

const photos = async (req, res, next) => {
  const render_promises = [];
  const job_id = req.body.job_id;

  req.body.pages.forEach(async (page) => {
    if (page.page_class == 'section-page') {
      render_promises.push(render_page(section_sketch, page, job_id));
    } else if (page.page_class = 'photo-content') {
      render_promises.push(render_page(photo_sketch, page, job_id));
    } else {
      console.log("Unknown page type, skipping rendering!\n" + page)
    }
  });

  Promise.all(render_promises).then(() => {
    console.log('[' + job_id + ']' + ' Rendering complete');
    next();
  });
}

export default photos;
