const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    // sets up layout in database (eg tables)
    _id: mongoose.Schema.Types.ObjectId, // serial id, long string ued internally
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // relate to products.js schema name
        required: true
        
    },
    quantity: {
        type: Number,
        default: 1 // use default if no value givven
    }
});

module.exports = mongoose.model('Order', orderSchema);