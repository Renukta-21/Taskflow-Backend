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

    test('No duplicated names allowed', async()=>{
        const response = await api.post(baseURL)
        .send({name:"Excercise"})
        .expect(409)

        assert.ok(response.body.error.includes('Category already exists'))
    })

    test('New one added succesfully', async()=>{
        await api.post(baseURL)
        .send(newCategory)
        .expect(201)
    })

    test('Category successfully eliminated', async()=>{
        await api.delete(`${baseURL}/${firstCat._id}`)
        .expect(204)
    })
    after(async()=>{
        await mongoose.connection.close()
    })
})
