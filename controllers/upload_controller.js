const fileUpload = require('../middleware/upload')

const upload = async (req, res) => {
  if (req.file == undefined) {
    console.log('[400]');
    return res.status(400).send();
  }

  console.log('[200]');
  // TODO: This seems pretty dumb, I should use a memory store.
//  const img = await loadImage(req.file.path);

//  canvasSketch(sketch(img), settings)
//    .then(() => {
//      // Once sketch is loaded & rendered, stream a PNG with node-canvas
//      const out = fs.createWriteStream('output.png');
//      const stream = canvas.createPNGStream();
//      stream.pipe(out);
//      out.on('finish', () => console.log('Done rendering'));
//    });

  res.status(200).send();
};

module.exports = upload;
