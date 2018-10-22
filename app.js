// Require the express module
const express = require('express');
const path = require('path');
// Create a new web server
const app = express();
// Tell the web server to serve files
// from the www folder
app.use(express.static('www'));
// Start the web server on port 3000
app.listen(3000,() => console.log('Listening on port 3000'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './www/index.html'));
});

const Sass = require('./sass');
const config = require('./config.json');

for(let conf of config.sass){
    new Sass(conf);
}
