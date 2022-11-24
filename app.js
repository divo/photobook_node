let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');

const uploadFile = require('./middleware/upload')
const upload_controller = require('./controllers/upload_controller')
const download_controller = require('./controllers/download_controller')
const sketch = require('./middleware/sketch')
const render_controller = require('./controllers/render_controller') // There must be a native way to autoload these
const fetch_images = require('./middleware/fetch_images')

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

module.exports = app;
