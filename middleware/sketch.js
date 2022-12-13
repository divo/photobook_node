import render_page from '../lib/render_setup.js';
import { createCanvas } from 'canvas';

const sketch = async ({width, height, canvas, data}) => {
  // const safe_area = 15; // mm!
  let safe_area = 25; // mm!
  const fontSize = 4;
  let scaledFontSize = fontSize;
  const textSafeArea = 10;
  const img = data['img'];
  const address = data['address'];

  let pos = {};

  do {
    pos = calculatePositions(safe_area, img, width, height);
    scaledFontSize = fontSize * pos.scale;
    safe_area = safe_area + 5;
  } while (address != '' && isTextCropped(pos.y, pos.s_height, textSafeArea, fontSize, height))

  return ({ context, width, height, data, canvas }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.drawImage(img, pos.x, pos.y, pos.s_width, pos.s_height);
    draw_text(address, width, pos, fontSize, textSafeArea, context);
  };
};

const draw_text = (text, width, pos, fontSize, textSafeArea, context) => {
  const transform = context.getTransform();
  const x_scale = Math.ceil(transform.a);
  const y_scale = Math.ceil(transform.d);
  context.setTransform(1, 0, 0, 1, 0, 0); // There is a bug in Cairo related to rendering text in a transformed canvas
  context.font = `oblique ${fontSize * x_scale}px Helvetica`;
  context.textAlign = 'center';
  context.fillStyle = 'rgb(126, 123, 127)';
  context.textBaseline = 'middle';

  context.fillText(text, (width / 2) * x_scale, (pos.y + pos.s_height + textSafeArea) * y_scale);
}

const isTextCropped = (y, s_height, textSafeArea, scaledFontSize, height) => {
  return (y + s_height + textSafeArea + (scaledFontSize / 2)) > height - textSafeArea;
}

const calculatePositions = (safe_area, img, width, height) => {
  let result = {};

  if (is_landscape(img)) {
    result.scale = width / img.width;
    result.ratio = img.width / img.height;
    result.s_width = (img.width * result.scale) - (safe_area * 2)
    result.s_height = result.s_width / result.ratio;
    result.y = (height - result.s_height) / 2;
    result.x = safe_area;
  } else {
    result.scale = height / img.height;
    result.ratio = img.height / img.width;
    result.s_height = (img.height * result.scale) - (safe_area * 2)
    result.s_width = result.s_height / result.ratio;
    result.x = (width - result.s_width) / 2;
    result.y = safe_area;
  }

  return result;
}
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
