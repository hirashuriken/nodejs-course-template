const express = require('express');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const {
  requestLoggerMiddleware,
  rootRequestMiddleware,
  errorLoggerMiddleware,
  errorHandlerMiddleware
} = require('./middlewares');
const routes = require('./resources/routers.js');
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

module.exports = express()
  .use(express.json())
  .use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  .use(requestLoggerMiddleware)
  .use('/', rootRequestMiddleware)
  .use('/', routes)
  .use(errorHandlerMiddleware)
  .use(errorLoggerMiddleware);
