const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    // sets up layout in database (eg tables)
    _id: mongoose.Schema.Types.ObjectId, // serial id, long string ued internally
     name: { type: String, required: true },
     price: { type: Number, required: true }
})

module.exports = mongoose.model('Product', productSchema);