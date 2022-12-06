import render_page from '../lib/render_setup.js';

const sketch = ({width, height, canvas, data}) => {
  return ({ context, width, height, data, canvas }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
 };
};

const render_inside_cover = async (req, res, next) => {
  // We only need an empty inside cover for magazines
  if (!req.body.magazine) {
    next();
  }

  const render_promises = [];
  const job_id = req.body.job_id;

  // This works because the cover is already part of the album
  // If it becomes a distrinct image, update the fetcher to download it
  const page = req.body.cover;
  render_promises.push(render_page(sketch, page, job_id, 'inside_cover'));

  Promise.all(render_promises).then(() => {
    console.log('[' + job_id + ']' + ' Inside cover rendering complete');
    next();
  });
};

export default render_inside_cover;
