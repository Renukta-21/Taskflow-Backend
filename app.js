
require('dotenv').config()
const express = require ('express')
const app = express()
const middleware = require('./utils/middleware')
const { default: mongoose } = require('mongoose')
const User = require('./models/user')
require('express-async-errors')
const bcrypt = require('bcrypt')

app.use(express.json())
app.use(middleware.logger)

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log(`succesful connnection to ${process.env.MONGO_URI}`))
.catch((err)=> console.log(err))

app.post('/api/users', async(req,res)=>{
    const {password, username, email} = req.body
        if(!password || password.length<8){
        return res.status(400).send({error: 'length error: Password must be at least 8 chars '})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        username:username,
        password:passwordHash,
        email:email
    })
    await newUser.save()
    res.status(201).send(newUser)
})

app.use(middleware.errorHandler)

module.exports = app