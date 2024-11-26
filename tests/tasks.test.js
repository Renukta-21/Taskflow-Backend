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

let firstCategory, newTask, authorization,tasksResponse, userResponse
const newCategory = {
  name: 'Excercise',
  icon: '🔥',
}
const userCredentials = {
  username: 'daniel',
  password: 'daniel211004',
}
describe('Tasks Routes', () => {
  beforeEach(async () => {
    await Category.deleteMany({})
    await Task.deleteMany({})
    await User.deleteMany({})
    const newUser = await api.post('/api/users')
    .send({...userCredentials, email:'edu211004@gmail.com'})
    .expect(201)

    const newLogin = await api.post('/api/login').send(userCredentials)
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
    const response = await api.post(baseURL)
    .set('Authorization', authorization)
    .send(newTask)
    .expect(201)
    
     userResponse = await api.get('/api/users')
    .set('Authorization', authorization)
    .expect(200)

    console.log(userResponse.body)
  })

  test('user can delete a task', async()=>{
    console.log(userResponse.body)
    
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
