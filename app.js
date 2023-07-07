const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Load user data from JSON file
let users = [];
fs.readFile('configs/users.json', (err, data) => {
  if (err) throw err;
  users = JSON.parse(data);
});

// Load JWT secret key from file
let secretKey = '';
fs.readFile('configs/secret_key', 'utf8', (err, data) => {
  if (err) throw err;
  secretKey = data.trim();
});

// Generate a token for a user
function generateToken(user) {
  return jwt.sign(user, secretKey);
}

// Middleware to authenticate a token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.use(bodyParser.json());

// Define your routes here
app.get('/', function(req, res) {
  res.send('Hello, world!');
});

// Route for /login
app.post('/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // Look up the user in the loaded user data
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).send({ message: 'Incorrect username.' });
  }
  if (user.password !== password) {
    return res.status(400).send({ message: 'Incorrect password.' });
  }

  // Generate a token for the user
  const token = generateToken({ username: user.username });

  // Send the token to the user
  res.send({ token });
});

// Use morgan for logging
app.use(morgan(':date[iso] | :status | :remote-addr | :method | :url'));

// Dynamically generate routes for each YAML file in the api directory
fs.readdir('apis', (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    if (file.endsWith('.yaml') || file.endsWith('.yml')) {
      const baseName = path.basename(file, path.extname(file));
      const route = '/' + baseName.replace(/_/g, '-');

      console.log('Generated route:', route); // Log the generated route

      app.get(route, authenticateToken, (req, res) => {
        fs.readFile('apis/' + file, 'utf8', (err, data) => {
          if (err) {
            res.status(500).send({ message: 'Error reading file.' });
          } else {
            const yamlData = yaml.load(data);
            res.send(yamlData);
          }
        });
      });
    }
  });
});

app.listen(3000, function() {
  console.log('App is listening on port 3000');
});