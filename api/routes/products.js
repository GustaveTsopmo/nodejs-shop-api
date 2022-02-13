const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const ProductController = require('../controllers/productController')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/products/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, res, cb) => {
    cb(null, false);
    cb(null, true);
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

router.get('/', ProductController.index);
router.post('/', auth, upload.single('image'), ProductController.store);
router.get('/:id', ProductController.show);
router.put('/:id', auth, upload.single('image'), ProductController.update);
router.delete('/:id', auth, ProductController.destroy);

module.exports = router;