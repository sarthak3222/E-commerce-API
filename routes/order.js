const express = require('express');
const router = express.Router();
const {
    placeOrder,
    getOrderHistory,
    updateOrderStatus,
} = require('../controller/orderController');
const auth = require('../middleware/auth');
/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - user
 *         - products
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the order
 *         user:
 *           type: string
 *           description: The user id who placed the order
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: The product id
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product
 *         status:
 *           type: string
 *           description: The status of the order
 *         date:
 *           type: string
 *           description: The date when the order was placed
 *       example:
 *         id: d5fE_asz
 *         user: 5f8d0d55b54764421b7156c6
 *         products: [{ product: '5f8d0d55b54764421b7156c7', quantity: 2 }]
 *         status: Pending
 *         date: 2024-07-30T06:39:26.283Z
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: The orders managing API
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Places a new order
 *     tags: [Orders]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: The product id
 *                     quantity:
 *                       type: integer
 *                       description: The quantity of the product
 *     responses:
 *       200:
 *         description: The order was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 */
router.post('/', auth, placeOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Gets order history
 *     tags: [Orders]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: The list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 */
router.get('/', auth, getOrderHistory);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Updates an order status by id
 *     tags: [Orders]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the order
 *     responses:
 *       200:
 *         description: The order status was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Some server error
 */
router.put('/:id', auth, updateOrderStatus);

module.exports = router;
