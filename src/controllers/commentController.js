const Comment = require('../db/').models.Comment;
const Promise = require('bluebird');
const sequelize = require('../db/').sequelize;

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

const getCommentCount = () => Comment.count();

const regexQuery = ({ regex, oldestComment }) => (
  new Promise((resolve) => {
    sequelize
      .query(`
        SELECT id
        FROM comments
        WHERE text ~ \'${regex}\'
          AND time > ${oldestComment}
      `)
      .spread((results, metadata) => {
        resolve({ results, metadata });
      });
  })
);

module.exports = {
  createComment,
  getCommentCount,
  regexQuery,
};
