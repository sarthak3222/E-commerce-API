const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getOrderHistory,
    updateOrderStatus,
} = require('../controller/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, placeOrder);
router.get('/', auth, getOrderHistory);
router.put('/:id', auth, updateOrderStatus);

module.exports = router;
