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

const regexQuery = ({ regex, oldestTime }) => {
  console.log(`
    SELECT id
    FROM \`comments\`
    WHERE text REGEXP \'${regex}\'
      AND time > ${oldestTime}
  `);
  return sequelize.query(`
    SELECT id
    FROM \`comments\`
    WHERE text REGEXP ${regex}
      AND time > ${oldestTime}
  `);
};

module.exports = {
  createComment,
  getCommentCount,
  regexQuery,
};
