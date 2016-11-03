const askCheckingQ = require('./queues').askCheckingQ;
const rp = require('request-promise');
const sequelize = require('./db').sequelize;
const parseJSON = require('./requestHelpers').parseJSON;

sequelize.sync({ force: true })
  .then(() => {
    rp('https://hacker-news.firebaseio.com/v0/user/whoishiring.json')
      .then(parseJSON)
      .then(({ submitted }) => {
        // Only work with a few submissions while we're developing.
        const askIds = submitted.slice(0, 30);

        console.log(`Processing ${askIds.length} Asks`);
        askIds.forEach(id => askCheckingQ.push(id, () => {}));
      })
      .catch(err => console.error(err));
  });
