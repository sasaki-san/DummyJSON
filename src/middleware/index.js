const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const applyRateLimit = require('../utils/applyRateLimit');
const logger = require('./logger');
const cleanRequest = require('./cleanRequest');

// use database to store logs
// require('../db/mongoose');

function injectMiddleWares(app) {
  // enable compression.
  app.use(compression());

  // enable CORS.
  app.use(cors());

  // use helmet JS.
  app.use(helmet());

  // use bodyParser
  app.use(express.json());

  applyRateLimit(app);

  app.use(logger);

  app.use(cleanRequest);
}

module.exports = injectMiddleWares;
