import fs from 'fs';
import { got } from 'got';
import stream from 'stream';
import extension from '../lib/file_util.js'
import { promisify } from "util";
import { collect_promises, await_promises } from '../lib/promise_batching.js';

const slice_size = 15;
var job_id = null;

// The idea is for this thing to kick off a load of fetch jobs
// TODO: Handle failure and retry
const fetch_images = async(req, res, next) => {
  job_id = req.body.job_id;
  const pages = req.body.pages;

  const fetch_promises = collect_promises(pages, 0, slice_size, fetch_image);
  await_promises(fetch_promises, pages, 0, slice_size, fetch_image, function() {
    console.log('[' + job_id + ']' + ' All images downloaded')
    job_id = null; // Not sure if this is necessary
    next()
  })
}

const fetch_image = function(page) {
  const pipeline = promisify(stream.pipeline);
  const image_url = page.image_url;
  const key = page.key;
  const ext = extension(page.content_type);
  console.log('[' + job_id + ']' + ' Fetching: ' + image_url);
  const download_stream = got.stream(image_url);
  const writer = fs.createWriteStream('./tmp/images/' + job_id + '/' + key + ext);
  const download_promise = pipeline(download_stream, writer);
  return download_promise;
};

export default fetch_images;
