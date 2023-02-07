import fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import child_process from 'child_process';

const merge_pdf = async (req, res, next) => {
  const pdfsToMerge = [];
  const mergedPdf = await PDFDocument.create();
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
  pdfsToMerge.push(blankPageBuffer);

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
        console.log('Scaling PDF');
        scale_pdf(path, size)
        console.log('Scaling complete. Finished processing document');
        next();
      });
    });
  });
};

const scale_pdf = (filename, size) => {
  // NOW: Scale this too
  const width = Math.round((size[0] * 72) / 25.4);
  const height = Math.round((size[1] * 72) / 25.4);
  const gs_command = `gs -o ${filename}_scaled.pdf -sDEVICE=pdfwrite -dDEVICEWIDTHPOINTS=${width} -dDEVICEHEIGHTPOINTS=${height} -dFIXEDMEDIA -dPDFFitPage -dCompatibilityLevel=1.4 ${filename}`

  child_process.execSync(gs_command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

export default merge_pdf;
