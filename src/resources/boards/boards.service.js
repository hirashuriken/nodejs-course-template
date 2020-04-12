const boardsRepo = require('./boards.memory.repository.js');
const tasksService = require('../tasks/tasks.service.js');
const Board = require('./boards.model.js');
const { NotFoundError } = require('../../helpers/error.helper.js');

/**
 * Returns boards
 * @return {Promise}
 */
const getBoards = async () => {
  const boards = await boardsRepo.getAll();

  return boards.map(Board.toResponse);
};

/**
 * Creates board
 * @param {Object} board
 * @return {Promise}
 */
const createBoard = async board => {
  const newBoardId = await boardsRepo.createOne(new Board(board));
  const newBoard = await boardsRepo.getOne(newBoardId);

  return Board.toResponse(newBoard);
};

/**
 * Gets board
 * @param {String} boardId
 * @return {Promise}
 */
const getBoard = async boardId => {
  const board = await boardsRepo.getOne(boardId);

  if (!board) {
    throw new NotFoundError('Board has not found');
  }

  return Board.toResponse(board);
};

/**
 * Updates board
 * @param {String} boardId
 * @param {Object} board
 * @return {Promise}
 */
const updateBoard = async (boardId, board) => {
  const updatedBoardId = await boardsRepo.updateOne(boardId, new Board(board));
  const updatedBoard = await boardsRepo.getOne(updatedBoardId);

  return Board.toResponse(updatedBoard);
};

/**
 * Deletes board
 * @param {String} boardId
 * @return {Promise}
 */
const deleteBoard = async boardId => {
  const deletedBoardId = await boardsRepo.deleteOne(boardId);

  await tasksService.deleteTasksByBoardId(boardId);

  return deletedBoardId;
};

module.exports = { getBoards, createBoard, getBoard, updateBoard, deleteBoard };
