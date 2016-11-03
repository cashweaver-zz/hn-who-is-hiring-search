module.exports = {
  db: {
    name: 'hnwhoishiring',
    username: 'username',
    password: 'password',
    path: `./db/${process.env.NODE_ENV}-hnwhoishiring.sqlite`,
  },
  query: {
    // Regex to test against Comment text
    regex: '',
    // Oldest Comment to include in the search (Unix time)
    oldestComment: '',
  },
  asyncWorkers: {
    askCheckingQ: 1,
    commentCreationQ: 10,
    askCreationQ: 1,
  },
};
