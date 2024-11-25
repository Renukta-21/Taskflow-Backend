const jwt = require('jsonwebtoken')
const logger = (req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`${req.method} --->   ${req.url}`)
  }
  next()
}
const tokenExtractor = async (req, res, next) => {
  const authorizationHeader = req.get('Authorization')
  if (authorizationHeader && authorizationHeader.startsWith('Bearer')) {
    const token = authorizationHeader.split(' ')[1]
    try {
        const validToken = jwt.verify(token, process.env.SECRET_JWT_KEY)
        console.log(validToken)
    } catch (error) {
        next(error)
    }
  } else {
    return res
      .status(400)
      .send({ error: 'Authorization header missing or malformed' })
  }

  next()
}
const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.code === 11000) {
    if (err.message.includes('username')) {
      res.status(409).send('Username already taken')
    } else if (err.message.includes('categories')) {
      res.status(409).send({ error: 'Category already exists' })
    }
  } else if (err.name === 'ValidationError') {
    res.status(400).send({ error: err.message })
  } else if (err.name === 'CastError') {
    if (err.message.includes('ObjectId')) {
      return res
        .status(400)
        .send({ error: 'Invalid ObjectId format: Id is not a valid string' })
    }
  } else if (err.name ==='JsonWebTokenError') {
    res.status(400).send('Invalid token')
  }
}
module.exports = { logger, errorHandler, tokenExtractor }
