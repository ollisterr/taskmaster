import fs from 'fs';

import { FILES_PATH } from './config';

export const initFileSystem = () => {
  // create audio folder if needed
  if (!fs.existsSync(`${FILES_PATH}/audio`)) {
    fs.mkdirSync(`${FILES_PATH}/audio`);
  }

  // clean old files on server startup
  console.log('Cleaning old files in', `${FILES_PATH}/audio`);
  fs.readdir(`${FILES_PATH}/audio`, (err, files) => {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }

    files.forEach(async (file) => {
      await fs.unlink(
        `${FILES_PATH}/audio/${file}`,
        (err) => err && console.log('Error deleting file:', err),
      );
    });
  });
};
