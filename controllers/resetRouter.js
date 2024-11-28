const resetRouter = require('express').Router();
const User = require('../models/user');
const Task = require('../models/tasks');
const Category = require('../models/category');

resetRouter.post('/', async (req, res) => {
  try {
    await User.deleteMany({});
    await Task.deleteMany({});
    await Category.deleteMany({});

    res.status(200).send({ message: 'Database reset successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error resetting database', details: error.message });
  }
});

module.exports = resetRouter;
