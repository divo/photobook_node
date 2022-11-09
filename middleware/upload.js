const multer = require("multer");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
    //TODO: Use content type to determine extension and do something like below
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
  },
});

let uploadFile = multer({
  storage: storage,
})

// Is this really middleware anymore or just a util file?
module.exports = uploadFile;
