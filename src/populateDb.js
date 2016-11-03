const askController = require('./controllers/askController');
const async = require('async');
const config = require('./config');
// const Promise = require('bluebird');
const rp = require('request-promise');
const sequelize = require('./db').sequelize;

const parseJSON = res => JSON.parse(res);

const askCheckingQ = async.queue((id, callback) => {
  rp(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    .then(parseJSON)
    .then((ask) => {
      const aproxQLength = askCheckingQ.length() + config.asyncWorkers.askCheckingQ;
      console.log(`Checked Ask ${id} (<${aproxQLength} left)`);

      if ({}.hasOwnProperty.call(ask, 'dead')) {
        return callback();
      }

      return askController.createAsk(ask);
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
}, config.asyncWorkers.askCheckingQ);

askCheckingQ.drain = () => {
  console.log('Checked all Asks.');
};

sequelize.sync({ force: true })
  .then(() => {
    rp('https://hacker-news.firebaseio.com/v0/user/whoishiring.json')
      .then(parseJSON)
      .then(({ submitted }) => {
        // Only work with a few submissions while we're developing.
        const askIds = submitted.slice(0, 30);
        // const askIds = submitted;

        console.log(`Processing ${askIds.length} Asks`);
        askIds.forEach(id => askCheckingQ.push(id, () => {}));
      })
      .catch(err => console.error(err));
  });
