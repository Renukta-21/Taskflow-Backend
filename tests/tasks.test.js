const {test, describe, after, beforeEach}  = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const { default: mongoose } = require('mongoose')
const Category = require('../models/category')
const Task = require('../models/tasks')

const api = supertest(app)

const baseURL = '/api/tasks'
const categURL = '/api/categories'

let firstCategory, newTask
const newCategory = {
    name:"Excercise",
    icon:'🔥'
}
const authoriz = 'Bearer '
describe('Tasks Routes', ()=>{
    beforeEach(async()=>{
        await Category.deleteMany({})
        await Task.deleteMany({})
        firstCategory =  await api.post(categURL)
        .set('Authorization', authoriz)
        .send(newCategory)
        .expect(201)

        newTask = {
            user: 'jnjhbhg6tt62tgyrhdfdf',
            title: 'Jog',
            description:'Jog 15km in 30 minutes',
            category: firstCategory.body._id
        }
    })
    test('User can add new tasks', async()=>{
        const responseNewTask = await api.post(baseURL)
        .set('Authorization', authoriz)
        .send(newTask)
        .expect(201)

        const tasksResponse = await api.get(baseURL)
        .set('Authorization', authoriz)
        .expect(200)
        /* console.log(responseNewTask.body)
        console.log(tasksResponse.body) */
        /* assert.deepStrictEqual(responseNewTask.body, tasksResponse.body[0]) */
    })
    
    
    after(async()=>{
        await mongoose.connection.close()
    })
})