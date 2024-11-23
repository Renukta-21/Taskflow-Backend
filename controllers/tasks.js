const tasksRouter = require('express').Router()
const Tasks = require('../models/tasks')

tasksRouter.get('', async(req,res)=>{
    const {userId} = req.body
    const tasks = Tasks.find({user: userId})
    if(!tasks){
        return res.status(404).send({error: 'No user tasks found'})
    }
    res.status(200).send(tasks)
})

module.exports = tasksRouter