let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');

const fileUpload = require('./middleware/upload')
const upload_controller = require('./controllers/upload_controller')
const sketch = require('./middleware/sketch')

let app = express();

app.post('/api/render', fileUpload.single('image'), upload_controller, sketch);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

global.__basedir = __dirname;

module.exports = app;
