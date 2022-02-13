const Product = require('../models/product');
const { access, unlink } = require('fs')

exports.index = (req, res, next) => {
    Product.find()
        .then((result) => { res.status(200).json(result) })
        .catch(err => { next(err) });
}

exports.store = (req, res, next) => {
    if (req.file !== undefined) {
        req.body.image = req.file.path
    }
    const product = new Product(req.body)
    product.save()
        .then((result) => { res.status(201).json(result) })
        .catch(err => { next(err) });
}

exports.show = (req, res, next) => {
    Product.findById(req.params.id)
        .then(result => {
            if (result) res.status(200).json(result)
            else res.status(404).json({ message: 'Product not found' });
        })
        .catch(err => { next(err) });
}

exports.update = (req, res, next) => {
    if (req.file !== undefined) {
        req.body.image = req.file.path
        Product.findById(req.params.id)
            .then((product) => {
                if (product.image != undefined) {
                    access(product.image, (err) => {
                        if (!err) {
                            unlink(product.image, (err) => {
                                if (err) next(err);
                            })
                            return;
                        }
                    });
                }
            })
            .catch(err => { next(err) });
    }
    Product.findByIdAndUpdate(req.params.id, { $set: req.body })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => { next(err) });
}

exports.destroy = (req, res, next) => {
    Product.findById(req.params.id)
        .then((product) => {
            if (product.image != undefined) {
                access(product.image, (err) => {
                    if (!err) {
                        unlink(product.image, (err) => {
                            if (err) next(err);
                        })
                        return;
                    }
                });
            }
        })
        .catch(err => { next(err) });

    Product.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(200).json({
                message: 'Product deleted successfully.'
            });
        })
        .catch(err => { next(err) });
}