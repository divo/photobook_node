import render_page from '../lib/render_setup.js';
import { cover_sketch } from '@divo/photobook-sketches'

const is_landscape = (image) => {
  return image.width > image.height;
};

const render_cover = async (req, res, next) => {
  const render_promises = [];
  const job_id = req.body.job_id;
  const size = req.body.size;

  const no_pages = req.body.pages.length;
  const width = (size[0] * 2) + spine(no_pages);

  // This works because the cover is already part of the album
  // If it becomes a distrinct image, update the fetcher to download it
  const page = req.body.cover;
  render_promises.push(render_page(cover_sketch, page, job_id, [width, size[1]], 'cover', size[0] + spine(no_pages)));

  Promise.all(render_promises).then(() => {
    console.log('[' + job_id + ']' + ' Cover rendering complete');
    next();
  });
}

export const spine = (count) => {
  return count / 17.49781277 // constant from the printers
}

export default render_cover;
