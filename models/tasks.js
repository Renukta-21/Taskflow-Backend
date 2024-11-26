const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        required:true,
        type:String
    },
    completed:{
        type:Boolean,
        default:false  
    },
    category:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    user:{
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const Task = mongoose.model('Task', taskSchema)

module.exports = Task
