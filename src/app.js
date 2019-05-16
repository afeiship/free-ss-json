const fetch = require('node-fetch');

// failed:
fetch('https://free-ss.site/')
  .then((res) => res.text())
  .then((body) => console.log(body));
