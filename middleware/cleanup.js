import fs from 'fs';

const cleanup = function(req, res, next) {
  const job_id = req.body.job_id;
  if (!fs.existsSync('./tmp/images/' + job_id)) {
    throw new Error('Invalid job id');
  }

  cleanup_files(job_id);

 console.log('File cleanup complete');
  next();
}

export const cleanup_files = function(job_id) {
  fs.rmSync('./tmp/images/' + job_id, { recursive: true, force: true });
  fs.rmSync('./tmp/output/' + job_id, { recursive: true, force: true });
  fs.rmSync('./tmp/pdf/' + job_id, { recursive: true, force: true });
}

export default cleanup;
