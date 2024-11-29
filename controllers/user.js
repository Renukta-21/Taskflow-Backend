const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
require('express-async-errors')
const middleware = require('../utils/middleware')
const Category = require('../models/category')

userRouter.post('/', async (req, res) => {
  const { password, username, email } = req.body
  if (!password || password.length < 8) {
    return res
      .status(400)
      .send({ error: 'Password length must be at least 8 chars ' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const newUser = new User({
    username,
    passwordHash,
    email
  })

  await newUser.save()
  const defaultCategories = [
    {
      name: 'Home tasks',
      icon: '🐥',
      user:newUser._id
    },
    {
      name: 'Study',
      icon: '💪',
      user:newUser._id
    },
    {
      name: 'Meditation',
      icon: '🐸',
      user:newUser._id
    },
  ]

  await Category.insertMany(defaultCategories)
  res.status(201).send(newUser)
})

userRouter.get('/', middleware.tokenExtractor, async (req, res) => {
  const user = await User.findById(req.user._id).populate('categories')

  if (!user) {
    return res.status(404).send({ error: 'User not found' })
  }
  res.status(200).send(user)
})

userRouter.put('/tutorial', middleware.tokenExtractor, async(req, res)=>{
  const userData = req.body
  const response = await User.findByIdAndUpdate(userData._id, {firstLogin:false}, {new:true})
  if(!response){
    return res.status(404).send({error:'User not found'})
  } 
  res.status(200).send(response)
})

userRouter.get('/tutorial', middleware.tokenExtractor, async(req,res)=>{
  const user = req.user
  const response = await User.findById(user._id)
  if(!response){
    return res.status(404).send({error:'User not found'})
  }

  res.status(200).send({firstLogin: response.firstLogin})
})
module.exports = userRouter

