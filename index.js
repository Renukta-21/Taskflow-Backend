const app = require('./app')
require('dotenv').config()

app.listen(process.env.PORT, ()=>{
    console.log('service started on ' + process.env.PORT)
})