import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import util from 'util';
import child_process from 'child_process';
import { spine } from './cover.js';

const exec = util.promisify(child_process.exec);

const merge_pdf = async (req, res, next) => {
  const pdfsToMerge = [];
  const job_id = req.body.job_id;
  const size = req.body.size;

  // Add the cover
  const coverBuffer = fs.readFileSync('./tmp/output/' + job_id + '/cover.pdf');
  pdfsToMerge.push(coverBuffer);

  const blankPageBuffer = fs.readFileSync('./tmp/output/' + job_id + '/inside_cover.pdf');
  if (req.body.magazine) { // Requirement from Printers
    pdfsToMerge.push(blankPageBuffer);
  }

  // Add all the pages
  // TODO: Just use the directory contents? Will probably mess up the ordering
  req.body.pages.forEach(async (page) => {
    // Section pages need to be on an odd page number with a blank left hand page 
    if (page.page_class == 'section-page') {
      if (!(pdfsToMerge.length % 2)) {
        pdfsToMerge.push(blankPageBuffer);
      }
      pdfsToMerge.push(blankPageBuffer);
    }

    const key = page.key;
    const pdfBuffer = fs.readFileSync('./tmp/output/' + job_id + '/' + key + '.pdf');
    pdfsToMerge.push(pdfBuffer);
  });

  // Use the blank inside at the end of the pdf
  // If even no. of pages add three blanks
  // if odd no of pages add two blank
  // This requirement is from the Printer
  if (pdfsToMerge.length % 2) {
    pdfsToMerge.push(blankPageBuffer);
  }
  pdfsToMerge.push(blankPageBuffer);

  const album_id = req.body.photo_album;

  const cover = pdfsToMerge.shift(); // I know I already have coverBuffer but I need to split the array anyway
  const cover_path = build_path(job_id, album_id + '_cover');

  // Build and scale the cover
  await build_pdf(cover_path, [cover]);
  const no_pages = req.body.pages.length;
  const cover_width = (size[0] * 2) + spine(no_pages);
  await scale_pdf(cover_path, [cover_width, size[1]]);

  // Build and scale the content
  const album_path = build_path(job_id, album_id);
  await build_pdf(album_path, pdfsToMerge);
  await scale_pdf(album_path, size)

  console.log('[' + job_id + ']' + ' Wrote pdf: ' + album_id + ' successfully');
  console.log('Scaling complete. Finished processing document');
  next();
};

const build_pdf = async (path, buffer) => {
  const mergedPdf = await PDFDocument.create();
  for (const pdfBytes of buffer) {
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  const buf = await mergedPdf.save();
  fs.open(path, 'w', function (err, fd) {
    fs.write(fd, buf, 0, buf.length, null, function (err) {
      fs.closeSync(fd); // lol async
    });
  });
}

const build_path = (job_id, album_id) => {
  return './tmp/pdf/' + job_id + '/' + album_id + '_' + job_id + '.pdf';
}

const scale_pdf = async (filename, size) => {
  const width = Math.round((size[0] * 72) / 25.4);
  const height = Math.round((size[1] * 72) / 25.4);
  const gs_command = `gs -o ${filename}_scaled.pdf -sDEVICE=pdfwrite -dDEVICEWIDTHPOINTS=${width} -dDEVICEHEIGHTPOINTS=${height} -dFIXEDMEDIA -dPDFFitPage -dCompatibilityLevel=1.4 ${filename}`

  try {
    const { stdout, stderr } = await exec(gs_command);
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
  }
}

export default merge_pdf;
