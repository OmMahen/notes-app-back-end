/* eslint-disable no-underscore-dangle */
const fs = require('fs');

class StorageService {
  constructor(folder) {
    this._folder = folder;
    // checks whether a folder with the specified path (folder) exists.
    if (!fs.existsSync(folder)) {
      // creates the folder specified by the folder path.
      fs.mkdirSync(folder, { recursive: true });
      // recursive: ensures that any missing parent directories in the path are also created
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const path = `${this._folder}/${filename}`;

    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream); // proses penulisan berkas
      file.on('end', () => resolve(filename));
    });
  }
}

module.exports = StorageService;
