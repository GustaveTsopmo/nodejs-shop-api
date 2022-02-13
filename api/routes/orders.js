const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const OrderController = require('../controllers/orderController');

router.get('/', auth, OrderController.index);
router.post('/', auth, OrderController.store);
router.get('/:id', auth, OrderController.show);
router.put('/:id', auth, OrderController.update);
router.delete('/:id', auth, OrderController.destroy);

module.exports = router;