import fs from 'fs';
import { got } from 'got';

// The idea is for this thing to kick off a load of fetch jobs
const fetch_images = async(req, res, next) => {
  req.body.pages.forEach(function(page){
    const image_url = page.image_url;
    const key = page.key;
    const ext = extension(page.content_type);
    console.log('Fatching: ' + image_url);
    got.stream(image_url).pipe(fs.createWriteStream('./tmp/images/' + key + ext));
  });
};

const extension = (content_type) => {
  // TODO: Add support for HEIC etc
  switch (content_type) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    default:
      return '';
  }
};

export default fetch_images;
