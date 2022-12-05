import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

const merge_pdf = async (req, res, next) => {
  const pdfsToMerge = [];
  const mergedPdf = await PDFDocument.create();

  const job_id = req.body.job_id;

  // Add the cover
  const coverBuffer = fs.readFileSync('./tmp/output/' + job_id + '/cover.pdf');
  pdfsToMerge.push(coverBuffer);

  // Add all the pages
  // TODO: Just use the directory contents? Will probably mess up the ordering
  req.body.pages.forEach(async (page) => {
    const key = page.key;
    const pdfBuffer = fs.readFileSync('./tmp/output/' + job_id + '/' + key + '.pdf');
    pdfsToMerge.push(pdfBuffer);
  });

  for (const pdfBytes of pdfsToMerge) {
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  const buf = await mergedPdf.save();
  const album_id = req.body.photo_album;
  const path = './tmp/pdf/' + job_id + '/' + album_id + '_' + job_id + '.pdf';
  fs.open(path, 'w', function (err, fd) {
    fs.write(fd, buf, 0, buf.length, null, function (err) {
      fs.close(fd, function () {
        console.log('[' + job_id + ']' + ' Wrote pdf: ' + album_id + ' successfully');
        next();
      });
    });
  });
};

export default merge_pdf;
