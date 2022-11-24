const fs = require('fs');
import { got } from 'got';

// The idea is for this thing to kick off a load of fetch jobs
const fetch_images = async(req, res, next) => {
  for(key in req.query.pages) {
    const img_url = req.query.pages[key].img_url;
    debugger
    got.stream(url).pipe(fs.createWriteStream('./tmp/images/image.png'));
  };
};

module.exports = fetch_images;
