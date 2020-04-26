const db = require('./db.js');
const app = require('./app.js');

const {
  logUncaughtException,
  logUnhandledRejection
} = require('./helpers/logger.helper.js');
const config = require('./config/config.js');
const User = require('./resources/users/users.model.js');
const Task = require('./resources/tasks/tasks.model.js');
const Board = require('./resources/boards/boards.model.js');

process.on('uncaughtException', err => {
  logUncaughtException(err);

  const { exit } = process;
  exit(1);
});

process.on('unhandledRejection', err => {
  logUnhandledRejection(err);

  const { exit } = process;
  exit(1);
});

db.then(async () => {
  console.log('MongoDB connection successful');

  await User.deleteMany();
  await Task.deleteMany();
  await Board.deleteMany();

  const admin = new User({ login: 'admin', password: 'admin' });
  await admin.save();

  app.listen(config.PORT, () =>
    console.log(`App is running on http://localhost:${config.PORT}`)
  );
}).catch(err => {
  console.log('MongoDB connection failed: ', err);
});
