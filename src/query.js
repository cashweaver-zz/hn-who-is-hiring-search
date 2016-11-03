const Promise = require('bluebird');
const math = require('mathjs');
const util = require('util');
const colors = require('./colors');
const commentController = require('./controllers/commentController');
const config = require('./../config');

let commentCount;

const logQueryConfiguration = () => (
  new Promise((resolve) => {
    commentController.getCommentCount()
      .then((count) => {
        commentCount = count;
        console.log(colors.verbose(`Querying ${count} Comments`));
        console.log('');
        console.log(colors.verbose(`config: ${util.inspect(config.query)}`));
        console.log('');
        console.log('');
        resolve();
      });
  })
);

logQueryConfiguration()
  .then(() => commentController.regexQuery(config.query))
  .then(({ results, metadata }) => {
    const percentOfAllComments = math.round(metadata.rowCount / commentCount, 3);
    console.log(colors.success(`Found ${metadata.rowCount} Comments (${percentOfAllComments}% of all Comments)`));

    const commentIds = results.map(result => result.id);
    const commentUrls = commentIds.map(id => `https://news.ycombinator.com/item?id=${id}`);

    commentUrls.forEach((url) => {
      console.log(url);
    });
  });
