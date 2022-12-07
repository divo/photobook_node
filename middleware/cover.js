import render_page from '../lib/render_setup.js';

const sketch = ({width, height, canvas, data}) => {
  return ({ context, width, height, data, canvas }) => {
    let scale;
    let y = 0;
    let x = 0;

    const img = data['img'];
    const name = data['name'];
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

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
  const job_id = req.body.job_id;

  // This works because the cover is already part of the album
  // If it becomes a distrinct image, update the fetcher to download it
  const page = req.body.cover;
  render_promises.push(render_page(sketch, page, job_id, 'cover'));

  Promise.all(render_promises).then(() => {
    console.log('[' + job_id + ']' + ' Cover rendering complete');
    next();
  });
}

export default render_cover;
