const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

const UserController = require('../controllers/userController')

router.post('/signup', UserController.signup);
router.post('/login', UserController.login)
router.get('/user/:id', auth, UserController.show)
router.delete('/:id', auth, UserController.destroy)

module.exports = router