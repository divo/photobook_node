import fileUpload from '../middleware/upload.js'

// TODO: I'm not sure how Express is able to mix async and sync
// functions together in the middleware chain like this
const upload = function (req, res, next) {
  if (req.file == undefined) {
    console.log('[400]');
    return res.status(400).send();
  }
  next();
};

export default upload;
