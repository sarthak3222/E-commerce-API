const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

describe('Order Processing', () => {
    let token;
    let user;
    let product;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);

        user = new User({ name: 'testuser', email: `test${Date.now()}@yopmail.com`, password: 'password' });
        await user.save();

        const response = await request(app)
            .post('/api/users/login')
            .send({ email: user.email, password: 'password' });

        token = response.body.token;

        product = new Product({ name: 'Product1', description: 'Description1', price: 100, category: 'Category1', stock: 10 });
        await product.save();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await Order.deleteMany({});
        await Product.deleteMany({});
        await User.deleteMany({});
    });

    test('should place an order', async () => {
        const response = await request(app)
            .post('/api/orders')
            .set('x-auth-token', token)
            .send({ products: [{ product: product._id, quantity: 2 }] });

        console.log('Response from placing order:', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('products');

        const updatedProduct = await Product.findById(product._id);
        expect(updatedProduct.stock).toBe(8);
    });

    test('should retrieve order history', async () => {
        const order = new Order({
            user: user._id,
            products: [{ product: product._id, quantity: 2 }],
        });
        await order.save();

        const response = await request(app)
            .get('/api/orders')
            .set('x-auth-token', token);

        console.log('Order history response:', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toHaveProperty('products');
    });

    test('should update order status', async () => {
        const order = new Order({
            user: user._id,
            products: [{ product: product._id, quantity: 2 }],
            status: 'Pending',
        });
        await order.save();

        const response = await request(app)
            .put(`/api/orders/${order._id}`)
            .set('x-auth-token', token)
            .send({ status: 'Shipped' });

        console.log('Response from updating order status:', response.body);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'Shipped');
    });
});
