// const moment = require('moment');
const Promise = require('bluebird');
const commentController = require('./controllers/commentController');
const config = require('./../config');

const logQueryConfiguration = () => (
  new Promise((resolve) => {
    commentController.getCommentCount()
      .then((count) => {
        console.log(`Querying ${count} Comments:`);
        Object.getOwnPropertyNames(config.query).forEach((key) => {
          console.log(`  ${key}: ${config.query[key]}`);
        });
        console.log('');
        resolve();
      });
  })
);

logQueryConfiguration()
  .then(() => commentController.regexQuery(config.query))
  .then(({ results, metadata }) => {
    console.log(`Found ${metadata.rowCount} Comments`);

    const commentIds = results.map(result => result.id);
    const commentUrls = commentIds.map(id => `https://news.ycombinator.com/item?id=${id}`);

    commentUrls.forEach((url) => {
      console.log(url);
    });
  });
