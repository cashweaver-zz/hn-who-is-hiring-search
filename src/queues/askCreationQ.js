const async = require('async');
const Ask = require('./../db').models.Ask;
const colors = require('./../colors');
const commentCreationQ = require('./commentCreationQ');
const config = require('./../../config');

const askCreationQ = async.queue((ask, callback) => {
  Ask.findOrCreate({
    where: {
      id: ask.id,
    },
    defaults: ask,
  })
  .then(() => {
    const aproxQLength = askCreationQ.length() + config.asyncWorkers.askCreationQ;
    console.log(colors.verbose(`Ask | Processed ${ask.id} (<${aproxQLength} left)`));
    commentCreationQ.push(ask.kids, () => {});
    callback();
  })
  .catch((err) => {
    callback(err);
  });
}, config.asyncWorkers.askCreationQ);

module.exports = askCreationQ;
