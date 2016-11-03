module.exports = {
  db: {
    name: 'hnwhoishiring',
    username: 'username',
    password: 'password',
    path: `./db/${process.env.NODE_ENV}-hnwhoishiring.sqlite`,
  },
  queryRegex: 'remote',
};
