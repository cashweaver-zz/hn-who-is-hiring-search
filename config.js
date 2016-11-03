module.exports = {
  db: {
    name: 'hnwhoishiring',
    username: 'username',
    password: 'password',
    path: `./db/${process.env.NODE_ENV}-hnwhoishiring.sqlite`,
  },
  queryRegex: 'remote',
  asyncWorkers: {
    askCheckingQ: 1,
    commentCreationQ: 10,
    askCreationQ: 1,
  },
};
