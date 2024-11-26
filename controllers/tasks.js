const tasksRouter = require('express').Router()
const Task = require('../models/tasks')

tasksRouter.get('/', async(req,res)=>{
    const user = req.user
    const tasks = await Task.find({ user: user._id}).populate('user', {username:1, email:1})
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
    user.tasks = user.tasks.concat(newTask._id)
    await user.save()

    res.status(201).send({
        message: 'Tarea agregada exitosamente',
        task: newTask
    })
})

tasksRouter.delete('/:id', async(req,res)=>{
    const {id} = req.params
    const task = Task.findByIdAndDelete(id)
    if(!task){
        return res.status(404).send({error:'task not found'})
    }
    res.send(204)
})
module.exports = tasksRouter