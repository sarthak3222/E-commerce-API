const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Product = require('../models/Product');
const User = require('../models/User');

describe('Product Management', () => {
    let token;
    let user;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);

        user = new User({ name: 'testuser', email: `test${Date.now()}@yopmail.com`, password: 'password' });
        await user.save();

        const response = await request(app)
            .post('/api/users/login')
            .send({ email: user.email, password: 'password' });

        token = response.body.token;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await Product.deleteMany({});
    });

    test('should add a new product', async () => {
        const response = await request(app)
            .post('/api/products')
            .set('x-auth-token', token)
            .send({ name: 'Product1', description: 'Description1', price: 100, category: 'Category1', stock: 10 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Product1');
    });

    test('should retrieve products with pagination', async () => {
        await Product.insertMany([
            { name: 'Product1', description: 'Description1', price: 100, category: 'Category1', stock: 10 },
            { name: 'Product2', description: 'Description2', price: 200, category: 'Category2', stock: 20 },
        ]);

        const response = await request(app)
            .get('/api/products?page=1&limit=1')
            .set('x-auth-token', token);

        expect(response.status).toBe(200);
        expect(response.body.products).toHaveLength(1);
    });

    test('should get a single product by ID', async () => {
        const product = new Product({ name: 'Product1', description: 'Description1', price: 100, category: 'Category1', stock: 10 });
        await product.save();

        const response = await request(app)
            .get(`/api/products/${product._id}`)
            .set('x-auth-token', token);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Product1');
    });

    test('should update a product by ID', async () => {
        const product = new Product({ name: 'Product1', description: 'Description1', price: 100, category: 'Category1', stock: 10 });
        await product.save();

        const response = await request(app)
            .put(`/api/products/${product._id}`)
            .set('x-auth-token', token)
            .send({ name: 'UpdatedProduct', description: 'UpdatedDescription', price: 150, category: 'UpdatedCategory', stock: 5 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'UpdatedProduct');
    });

    test('should delete a product by ID', async () => {
        const product = new Product({ name: 'Product1', description: 'Description1', price: 100, category: 'Category1', stock: 10 });
        await product.save();

        const response = await request(app)
            .delete(`/api/products/${product._id}`)
            .set('x-auth-token', token);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg', 'Product removed');
    });
});
