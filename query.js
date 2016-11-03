const commentController = require('./controllers/commentController');
const config = require('./config');

const logQueryConfiguration = () => {
  commentController.getCommentCount()
    .then((count) => {
      console.log(`Querying ${count} Comments:`);
      Object.getOwnPropertyNames(config.query).forEach((key) => {
        console.log(`  ${key}: ${config.query[key]}`);
      });
      console.log('');
    });
};

logQueryConfiguration();

commentController.regexQuery(config.query)
  .then((results) => {
    console.log(results);
  });
