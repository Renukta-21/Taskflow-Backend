const tasksRouter = require('express').Router()
const Task = require('../models/tasks')

tasksRouter.get('/', async(req,res)=>{
    const user = req.user
    const tasks = await Task.find({ user: user._id} )
    if(!tasks){
        return res.status(404).send({error: 'No user tasks found'})
    }
    res.status(200).send(tasks)
})

tasksRouter.post('/', async(req, res)=>{
    const {title, description, completed, category} = req.body
    const user = req.user
    const newTask = new Task({user: user._id, title, description, completed, category})
    await newTask.save()
    res.status(201).send(newTask)
})
module.exports = tasksRouter