import fs from 'fs';
import { got } from 'got';
import stream from 'stream';
import extension from '../lib/file_util.js'
import { promisify } from "util";

Array.prototype.each_slice = function (size, callback){
  for (var i = 0, l = this.length; i < l; i += size){
    callback.call(this, this.slice(i, i + size));
  }
};

const slice_size = 15;

// The idea is for this thing to kick off a load of fetch jobs
const fetch_images = async(req, res, next) => {
  const job_id = req.body.job_id;
  const pages = req.body.pages;
  const no_pages = pages.length;

  const fetch_promises = collect_promises(pages, job_id, 0, no_pages);
  await_promises(fetch_promises, pages, job_id, 0, no_pages, function() {
    next();
  });
};

const collect_promises = function(pages, job_id, offset, size) {
  return fetch_slice(job_id, pages.slice(offset, offset + slice_size))
}

// This is pretty fucking horrible, the worst code I've written in a long time
const await_promises = function(promises, pages, job_id, offset, size, succ_callback) {
  Promise.all(promises).then(() => {
    if (offset < size) {
      console.log('More to fetch');
      const promises = collect_promises(pages, job_id, offset, size);
      await_promises(promises, pages, job_id, offset + slice_size, size, succ_callback);
    } else {
      console.log('[' + job_id + ']' + ' All images downloaded');
      succ_callback();
    }
  });
};

const fetch_slice = function(job_id, slice) {
  const fetch_promises = [];
  slice.forEach(function(page) {
    fetch_promises.push(fetch_image(page, job_id));
  });

  return fetch_promises;
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
};

export default fetch_images;
