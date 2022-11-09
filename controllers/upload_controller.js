const fileUpload = require('../middleware/upload')

const upload = function (req, res, next) {
  if (req.file == undefined) {
    console.log('[400]');
    return res.status(400).send();
  }

  next();

  console.log('[200]');
  res.status(200).send();
};

module.exports = upload;
