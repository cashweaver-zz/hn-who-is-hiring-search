const Ask = require('../db/').models.Ask;

const createAsk = (ask) => {
  Ask.create(ask)
    .then((askRecord) => {
      console.log(askRecord);
    })
    .catch((err) => {
      console.error(err);
    });
};

module.exports = {
  createAsk,
};
