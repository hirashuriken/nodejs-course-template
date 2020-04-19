const usersRepo = require('./users.db.repository.js');
const User = require('./users.model.js');
const tasksService = require('../tasks/tasks.service.js');
const { NotFoundError } = require('../../helpers/error.helper.js');

/**
 * Returns users
 * @return {Promise}
 */
const getUsers = async () => {
  const users = await usersRepo.getAll();

  return users.map(User.toResponse);
};

/**
 * Creates user
 * @param {Object} user
 * @return {Promise}
 */
const createUser = async user => {
  const newUserId = await usersRepo.createOne(new User(user));
  const newUser = await usersRepo.getOne(newUserId);

  return User.toResponse(newUser);
};

/**
 * Returns user by userId
 * @param {String} userId
 * @return {Promise}
 */
const getUser = async userId => {
  const user = await usersRepo.getOne(userId);

  if (!user) {
    throw new NotFoundError('User has not found');
  }

  return User.toResponse(user);
};

/**
 * Updates user
 * @param {String} userId
 * @param {Object} user
 * @return {Promise}
 */
const updateUser = async (userId, user) => {
  const updatedUser = await usersRepo.updateOne(userId, user);

  if (!updatedUser) {
    throw new NotFoundError('User has not updated because not found');
  }

  return User.toResponse(updatedUser);
};

/**
 * Deletes user and unassign him from tasks
 * @param {String} userId
 * @return {Promise}
 */
const deleteUser = async userId => {
  const deletedUser = await usersRepo.deleteOne(userId);

  if (!deletedUser) {
    throw new NotFoundError('User has not deleted because not found');
  }

  await tasksService.unassignUserFromTasks(deletedUser._id);

  return deletedUser;
};

module.exports = { getUsers, createUser, getUser, updateUser, deleteUser };
