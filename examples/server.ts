import express from 'express';
const server = express();
const port = 8081;

import getServerSideHtml from './index.html';

const indexPageHtml = getServerSideHtml('1.0');

server.get('/', (req, res) => {
  res.send(indexPageHtml);
});

server.listen(port, () => {
  console.log(`View the examples at http://localhost:${port}`);
});
