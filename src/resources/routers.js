const Router = require('express').Router;

const { authMiddleware } = require('../middlewares');
const user = require('./login');
const users = require('./users');
const boards = require('./boards');
const tasks = require('./tasks');

module.exports = Router()
  .use('/login', user)
  .use('/users', authMiddleware, users)
  .use('/boards/:boardId/tasks', authMiddleware, tasks)
  .use('/boards', authMiddleware, boards);
