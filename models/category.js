const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
    name:{
        type:String, 
        required:true,
        unique:true
    },
    icon:{
        type:String,
        required:true
    },
    user:{
        required:true,
        type: mongoose.Types.ObjectId,
        ref:'User'
    }, tasks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Task'
    }]
})

const Category = mongoose.model('Category', categorySchema)
module.exports = Category