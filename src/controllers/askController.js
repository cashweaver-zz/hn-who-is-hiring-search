const Ask = require('./../db').models.Ask;
const askCreationQ = require('./../queues').askCreationQ;

const findById = id => (
  Ask.find({
    where: {
      id,
    },
  })
);

module.exports = {
  findById,
};
