/**
 * @file The development server module.
 * @module {ES6Module} server
 * @author The OpenINF Authors & Friends
 * @license MIT OR Apache-2.0 OR BlueOak-1.0.0
 * @see https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { readFile } from 'node:fs';
import { createServer as createHttpServer } from 'node:http';
import { extname as pathExtname } from 'node:path';
import scssify from '@openinf/portal/build/tasks/scssify';
import WebSocket from 'isomorphic-ws';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Returns the content type of the provided file path, which is determined by
 * file extension.
 *
 * @param {string} filePath
 * @returns {string}
 */
function getContentType(filePath) {
  const extname = String(pathExtname(filePath)).toLowerCase();
  const mimeTypes = {
    '.css': 'text/css',
    '.eot': 'application/vnd.ms-fontobject',
    '.gif': 'image/gif',
    '.html': 'text/html',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpg',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.mjs': 'application/javascript',
    '.mp4': 'video/mp4',
    '.otf': 'application/font-otf',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ttf': 'application/font-ttf',
    '.wasm': 'application/wasm',
    '.wav': 'audio/wav',
    '.woff': 'application/font-woff',
  };
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  return contentType;
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
// First we spawn a child process for http-server.
// Then, while that's running, we create a child process of the socket server.
// The socket server will remain intact until we make changes to our JS code.
// As soon as we make any changes to the socket server, it will reboot.

export default (() => {
  const httpServer = createHttpServer((request, response) => {
    console.log('request ', request.url);
    let filePath = `.${request.url}`;
    if (filePath === './') {
      filePath = './index.html';
    }
    const contentType = getContentType(filePath);
    readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          readFile('./_site/404.html', (error, content) => {
            if (error) {
              console.error(error);
            }
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end(content, 'utf-8');
          });
        } else {
          response.writeHead(500);
          response.end(
            `Sorry, check with the site admin for error: ${error.code} ..\n`
          );
        }
      } else {
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
      }
    });
  });

  const PORT = 3000;
  httpServer.listen(PORT, () => {
    console.log(`HTTP server listening on http://127.0.0.1:${PORT}.`);

    // Create WebSocket server.
    const socketServer = new WebSocket.Server({ server: httpServer });

    socketServer.on('connection', (webSocket) => {
      console.log(`WebSocket server listening on ws://127.0.0.1:${PORT}.`);

      // Connection opened.
      webSocket.onopen = () => {
        console.log('Now connected to client.');
        webSocket.send('Hello, Client!');
      };

      // Message received from client socket.
      webSocket.onmessage = (event) => {
        if (event.data !== '') {
          console.log('Received: %s', event.data); // message
        }
      };

      // Connection closed.
      webSocket.onclose = () => {
        console.log('Backend WebSocket connection closed!');
      };

      webSocket.send(scssify());
    });
  });
})();
