const Ask = require('../db/').models.Ask;
const async = require('async');
const Comment = require('../db/').models.Comment;
const commentController = require('./commentController');
const config = require('../config');
const rp = require('request-promise');

const parseJSON = res => JSON.parse(res);

const commentCreationQ = async.queue((commentId, callback) => {
  Comment.find({
    where: {
      id: commentId,
    },
  })
  .then((foundCommentRecord) => {
    if (foundCommentRecord) {
      return callback();
    }
    return rp(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`);
  })
  .then(parseJSON)
  .then(comment => commentController.createComment(comment))
  .then(() => {
    console.log(`Created Comment ${commentId} (<${commentCreationQ.length() + config.asyncWorkers.commentCreationQ} left)`);
    callback();
  })
  .catch((err) => {
    callback(err);
  });
}, config.asyncWorkers.commentCreationQ);

commentCreationQ.drain = () => {
  console.log('Created all Comments');
};


const askCreationQ = async.queue((ask, callback) => {
  Ask.find({
    where: {
      id: ask.id,
    },
  })
  .then((foundAskRecord) => {
    if (foundAskRecord) {
      return callback();
    }
    return Ask.create(ask);
  })
  .then(() => {
    console.log(`Created Comment ${ask.id} (<${askCreationQ.length() + config.asyncWorkers.askCreationQ} left)`);
    commentCreationQ.push(ask.kids, () => {});
    callback();
  })
  .catch((err) => {
    callback(err);
  });
}, config.asyncWorkers.askCreationQ);

askCreationQ.drain = () => {
  console.log('Created all Asks');
};

const createAsk = (ask) => {
  askCreationQ.push(ask, () => {});
};

module.exports = {
  createAsk,
};
