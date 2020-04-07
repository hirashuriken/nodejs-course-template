const express = require('express');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');

const { PORT } = require('./common/config.js');

const routes = require('./resources/routers.js');

const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

module.exports = express()
  .use(express.json())
  .use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
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
  .listen(PORT, () =>
    console.log(`App is running on http://localhost:${PORT}`)
  );
