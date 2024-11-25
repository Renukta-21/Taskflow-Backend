const categoriesRouter = require('express').Router()
const Category = require('../models/category')
require('express-async-errors')

categoriesRouter.post('/', async (req, res) => {
  const { name, icon } = req.body
  const user = req.user
  const newCategory = new Category({ name, icon, user: user._id })
  await newCategory.save()
  res.status(201).send(newCategory)
})

categoriesRouter.get('/', async (req, res) => {
  const user = req.user
  const categories = await Category.find({user: user._id})
  if (!categories) {
    return res.status(404).send({ error: 'No categories found' })
  }
  res.status(200).send(categories)
})
categoriesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params
  const result = await Category.findByIdAndDelete(id)
  if (!result) {
    return res.status(404).send({ error: 'Category not found' })
  }
  res.status(204).end()
})

module.exports = categoriesRouter
 