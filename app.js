
require('dotenv').config()
const express = require ('express')
const app = express()
const middleware = require('./utils/middleware')
const { default: mongoose } = require('mongoose')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')

const connectionString = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI : process.env.MONGO_URI_TEST
mongoose.connect(connectionString)
.then(()=> console.log(`succesful connnection to ${connectionString}`))
.catch((err)=> console.log(err))

app.use(express.json())
app.use(middleware.logger)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)

module.exports = app