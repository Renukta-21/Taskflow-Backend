const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        minLength:5
    },
    passwordHash:{
        type:String,
        required:true,
        minLength:5
    },
    email:{
        type:String,
        required:true
    },
    categories:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    }]
})

const User = mongoose.model('User', userSchema)

module.exports = User