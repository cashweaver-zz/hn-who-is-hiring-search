const config = require('../config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  config.db.name,
  config.db.username,
  config.db.password,
  {
    host: 'localhost',
    dialect: 'sqlite',
    // eslint-disable-next-line
    logging: (process.env.NODE_ENV === 'test') ? false : console.log,
    storage: config.db.path,
  },
);

const Ask = sequelize.define('ask', {
  by: {
    type: Sequelize.STRING,
  },
  descendants: {
    type: Sequelize.INTEGER,
  },
  id: {
    type: Sequelize.INTEGER,
  },
  score: {
    type: Sequelize.INTEGER,
  },
  text: {
    type: Sequelize.STRING,
  },
  time: {
    type: Sequelize.INTEGER,
  },
  title: {
    type: Sequelize.STRING,
  },
  type: {
    type: Sequelize.STRING,
  },
  url: {
    type: Sequelize.STRING,
  },
});

const Comment = sequelize.define('comment', {
  by: {
    type: Sequelize.STRING,
  },
  id: {
    type: Sequelize.INTEGER,
  },
  // Ignore children of comments as we're only interested in top-level comments.
  parent: {
    type: Sequelize.INTEGER,
  },
  text: {
    type: Sequelize.STRING,
  },
  time: {
    type: Sequelize.INTEGER,
  },
  type: {
    type: Sequelize.STRING,
  },
});

Ask.hasMany(Comment);
Comment.belongsTo(Ask);

Ask.sync();
Comment.sync();

module.exports = {
  models: {
    Ask,
    Comment,
  },
  sequelize,
};
