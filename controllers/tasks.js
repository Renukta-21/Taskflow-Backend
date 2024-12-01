const tasksRouter = require('express').Router()
const Category = require('../models/category')
const Task = require('../models/tasks')
require('express-async-errors')

tasksRouter.get('/', async(req,res)=>{
    const user = req.user
    const tasks = await Task.find({ user: user._id}).populate('category')
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
    const categoryModel = await Category.findById(category)
    categoryModel.tasks= categoryModel.tasks.concat(newTask._id)
    await categoryModel.save()
    
    res.status(201).send(newTask)
})

tasksRouter.delete('/:id', async(req,res)=>{
    const {id} = req.params
    const task = await Task.findByIdAndDelete(id)
    if(!task){
        return res.status(404).send({error:'task not found'})
    }
    let category = await Category.findById(task.category)
    if(!category){
        return res.status(404).send({error:'category property not found'})
    }
    category.tasks = category.tasks.filter(t=> t.toString() !== task._id.toString())
    await category.save()
    
    res.status(204).end()
})
module.exports = tasksRouter