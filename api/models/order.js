const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);