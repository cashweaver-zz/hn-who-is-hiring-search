const Promise = require('bluebird');
const Comment = require('./../db').models.Comment;
const sequelize = require('./../db').sequelize;

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
      const relatedComment = comment;
      relatedComment.ask_id = relatedComment.parent;
      return Comment.create(relatedComment);
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

const regexQuery = ({
  regex,
  oldestComment,
  includeWhoIsHiring,
  includeFreelancerSeekingFreelancer,
  includeWhoWantsToBeHired,
}) => (
  new Promise((resolve) => {
    let sql = `
      SELECT comments.id
      FROM comments
      JOIN asks
        ON comments.ask_id = asks.id
      WHERE
        (
          comments.text ~ \'${regex}\'
          AND comments.time > ${oldestComment}
        )
    `;

    if (!includeWhoIsHiring || !includeFreelancerSeekingFreelancer || !includeWhoWantsToBeHired) {
      sql += 'AND (';
      const titleRestrictions = [];
      if (!includeWhoIsHiring) {
        titleRestrictions.push('asks.title NOT ILIKE \'%hiring%\'');
      }
      if (!includeFreelancerSeekingFreelancer) {
        titleRestrictions.push('asks.title NOT ILIKE \'%freelancer%\'');
      }
      if (!includeWhoWantsToBeHired) {
        titleRestrictions.push('asks.title NOT ILIKE \'%hired%\'');
      }

      sql += titleRestrictions.join(' AND ');
      sql += ')';
    }

    console.log(sql);
    sequelize
      .query(sql)
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
