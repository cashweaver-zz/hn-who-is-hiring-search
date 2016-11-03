const queryConfig = require('./../queryConfig');

module.exports = {
  asyncWorkers: {
    askCheckingQ: 2,
    commentCreationQ: 10,
    askCreationQ: 2,
  },
  db: {
    name: 'hnwhoishiring',
    username: 'hnwih',
    password: 'asdf',
    // path: `./db/${process.env.NODE_ENV}-hnwhoishiring.sqlite`,
  },
  query: queryConfig,
};
