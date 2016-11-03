const async = require('async');
const rp = require('request-promise');
const askCreationQ = require('./askCreationQ');
const colors = require('./../colors');
const config = require('./../../config');
const parseJSON = require('./../requestHelpers').parseJSON;

const askCheckingQ = async.queue((id, callback) => {
  rp(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    .then(parseJSON)
    .then((ask) => {
      const aproxQLength = askCheckingQ.length() + config.asyncWorkers.askCheckingQ;
      console.log(colors.verbose(`Ask | Checked ${id} (<${aproxQLength} left)`));

      if (!{}.hasOwnProperty.call(ask, 'dead')) {
        askCreationQ.push(ask, () => {});
      }

      return callback();
    })
    .catch((err) => {
      callback(err);
    });
}, config.asyncWorkers.askCheckingQ);

module.exports = askCheckingQ;
