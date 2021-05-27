const fs = require('fs');
const https = require('https');

fs.readFile('README.md', 'utf8', (err, file) => {
  if (err) {
    throw err;
  }

  const req = https.get(
    'https://geek-jokes.sameerkumar.website/api?format=json',
    (res) => {
      res.on('data', (data) => {
        const oldJoke = new RegExp(/<!-- joke -->[\s\S]+<!-- \/joke -->/);
        const newJoke =
          '<!-- joke -->\n>' + JSON.parse(data).joke + '\n<!-- /joke -->';

        file = file.replace(oldJoke, newJoke);

        const date = new Date();
        const oldDate = new RegExp(/\*Last update: .+\*/);
        const newDate = '*Last update: ' + date.toUTCString() + '*';
        file = file.replace(oldDate, newDate);

        const oldHeading = new RegExp(/### Joke of the day \(.+/);
        const newHeading = '### Joke of the day (' + date.toDateString() + ')';
        file = file.replace(oldHeading, newHeading);

        fs.writeFile('README.md', file, (err) => {
          if (err) {
            throw err;
          }
        });
      });
    }
  );

  req.on('error', (error) => {
    throw error;
  });

  req.end();
});
