const Promise = require('bluebird');
const Comment = require('./../db').models.Comment;
const sequelize = require('./../db').sequelize;

const create = comment => (
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
  regexes,
  regexesAndOr,
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
          comments.time > ${oldestComment}
          AND (
    `;
    sql += regexes.map(regex => `comments.text ~ \'${regex}\'`).join(` ${regexesAndOr} `);
    sql += '))';

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

    sequelize
      .query(sql)
      .spread((results, metadata) => {
        resolve({ results, metadata });
      });
  })
);

const findById = id => (
  Comment.find({
    where: {
      id,
    },
  })
);

module.exports = {
  create,
  findById,
  getCommentCount,
  regexQuery,
};
