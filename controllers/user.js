const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
require('express-async-errors')

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

module.exports = userRouter