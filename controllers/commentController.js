const Comment = require('../db/').models.Comment;
const Promise = require('bluebird');

const createComment = comment => (
  new Promise((resolve, reject) => {
    Comment.find({
      where: {
        id: comment.id,
      },
    })
    .then((foundCommentRecord) => {
      if (foundCommentRecord) {
        return resolve(foundCommentRecord);
      }
      return Comment.create(comment);
    })
    .then((createdCommentRecord) => {
      resolve(createdCommentRecord);
    })
    .catch((err) => {
      reject(err);
    });
  })
);

module.exports = {
  createComment,
};
