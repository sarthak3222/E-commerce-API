const Order = require('../models/Order');
const Product = require('../models/Product');

exports.placeOrder = async (req, res) => {
    const { products } = req.body;

    try {
        for (const item of products) {
            const product = await Product.findById(item.product);

            if (!product) {
                console.error(`Product with ID ${item.product} not found`);
                return res.status(404).json({ msg: `Product with ID ${item.product} not found` });
            }

            if (product.stock < item.quantity) {
                console.error(`Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
                return res.status(400).json({ msg: `Insufficient stock for product: ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` });
            }
        }

        const order = new Order({
            user: req.user.id,
            products,
        });

        console.log('Order before saving:', order);

        await order.save();

        console.log('Order after saving:', order);

        for (const item of products) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock -= item.quantity;
                await product.save();
            } else {
                console.error(`Product with ID ${item.product} not found during stock update`);
            }
        }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('products.product');
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    try {
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
