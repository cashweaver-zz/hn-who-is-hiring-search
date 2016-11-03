const fs = require('fs');
const math = require('mathjs');
const path = require('path');
const Promise = require('bluebird');
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

    const decending = ((a, b) => {
      if (a > b) return -1;
      else if (a < b) return 1;
      else return 0;
    });

    const commentUrls = results
      .map(result => Number.parseInt(result.id, 10))
      .sort(decending)
      .map(id => `https://news.ycombinator.com/item?id=${id}`);

    const resultsPath = path.resolve(`./${config.query.resultsName}`);
    fs.writeFileSync(
      resultsPath,
      commentUrls.join('\n'),
      {
        flag: 'w',
      }
    );
    console.log(colors.verbose(`Results written to ${resultsPath}`));
  });
