const express = require('express');
const router = express.Router();
const {
    addProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProduct,
} = require('../controller/productController');
const auth = require('../middleware/auth');

router.post('/', auth, addProduct);
router.get('/', getProducts);
router.get('/:id', auth, getProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
