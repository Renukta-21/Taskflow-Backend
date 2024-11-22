const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    completed:{
        type:Boolean,
        default:false  
    },
    category:{
        type:String
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref:'user',
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const Task = new mongoose.model('task', taskSchema)

module.exports = Task
