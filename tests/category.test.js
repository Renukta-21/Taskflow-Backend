const {test, describe, after, beforeEach} = require('node:test')
const assert = require('node:assert') 
const supertest = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const Category = require('../models/category')
const api = supertest(app)

const baseURL = '/api/categories'

let firstCat
const firstCategory = {
    name:"Excercise",
}
const newCategory = {
    name:'Study'
}

describe('Category Routes', ()=>{
    beforeEach(async()=>{
        await Category.deleteMany({})
        const newCat = new Category(firstCategory)
         firstCat = await newCat.save()
    })

    test('No duplicated categories allowed', async()=>{
        const response = await api.post(baseURL)
        .send({name:"Excercise"})
        .expect(409)

        assert.ok(response.body.error.includes('Category already exists'))
    })

    test('Creates a new category successfully', async()=>{
        await api.post(baseURL)
        .send(newCategory)
        .expect(201)
    })

    test('Category successfully eliminated', async()=>{
        await api.delete(`${baseURL}/${firstCat._id}`)
        .expect(204)
    })
    test('Returns 404 when deleting a non-existing category', async()=>{
        const response = await api.post(baseURL)
        .send(newCategory)
        .expect(201)

        await Category.findByIdAndDelete(response.body._id)
        await api.delete(`${baseURL}/${response.body._id}`)
        .expect(404)
    })
    test('Returns 400 if name is missing when creating a category', async () => {
        const response = await api.post(baseURL)
            .send({}) 
            .expect(400);  
        
        assert.ok(response.body.error.includes('category validation failed: name: Path `name` is required.'));
    });
    
    after(async()=>{
        await mongoose.connection.close()
    })
})
