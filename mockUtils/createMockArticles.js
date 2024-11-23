// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createMockArticle } = require('./createMockArticle.js');

fs.writeFile('./public/mock.json', JSON.stringify(
  Array.from(Array(20).keys())
    .map((id) => createMockArticle(id))
  ),
  (err) => {
  if (err) throw err;
});
