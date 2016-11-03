module.exports = {
  db: {
    name: 'hnwhoishiring',
    username: 'username',
    password: 'password',
    path: `./db/${process.env.NODE_ENV}-hnwhoishiring.sqlite`,
  },
  query: {
    // Regex to test against Comment text
    regex: 'remote',
    // Oldest Comment to include in the search (Unix time)
    oldestComment: 1470205707,
  },
  asyncWorkers: {
    askCheckingQ: 1,
    commentCreationQ: 10,
    askCreationQ: 1,
  },
};
