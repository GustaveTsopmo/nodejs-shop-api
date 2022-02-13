const Order = require('../models/order')
const Product = require('../models/product');

exports.index = (req, res, next) => {
    Order.find()
        .populate('product')
        .then(orders => { res.status(200).json(orders) })
        .catch(err => { next(err); });
};

exports.store = (req, res, next) => {
    Product.findById(req.body.productId)
        .exec()
        .then((product) => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found',
                })
            }
            const order = new Order({
                quantity: req.body.quantity,
                product: req.body.productId
            });
            order.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json(result);
                })
                .catch(err => { next(err); });
        })
        .catch(err => { next(err); });
};

exports.show = (req, res, next) => {
    Order.findById(req.params.id)
        .populate('product')
        .exec()
        .then(result => {
            console.log('Get Order result: ', result)
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(404).json({
                    message: 'Order not found'
                });
            }
        })
        .catch(err => { next(err); });
};

exports.update = (req, res, next) => {
    Order.findByIdAndUpdate(req.params.id, { $set: { quantity: req.body.quantity } })
        .then(result => {
            console.log('Put order result', result)
            res.status(200).json(result);
        })
        .catch(err => { next(err); });
};


exports.destroy = (req, res, next) => {
    Order.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(200).json({
                message: 'Order deleted successfully.'
            });
        })
        .catch(err => { next(err); });
}