const {test, describe, after}  = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const { default: mongoose } = require('mongoose')

const api = supertest(app)

baseURL = '/api/tasks'
const newTask = {
    user: 'jnjhbhg6tt62tgyrhdfdf',
    title: 'Jog',
    description:'Jog 15km in 30 minutes',
    category:'Excercise'
}

describe('Tasks Routes', ()=>{
    test('User can add new tasks', async()=>{
        await api.post(baseURL)
        .send(newTask)
        .expect(201)

        const response = await api.get(baseURL)
        .expect(200)

        console.log(response.body)
    })
    
    after(async()=>{
        await mongoose.connection.close()
    })
})