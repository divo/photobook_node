import render_page from '../lib/render_setup.js';
import { cover_sketch } from '@divo/photobook-sketches'
import { loadImage } from 'canvas';

const is_landscape = (image) => {
  return image.width > image.height;
};

const render_cover = async (req, res, next) => {
  const render_promises = [];
  const job_id = req.body.job_id;
  const size = req.body.size;
  const spine_width = req.body.spine_width;

  const width = cover_width(size, spine_width);

  // This works because the cover is already part of the album
  // If it becomes a distrinct image, update the fetcher to download it
  const page = req.body.cover;
  
  // TODO: Not bothered sending this from rails, if I need to update it maybe do that
  // Loading it here to avoid loading it for every page
  let logo_img = await loadImage(global.__basedir + '/assets/images/back_logo.png');

  render_promises.push(render_page(cover_sketch, page, job_id, [width, size[1]], 'cover', 
    (size[0] - 3) + spine_width, logo_img));

  Promise.all(render_promises).then(() => {
    console.log('[' + job_id + ']' + ' Cover rendering complete');
    next();
  });
}

export const cover_width = (size, spine_width) => {
  // -3 to account for bleed, hacking it in
  return ((size[0] - 3) * 2) + spine_width;
}

export default render_cover;
