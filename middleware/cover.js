import render_page from '../lib/render_setup.js';
import { cover_sketch } from 'sketches'

const is_landscape = (image) => {
  return image.width > image.height;
};

const render_cover = async (req, res, next) => {
  const render_promises = [];
  const job_id = req.body.job_id;
  const size = req.body.size;

  // This works because the cover is already part of the album
  // If it becomes a distrinct image, update the fetcher to download it
  const page = req.body.cover;
  render_promises.push(render_page(cover_sketch, page, job_id, size, 'cover'));

  Promise.all(render_promises).then(() => {
    console.log('[' + job_id + ']' + ' Cover rendering complete');
    next();
  });
}

export default render_cover;
