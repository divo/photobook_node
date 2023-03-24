import render_page from '../lib/render_setup.js';
import { createCanvas } from 'canvas';
import { photo_sketch, section_sketch } from '@divo/photobook-sketches';
import { collect_promises, await_promises } from '../lib/promise_batching.js';
import { promisify } from "util";

var job_id = null;
var size = null; // ugh
const slice_size = 5;

const photos = async (req, res, next) => {
  job_id = req.body.job_id;
  size = req.body.size;

  const pages = req.body.pages;

  const promises = collect_promises(pages, 0, slice_size, render);
  await_promises(promises, pages, 0, slice_size, render, function() {
    console.log('[' + job_id + ']' + ' Rendering complete');
    size = null
    job_id = null
    next();
  });
}

const render = function(page) {
  if (page.page_class == 'section-page') {
    return render_page(section_sketch, page, job_id, size)
  } else if (page.page_class = 'photo-content') {
    return render_page(photo_sketch, page, job_id, size)
  } else {
    console.log("Unknown page type, skipping rendering!\n" + page)
    return null;
  }
}

export default photos;
