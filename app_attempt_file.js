var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// create an error with .status. we
// can then use the property in our
// custom error handler (Connect respects this prop as well)
function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

const uploadFile = require("./middleware/upload");
const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      debugger;
      return res.status(400).send({ message: "Upload a file please!" });
    }
    debugger;
    res.status(200).send({
      message: "The following file was uploaded successfully: " + req.file.originalname,
    });
  } catch (err) { // error handling
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File larger than 2MB cannot be uploaded!",
      });
    }

    res.status(500).send({
      message: `Unable to upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

module.exports = upload;

// TODO: Middleware for basic auth

// app.post('/api/render', function(req, res, next){
//   console.log(req);
//   debugger;
// });

app.post('/api/render', upload);

app.get('/api/ping', function(req, res, next){
  console.log('[pong]');
  res.send('pong');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// create REST apiconst app = express();
global.__basedir = __dirname;
var corsOptions = {
  origin: "http://localhost:3000"
};
app.use(cors(corsOptions));

module.exports = app;
