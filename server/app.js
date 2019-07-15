const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.static(path.join(__dirname, '../client')));
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

module.exports = app;