const rp = require('request-promise');
const colors = require('./colors');
const askCheckingQ = require('./queues').askCheckingQ;
const sequelize = require('./db').sequelize;
const parseJSON = require('./requestHelpers').parseJSON;

const forceTableDropAndCreate = (process.env.NODE_ENV === 'development');
sequelize.sync({ force: forceTableDropAndCreate })
  .then(() => {
    rp('https://hacker-news.firebaseio.com/v0/user/whoishiring.json')
      .then(parseJSON)
      .then(({ submitted }) => {
        // Only work with a few submissions while we're developing.
        const askIds = (process.env.NODE_ENV === 'development') ? submitted.slice(0, 20) : submitted;

        console.log(colors.verbose(`Processing ${askIds.length} Asks`));
        // askIds.forEach(id => askCheckingQ.push(id, () => {}));
        askCheckingQ.push(askIds, () => {});
      })
      .catch(err => console.error(err));
  });
