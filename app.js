import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import indexRouter from './routes/index.js';

import uploadFile from './middleware/upload.js';
import upload_controller from './controllers/upload_controller.js'
import download_controller from './controllers/download_controller.js'
import sketch from './middleware/sketch.js'
import render_controller from './controllers/render_controller.js' // There must be a native way to autoload the
import fetch_images from './middleware/fetch_images.js'

let app = express();

app.get('/ping', (req, res) => {
  console.log('[pong]');
  res.send('pong');
});

//app.post('/api/render', uploadFile.single('image'), upload_controller, sketch, download_controller);

app.post('/api/render_album', render_controller, fetch_images)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

global.__basedir = __dirname;

export default app;
