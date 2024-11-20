const logger = (req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(`${req.method} --->   ${req.url}`)
    }
    next()
}

const errorHandler = (err, req, res, next) => {
    if (err.code === 11000) {
        res.status(409).send('Username already taken')
    } else if (err.name === "ValidationError") {
        res.status(400).send({ error: err.message })
    } else if (err) {
        console.log(err)
    }

}
module.exports = { logger, errorHandler }
