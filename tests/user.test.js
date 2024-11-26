const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const User = require('../models/user')
const { default: mongoose } = require('mongoose')
const Task = require('../models/tasks')
const Category = require('../models/category')
const api = supertest(app)

let authorization,
  newCategory,
  newUserResponse,
  newLoginResponse,
  newCategoryResponse

describe('User endpoints', () => {
  const newUser = {
    username: 'Daniel',
    password: 'daniel211004',
    email: 'edu211004@gmail.com',
  }

  const baseUrl = '/api/users'
  beforeEach(async () => {
    await Task.deleteMany({})
    await User.deleteMany({})
    await Category.deleteMany({})

    newUserResponse = await api.post('/api/users').send(newUser).expect(201)

    newLoginResponse = await api
      .post('/api/login')
      .send({ username: 'Daniel', password: 'daniel211004' })
      .expect(200)

    authorization = `Bearer ${newLoginResponse.body.token}`

    newCategory = {
      name: 'Study',
      icon: '🔥',
      user: newUserResponse.body._id,
    }

    newCategoryResponse = await api
      .post('/api/categories')
      .set('Authorization', authorization)
      .send(newCategory)
      .expect(201)
  })
  describe('POST New User', async () => {
    const errorMessages = {
      username:
        'User validation failed: username: Path `username` is required.',
      password:
        'User validation failed: password: Path `password` is required.',
      email: 'User validation failed: email: Path `email` is required.',
    }

    const checkError = async (incompleteUser, expectedErrorMessage) => {
      const response = await api.post(baseUrl).send(incompleteUser).expect(400)

      assert.strictEqual(response.body.error, expectedErrorMessage)
    }

    test('No duplicated usernames allowed', async () => {
      await api.post(baseUrl).send(newUser).expect(409)
    })

    test('username field not sent errors', async () => {
      const incompleteUser = {
        password: 'daniel211132',
        email: 'edu211004@gmail.com',
      }
      await checkError(incompleteUser, errorMessages.username)
    })
    test("Username doesn't match min lenght", async () => {
      const IncUser = {
        username: 'Dan',
        password: 'daniel211004',
        email: 'edu211004@gmail.com',
      }
      const response = await api.post(baseUrl).send(IncUser).expect(400)
      assert(response.body.error.includes('length'))
    })
    test('Password does not meet the minimum length requirement or is missing', async () => {
      const IncUser = {
        username: 'Daniel',
        password: 'dan',
        email: 'edu211004@gmail.com',
      }
      const response = await api.post(baseUrl).send(IncUser).expect(400)
      assert(response.body.error.includes('length'))
    })
    test('email field not sent errors', async () => {
      const incompleteUser = {
        username: 'Daniel',
        password: 'daniel211132',
      }
      await checkError(incompleteUser, errorMessages.email)
    })

    test('More than 1 required fields not sent fails', async () => {
      const user = {}
      const response = await api.post(baseUrl).send(user).expect(400)
    })
    const newTask = {
      title: 'Jog',
      description: 'Jog 50km in the morning',
    }

  })
  after(async () => {
    mongoose.connection.close()
  })
})
