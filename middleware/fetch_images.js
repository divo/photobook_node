import fs from 'fs';
import { got } from 'got';

// The idea is for this thing to kick off a load of fetch jobs
const fetch_images = async(req, res, next) => {
  debugger;
  req.body.pages.forEach(function(page){
    console.log(page);
    const image_url = page.image_url;
    got.stream(image_url).pipe(fs.createWriteStream('./tmp/images/image.png'));
  });
};

export default fetch_images;
