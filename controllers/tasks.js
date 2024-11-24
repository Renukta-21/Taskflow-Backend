const tasksRouter = require('express').Router()
const Task = require('../models/tasks')

tasksRouter.get('/', async(req,res)=>{
    const {userId} = req.body
    const tasks = Task.find({user: userId})
    if(!tasks){
        return res.status(404).send({error: 'No user tasks found'})
    }
    res.status(200).send(tasks)
})

tasksRouter.post('/', async(req, res)=>{
    const {user, title, description, completed, category} = req.body
    const newTask = new Task({user, title, description, completed, category})
    await newTask.save()
    res.status(201).send(newTask)
})
module.exports = tasksRouter