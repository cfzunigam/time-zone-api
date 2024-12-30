const express = require('express');
const timeRoutes = require('./routes/timeRoutes');

const app = express();

app.use(express.json());

app.use('/api', timeRoutes);

module.exports = app;
