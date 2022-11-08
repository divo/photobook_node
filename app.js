var express = require('express');
const multer  = require('multer')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

const canvasSketch = require('canvas-sketch');
const Canvas = require('canvas');
var fs = require('fs');

const canvas = Canvas.createCanvas();

const settings = {
  canvas,
  dimensions: [ 600, 1080 ],
};

const sketch = (img) => {
  return ({ context, width, height }) => {
    context.fillStyle = 'blue';
    context.fillRect(0, 0, width, height);
    context.drawImage(img, 0, 0);
  };
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    console.log(file.originalname);
    cb(null, file.originalname);
    //TODO: Use content type to determine extension and do something like below
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
  }
})

const up = multer({ storage: storage })

var app = express();

// TODO: Move to controller
const uploadFile = require('./middleware/upload.js')
const upload = async (req, res) => {
  if (req.file == undefined) {
    console.log('[400]');
    return res.status(400).send();
  }

  console.log('[200]');
  // TODO: This seems pretty dumb, I should use a memory store.
  const img = await loadImage(req.file.path);

  debugger;
  canvasSketch(sketch(img), settings)
    .then(() => {
      // Once sketch is loaded & rendered, stream a PNG with node-canvas
      const out = fs.createWriteStream('output.png');
      const stream = canvas.createPNGStream();
      stream.pipe(out);
      out.on('finish', () => console.log('Done rendering'));
    });

  res.status(200).send();
}

const loadImage = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new Canvas.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};

//</controller>

app.post('/api/render', up.single('image'), upload)


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
