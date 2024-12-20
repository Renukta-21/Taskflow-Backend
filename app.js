
require('dotenv').config()
const express = require ('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const { default: mongoose } = require('mongoose')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const categoriesRouter = require('./controllers/category')
const tasksRouter = require('./controllers/tasks')
const resetRouter = require('./controllers/resetRouter')

const connectionString = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI
mongoose.connect(connectionString)
.then(()=> console.log(`succesful connnection to Database`))
.catch((err)=> console.log(err))

console.log(connectionString)
app.use(cors())
app.use(express.json())
app.use(middleware.logger)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/categories',middleware.tokenExtractor, categoriesRouter, )
app.use('/api/tasks', middleware.tokenExtractor, tasksRouter)
app.use('/api/reset', middleware.tokenExtractor,resetRouter)

app.use((req,res,next)=>{
    res.status(404).send({error:'Route not found'})
    next()
} )
app.use(middleware.errorHandler)

module.exports = app