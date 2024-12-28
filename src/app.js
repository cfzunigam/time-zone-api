const express = require('express');
const timeRoutes = require('./routes/timeRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/api', timeRoutes);

app.use(errorHandler);

module.exports = app;
