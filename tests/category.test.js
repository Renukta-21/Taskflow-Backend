const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const Category = require('../models/category')
const api = supertest(app)

const baseURL = '/api/categories'
let firstCat, newLogin, authorization
const firstCategory = {
  name: 'Excercise',
  icon: '🔥',
}
const newCategory = {
  name: 'Study',
  icon: '🔥',
}

describe('Category Routes', () => {
  beforeEach(async () => {
    await Category.deleteMany({})
    newLogin = await api.post('/api/login').send({
      username: 'Daniel',
      password: 'daniel211004',
    })
    .expect(200)

    authorization = `Bearer ${newLogin.body.token}`
  })

  test('No duplicated categories allowed', async () => {
    const response = await api
      .post(baseURL)
      .set('Authorization', authorization)
      .send({ name: 'Excercise', icon: '🔥' })
      .expect(201)
      console.log(response.body)
  })

  /* test('Creates a new category successfully', async () => {
    await api
      .post(baseURL)
      .set('Authorization', authoriz)
      .send(newCategory)
      .expect(201)
  })

  test('Category successfully eliminated', async () => {
    await api
      .delete(`${baseURL}/${firstCat._id}`)
      .set('Authorization', authoriz)
      .expect(204)
  })
  test('Returns 404 when deleting a non-existing category', async () => {
    const response = await api
      .post(baseURL)
      .set('Authorization', authoriz)
      .send(newCategory)
      .expect(201)

    await Category.findByIdAndDelete(response.body._id)
    await api
      .delete(`${baseURL}/${response.body._id}`)
      .set('Authorization', authoriz)
      .expect(404)
  })
  test('Returns 400 if name is missing when creating a category', async () => {
    const response = await api
      .post(baseURL)
      .set('Authorization', authoriz)
      .send({ icon: '🔥' })
      .expect(400)

    assert.ok(
      response.body.error.includes(
        'category validation failed: name: Path `name` is required.'
      )
    )
  }) */
  after(async () => {
    await mongoose.connection.close()
  })
})
