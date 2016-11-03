const async = require('async');
const Ask = require('./../db').models.Ask;
const askController = require('./../controllers/askController');
const colors = require('./../colors');
const commentCreationQ = require('./commentCreationQ');
const config = require('./../../config');

const askCreationQ = async.queue((ask, callback) => {
  askController.findById(ask.id)
    .then((foundAskRecord) => {
      if (foundAskRecord) {
        return callback();
      }
      return Ask.create(ask);
    })
    .then(() => {
      const aproxQLength = askCreationQ.length() + config.asyncWorkers.askCreationQ;
      console.log(colors.verbose(`Ask | Saved ${ask.id} (<${aproxQLength} left)`));
      commentCreationQ.push(ask.kids, () => {});
      callback();
    })
    .catch((err) => {
      callback(err);
    });
}, config.asyncWorkers.askCreationQ);

module.exports = askCreationQ;
