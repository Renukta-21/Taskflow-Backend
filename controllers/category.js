const categoriesRouter = require('express').Router()
const Category = require('../models/category')

categoriesRouter.post('/', async(req,res)=>{
    const {name, user} = req.body
    const newCategory = new Category({name, user})
    await newCategory.save()
    res.status(201).send(newCategory)
})

categoriesRouter.delete('/:id', async(req,res)=>{
    const {id} = req.params
    const result = await Category.findByIdAndDelete(id)
    if(!result){
        return res.status(404).send({error:'blog not found'})
    }
    res.status(204).end()
})

module.exports = categoriesRouter