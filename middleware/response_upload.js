const response_upload = (req, res, next) => {
  const job_id = req.body.job_id;
  const album_id = req.body.photo_album;

  const opts = {
    root: global.__basedir + '/tmp/pdf/' + job_id
  };

  const file_name = album_id + '_' + job_id + '.pdf_scaled.pdf';
  res.sendFile(file_name, opts, (err) => {
    if (err) {
      console.log(err);
      res.status(err.status);
      next(err);
    }
    else {
      console.log('Sent:', file_name);
      res.status(200);
      next();
    }
  });
}

export default response_upload;
