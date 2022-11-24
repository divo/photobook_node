const download = (req, res) => {
  const fileName = req.file.originalname;  // define uploads folder path
  const directoryPath = __basedir + "/output/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "There was an issue in downloading the file. " + err,
      });
    }
  });
};

export default download;

