const config = require('../../config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  config.db.name,
  config.db.username,
  config.db.password,
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
  }
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
    primaryKey: true,
  },
  score: {
    type: Sequelize.INTEGER,
  },
  text: {
    type: Sequelize.TEXT,
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
}, {
  underscored: true,
});

const Comment = sequelize.define('comment', {
  by: {
    type: Sequelize.STRING,
  },
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  // Ignore children of comments as we're only interested in top-level comments.
  parent: {
    type: Sequelize.INTEGER,
  },
  text: {
    type: Sequelize.TEXT,
  },
  time: {
    type: Sequelize.INTEGER,
  },
  type: {
    type: Sequelize.STRING,
  },
}, {
  underscored: true,
});

Ask.hasMany(Comment);
Comment.belongsTo(Ask);

module.exports = {
  models: {
    Ask,
    Comment,
  },
  sequelize,
};
