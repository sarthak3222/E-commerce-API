const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

describe('User Management', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    test('should register a new user', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({ name: 'testuser', email: `test${Date.now()}@yopmail.com`, password: 'password' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    test('should login a user', async () => {
        const email = `test${Date.now()}@yopmail.com`;
        const user = new User({ name: 'testuser', email: email, password: 'password' });
        await user.save();

        const response = await request(app)
            .post('/api/users/login')
            .send({ email: email, password: 'password' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});
