const {test, describe, after} = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const { default: mongoose } = require('mongoose')
const api = supertest(app)

test('reset DB correctly', async()=>{
    const response = await  api.post('/api/reset')
    .expect(200)

    console.log(response.body)
})

after(()=>{
    mongoose.connection.close()
})