const express = require('express');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const {
  logUncaughtException,
  logUnhandledRejection
} = require('./helpers/logger.helper.js');
const {
  requestLoggerMiddleware,
  rootRequestMiddleware,
  errorLoggerMiddleware,
  errorHandlerMiddleware
} = require('./middlewares');
const config = require('./config/config.js');
const routes = require('./resources/routers.js');
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

process.on('uncaughtException', err => {
  logUncaughtException(err);

  const { exit } = process;
  exit(1);
});

// uncomment next line for checking 'uncaughtException'
// throw Error('Oops!');

process.on('unhandledRejection', err => {
  logUnhandledRejection(err);

  const { exit } = process;
  exit(1);
});

// uncomment next line for checking 'unhandledRejection'
// Promise.reject(Error('Oops!'));

module.exports = express()
  .use(express.json())
  .use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  .use(requestLoggerMiddleware)
  .use('/', rootRequestMiddleware)
  // uncomment 48, 49 and 50 lines for checking:
  // errorHandlerMiddleware (send user 500 code and message "Internal Server Error")
  // and errorLoggerMiddleware (output to terminal error)
  // .use(() => {
  //   throw new Error('Oops!');
  // })
  .use('/', routes)
  .use(errorHandlerMiddleware)
  .use(errorLoggerMiddleware)
  .listen(config.PORT, () =>
    console.log(`App is running on http://localhost:${config.PORT}`)
  );
