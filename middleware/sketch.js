import render_page from '../lib/render_setup.js';

const sketch = ({width, height, canvas, data}) => {
  return ({ context, width, height, data, canvas }) => {
    const safe_area = 15; // mm!

    let scale;
    let y = 0;
    let x = 0;

    const img = data['img'];
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    if (is_landscape(img)) {
      scale = width / img.width;
      y = (height - (img.height * scale)) / 2;
    } else {
      scale = height / img.height;
      x = (width - (img.width * scale)) / 2;
    }

    context.drawImage(img, safe_area + x, safe_area + y, (img.width * scale) - (safe_area * 2), (img.height * scale) - (safe_area * 2));
  };
};

const is_landscape = (image) => {
  return image.width > image.height;
};

const render_sketch = async (req, res, next) => {
  const render_promises = [];
  const job_id = req.body.job_id;

  req.body.pages.forEach(async (page) => {
    render_promises.push(render_page(sketch, page, job_id));
  });

  Promise.all(render_promises).then(() => {
    console.log('[' + job_id + ']' + ' Rendering complete');
    next();
  });
}

export default render_sketch;
