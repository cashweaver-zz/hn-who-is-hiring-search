module.exports = {
  db: {
    name: 'hnwhoishiring',
    username: 'hnwih',
    password: 'asdf',
    // path: `./db/${process.env.NODE_ENV}-hnwhoishiring.sqlite`,
  },
  query: {
    // Regex to test against Comment text
    regexes: [
      'remote.*(js|javascript|react)',
      '(js|javascript|react).*remote',
    ],
    // AND || OR
    regexesAndOr: 'OR',
    // Oldest Comment to include in the search (Unix time)
    oldestComment: 1470205707,
    includeWhoIsHiring: true,
    includeFreelancerSeekingFreelancer: false,
    includeWhoWantsToBeHired: false,
  },
  asyncWorkers: {
    askCheckingQ: 2,
    commentCreationQ: 10,
    askCreationQ: 2,
  },
};
