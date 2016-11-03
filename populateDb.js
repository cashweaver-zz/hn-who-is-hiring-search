const askController = require('./controllers/askController');
const async = require('async');
const config = require('./config');
// const Promise = require('bluebird');
const rp = require('request-promise');

const parseJSON = res => JSON.parse(res);

const askCheckingQ = async.queue((id, callback) => {
  rp(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    .then(parseJSON)
    .then((ask) => {
      if (!{}.hasOwnProperty.call(ask, 'dead')) {
        askController.createAsk(ask);
      }

      console.log(`Checked Ask ${id} (${askCheckingQ.length()} left)`);
      callback();
    })
    .catch((err) => {
      callback(err);
    });
}, config.asyncWorkers.askCheckingQ);

askCheckingQ.drain = () => {
  console.log('Checked all Asks.');
};

rp('https://hacker-news.firebaseio.com/v0/user/whoishiring.json')
  .then(parseJSON)
  .then(({ submitted }) => {
    // Only work with a few submissions while we're developing.
    const askIds = submitted.slice(0, 20);
    // const askIds = submitted;

    console.log(`Processing ${askIds.length} Asks`);
    askIds.forEach(id => askCheckingQ.push(id, () => {}));
  })
  .catch(err => console.error(err));












  /*
rp('https://hacker-news.firebaseio.com/v0/user/whoishiring.json')
  .then(parseJSON)
  .then(({ submitted }) => {
    // Only work with a few submissions while we're developing.
    const askIds = submitted.slice(0, 20);
    // Asks which aren't `dead`
    const liveAsks = [];

    let asksAdded = 0;
    let asksChecked = 0;

    console.log(`Checking ${askIds.length} Asks.`);


    return new Promise((resolve, reject) => {
      askIds.forEach((id) => {

        rp(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          .then(parseJSON)
          .then((ask) => {
            asksChecked += 1;

            if (!{}.hasOwnProperty.call(ask, 'dead')) {
              liveAsks.push(ask);
            }

            if (asksChecked === askIds.length) {
              resolve(liveAsks);
            }
          })
          .catch((err) => {
            asksChecked += 1;
            reject(err);
          });

      });
    });
  })
  .then((liveAsks) => {
    console.log(`Adding ${liveAsks.length} live Asks.`);

    let asksCreated = 0;

    return new Promise((resolve, reject) => {
      liveAsks.forEach((ask) => {
        askController.createAsk(ask)
          .then(() => {
            asksCreated += 1;
            if (asksCreated === liveAsks.length) {
              resolve();
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  })
  .then(() => {
    console.log('Done.');
  })
  .catch(err => console.error(err));
  */
