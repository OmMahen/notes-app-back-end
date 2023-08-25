/* eslint-disable max-len */
const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/upload/images',
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
      },
    },
  },
  {
    method: 'GET',
    path: '/upload/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file'),
      },
    },
  },
  {
    method: 'GET',
    path: '/',
    handler: {
      file: path.resolve(__dirname, 'index.html'),
    },
  },
];

/*
    allow: 'multipart/form-data': This specifies that the server will accept multipart/form-data content type, which is commonly used for sending file uploads.
    multipart: true: Indicates that the payload will be multipart/form-data, which is used for sending binary files like images.
    output: 'stream': Specifies that the uploaded data should be treated as a stream, which can be beneficial for handling large files without loading the entire content into memory.
*/

module.exports = routes;
