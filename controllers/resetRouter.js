const resetRouter = require('express').Router();
const User = require('../models/user');
const Task = require('../models/tasks');
const Category = require('../models/category');
const middleware = require('../utils/middleware')

resetRouter.post('/', async (req, res) => {
  const user = req.user
  try {
    await Task.deleteMany({user:user._id});
    await Category.deleteMany({user:user._id});

    user.categories = []
    user.firstLogin=true
    await user.save()

    const defaultCategories = [
      {
        name: 'Home tasks',
        icon: '🛏️',
        user:user._id
      },
      {
        name: 'Study',
        icon: '🧠',
        user:user._id
      },
      {
        name: 'Excercise',
        icon: '🏋️‍♂️',
        user:user._id
      },
    ]
  
    await Category.insertMany(defaultCategories)

    res.status(200).send({ message: 'User records resetted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error resetting database', details: error.message });
  }
});

module.exports = resetRouter;
