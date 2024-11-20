const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const supertest = require('supertest')
const User = require('../models/user')
const { default: mongoose } = require('mongoose')
const api = supertest(app)

describe('User endpoints', () => {
    const newUser = {
        username: 'Daniel',
        password: 'daniel211004',
        email: 'edu211004@gmail.com'
    }
    const baseUrl = '/api/users'
    beforeEach(async () => {
        await User.deleteMany()
    })
    const errorMessages = {
        username: 'User validation failed: username: Path `username` is required.',
        password: 'User validation failed: password: Path `password` is required.',
        email: 'User validation failed: email: Path `email` is required.'
    }

    const checkError = async (incompleteUser, expectedErrorMessage) => {
        const response = await api.post(baseUrl)
            .send(incompleteUser)
            .expect(400)

        assert.strictEqual(response.body.error, expectedErrorMessage)
    }
    test('New user added correctly', async () => {
        await api.post(baseUrl)
            .send(newUser)
            .expect(201)
    })
    test('No duplicated usernames allowed', async () => {
        await api.post(baseUrl)
            .send(newUser)
            .expect(201)

        await api.post(baseUrl)
            .send(newUser)
            .expect(409)
    })

    test('username field not sent errors', async () => {
        const incompleteUser = {
            password: 'daniel211132',
            email: 'edu211004@gmail.com'
        }
        await checkError(incompleteUser, errorMessages.username)

    })
    test("Username doesn't match min lenght", async()=>{
        const IncUser = {
            username: 'Dan',
            password: 'daniel211004',
            email: 'edu211004@gmail.com'
        }
        const response = await api.post(baseUrl)
        .send(IncUser)
        .expect(400)
        assert(response.body.error.includes('length'))
    })
    test("Username doesn't match min lenght", async()=>{
        const IncUser = {
            username: 'Daniel',
            password: 'dan',
            email: 'edu211004@gmail.com'
        }
        const response = await api.post(baseUrl)
        .send(IncUser)
        .expect(400)
        assert(response.body.error.includes('length'))
    })
    test('email field not sent errors', async () => {
        const incompleteUser = {
            username: "Daniel",
            password: 'daniel211132',
        }
        await checkError(incompleteUser, errorMessages.email)
    })
    test('More than 1 required fields not sent fails', async()=>{
        const user = {}
        const response = await api.post(baseUrl).send(user).expect(400)
    })


    after(async () => {
        mongoose.connection.close()
    })
})