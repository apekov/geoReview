const express = require('express');
const bodyParser = require('body-parser');
// const users = require('./users');

const app = express();

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.listen(4000, function() {
    console.log('Example app listening on port 4000!');
});
