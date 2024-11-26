const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const Category = require('../models/category')
const User = require('../models/user')
const Task = require('../models/tasks')
const api = supertest(app)

const baseURL = '/api/categories'
const newCategory = {
  name: 'Study',
  icon: '🔥',
}
const newUser = {
  username: 'Daniel',
  password: 'daniel211004',
  email: 'edu211004@gmail.com',
}
let newUserResponse, loginUserResponse, authorization, firstCategory
describe('Category Routes', () => {
  beforeEach(async () => {
    await Category.deleteMany({})
    await User.deleteMany({})
    await Task.deleteMany({})
    newUserResponse = await api.post('/api/users').send(newUser).expect(201)

    loginUserResponse = await api
      .post('/api/login')
      .send({ username: 'Daniel', password: 'daniel211004' })
      .expect(200)

    authorization = `Bearer ${loginUserResponse.body.token}`

    firstCategory = await api
      .post(baseURL)
      .set('Authorization', authorization)
      .send(newCategory)
      .expect(201)
  })

  test('Category successfully eliminated', async () => {
    const response = await api
      .delete(`${baseURL}/${firstCategory.body._id}`)
      .set('Authorization', authorization)
      .expect(204)
  })
  test('Returns 404 when deleting a non-existing category', async () => {
    await Category.findByIdAndDelete(firstCategory.body._id)
    await api
      .delete(`${baseURL}/${firstCategory.body._id}`)
      .set('Authorization', authorization)
      .expect(404)
  })

  test('new categories added succefully', async () => {
    const newTasks = [
      {
        name: 'Homework',
        icon: '🧠',
      },
      {
        name: 'Excercise',
        icon: '💪',
      },
    ]

    await api.post(baseURL)
    .set('Authorization', authorization)
    .send(newTasks[0])
    .expect(201)

    await api.post(baseURL)
    .set('Authorization', authorization)
    .send(newTasks[1])
    .expect(201)

    const categoriesList = await api.get(baseURL)
    .set('Authorization', authorization)
    .expect(200)

    console.log(categoriesList.body)
  })

  test('Adding tasks to Categories', async()=>{
    const response = await api.post(baseURL)
    .set('Authorization', authorization)
    .send(newTask)
  })
  after(async () => {
    await mongoose.connection.close()
  })
})
