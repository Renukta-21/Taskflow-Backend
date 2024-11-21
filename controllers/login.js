const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('express-async-errors')

loginRouter.post('/', async(req,res)=>{
    const {username, password} = req.body
    if(!username || !password){
        return res.status(400).send({error:'Username or password not provided'})
    }
    const user = await User.findOne({username})
    
    if(!user){
        return res.status(401).send({error: 'username not found'})
    }
   const validPassword = await bcrypt.compare(password, user.passwordHash)
   if(!validPassword){
    return res.status(401).send({error:'incorrect password'})
   }

   const token = jwt.sign({
    username: user.username,
    userID : user._id
   }, process.env.SECRET_JWT_KEY)

   res.status(200).send({token, username:user.username})
})

module.exports = loginRouter