const express = require('express');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const {
  logUncaughtException,
  logUnhandledRejection
} = require('./helpers/logger.helper.js');
const middlewares = require('./middlewares');
const config = require('./config/config.js');
const routes = require('./resources/routers.js');
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

process.on('uncaughtException', logUncaughtException);

// uncomment next line for checking uncaughtException
// throw Error('Oops!');

process.on('unhandledRejection', logUnhandledRejection);

// uncomment next line for checking unhandledRejection
// Promise.reject(Error('Oops!'));

module.exports = express()
  .use(express.json())
  .use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  .use(middlewares.requestLoggerMiddleware)
  .use(
    '/',
    (req, res, next) => {
      if (req.originalUrl === '/') {
        res.send('Service is running!');
        return;
      }

      next();
    },
    routes
  )
  .use(middlewares.errorHandlerMiddleware, middlewares.errorLoggerMiddleware)
  .listen(config.PORT, () =>
    console.log(`App is running on http://localhost:${config.PORT}`)
  );
