const rp = require('request-promise');
// const askController = require('./controllers/askController');


rp('https://hacker-news.firebaseio.com/v0/user/whoishiring.json')
  .then(res => JSON.parse(res))
  .then(({ submitted }) => {
    // Only work with a few submissions while we're developing.
    submitted = submitted.slice(0, 1);
  })
  .catch(err => console.error(err));
