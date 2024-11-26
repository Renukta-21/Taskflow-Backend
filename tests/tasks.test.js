const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const { default: mongoose } = require('mongoose')
const Category = require('../models/category')
const Task = require('../models/tasks')
const User = require('../models/user')

const api = supertest(app)

const baseURL = '/api/tasks'
const categURL = '/api/categories'

let firstCategory, newTask, authorization,tasksResponse
const newCategory = {
  name: 'Excercise',
  icon: '🔥',
}
describe('Tasks Routes', () => {
  beforeEach(async () => {
    await Category.deleteMany({})
    await Task.deleteMany({})
    const newLogin = await api.post('/api/login').send({
      username: 'daniel',
      password: 'daniel211004',
    })
    .expect(200)

    authorization = `Bearer ${newLogin.body.token}`
    firstCategory = await api
      .post(categURL)
      .set('Authorization', authorization)
      .send(newCategory)
      .expect(201)

    newTask = {
      user: 'jnjhbhg6tt62tgyrhdfdf',
      title: 'Jog',
      description: 'Jog 15km in 30 minutes',
      category: firstCategory.body._id
    }
  })
  
  test('User can add new tasks', async () => {
    const responseNewTask = await api
      .post(baseURL)
      .set('Authorization', authorization)
      .send(newTask)
      .expect(201)

    tasksResponse = await api
      .get(baseURL)
      .set('Authorization', authorization)
      .expect(200)
      console.log(tasksResponse.body)
  })

  test('user can delete a task', async()=>{
    const response = await api.delete(`${baseURL}/${tasksResponse.body[0]._id}`)
    .set('Authorization', authorization)
    .expect(204)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
