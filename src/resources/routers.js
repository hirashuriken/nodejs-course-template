const Router = require('express').Router;

const users = require('./users');
const boards = require('./boards');
const tasks = require('./tasks');

module.exports = Router()
  .use('/users', users)
  .use('/boards/:boardId/tasks', tasks)
  .use('/boards', boards);