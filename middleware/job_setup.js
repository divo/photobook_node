import fs from 'fs';
import { cleanup_files } from './cleanup.js';

const setup_dir = function(req, res, next) {
  const job_id = req.body.job_id;
  if (fs.existsSync('./tmp/images/' + job_id)) {
    cleanup_files(job_id);
  }

  fs.mkdirSync('./tmp/images/' + job_id);
  fs.mkdirSync('./tmp/output/' + job_id);
  fs.mkdirSync('./tmp/pdf/' + job_id);
  next();
}

export default setup_dir;
