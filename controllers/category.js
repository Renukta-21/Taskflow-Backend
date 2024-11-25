const categoriesRouter = require('express').Router()
const Category = require('../models/category')

categoriesRouter.post('/', async(req,res)=>{
    const {name, icon, user} = req.body
    const newCategory = new Category({name,icon, user})
    await newCategory.save()
    res.status(201).send(newCategory)
})

categoriesRouter.get('/', async(req,res)=>{
    const categories = await Category.find({})
    if(!categories){
        return res.status(404).send({error:'No categories found'})
    }
    res.status(200).send(categories)
})
categoriesRouter.delete('/:id', async(req,res)=>{
    const {id} = req.params
    const result = await Category.findByIdAndDelete(id)
    if(!result){
        return res.status(404).send({error:'Category not found'})
    }
    res.status(204).end()
})

module.exports = categoriesRouter