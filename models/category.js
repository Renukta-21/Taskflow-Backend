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
        type:mongoose.Schema.Types.ObjectId
    }]
})

const Category = new mongoose.model('category', categorySchema)
module.exports = Category