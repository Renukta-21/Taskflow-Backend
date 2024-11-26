const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
require('express-async-errors')
const middleware = require('../utils/middleware')

userRouter.post('/', async(req,res)=>{
    const {password, username, email} = req.body
        if(!password || password.length<8){
        return res.status(400).send({error: 'Password length must be at least 8 chars '})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        username,
        passwordHash,
        email
    })
    await newUser.save()
    res.status(201).send(newUser)
})
userRouter.get('/', middleware.tokenExtractor,  async(req,res)=>{
    const user = await User.findById(req.user._id).populate('tasks');
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }
  res.status(200).send(user);
})
module.exports = userRouter