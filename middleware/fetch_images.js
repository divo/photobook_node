import fs from 'fs';
import { got } from 'got';
import stream from 'stream';
import extension from '../lib/file_util.js'
import { promisify } from "util";

// The idea is for this thing to kick off a load of fetch jobs
const fetch_images = async(req, res, next) => {
  const fetch_promises = [];

  const job_id = req.body.job_id;
  req.body.pages.forEach(function(page) {
    fetch_promises.push(fetch_image(page, job_id));
  });

  Promise.all(fetch_promises).then(() => {
    console.log('[' + job_id + ']' + ' All images downloaded');
    next();
  });
};

const fetch_image = function(page, job_id) {
  const pipeline = promisify(stream.pipeline);
  const image_url = page.image_url;
  const key = page.key;
  const ext = extension(page.content_type);
  console.log('[' + job_id + ']' + ' Fetching: ' + image_url);
  const download_stream = got.stream(image_url);
  const writer = fs.createWriteStream('./tmp/images/' + job_id + '/' + key + ext);
  const download_promise = pipeline(download_stream, writer);
  return download_promise;
}

export default fetch_images;
