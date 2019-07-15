const path = require('path');
const express = require('express');
const cors = require('cors');

const data = require('./db');

const app = express();

app.use(express.static(path.join(__dirname, '../client')));
app.use(cors());

app.use(express.json());

app.get('/data', (req, res) => {
  res.json(data);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

module.exports = app;