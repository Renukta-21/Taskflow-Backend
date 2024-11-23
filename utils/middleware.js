const logger = (req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`${req.method} --->   ${req.url}`)
    }
    next()
}

const errorHandler = (err, req, res, next) => {
    console.log(err.message)
    if (err.code === 11000) {
        if(err.message.includes('username')){
            res.status(409).send('Username already taken')
        }else if(err.message.includes('categories')){
            res.status(409).send({error:'Category already exists'})
        }
    } else if (err.name === "ValidationError") {
        res.status(400).send({ error: err.message })
    } else if (err) {
        
    }

}
module.exports = { logger, errorHandler }
