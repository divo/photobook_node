var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

const fileUpload = require('./middleware/upload')
const upload_controller = require('./controllers/upload_controller')

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

var app = express();

const loadImage = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new Canvas.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};

//app.post('/api/render', upload_controller.upload);
app.post('/api/render', fileUpload.single('image'), upload_controller);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

global.__basedir = __dirname;

module.exports = app;
