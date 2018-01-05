const mongoose = require('mongoose');

const tankSchema = mongoose.Schema({
    // sets up layout in database (eg tables)
    _id: mongoose.Schema.Types.ObjectId, // serial id, long string used internally
    name: { type: String, required: true},
    details: {
        tank: {
            width: {value: { type: Number }, unit: { type: String }}
        },
        water: {
            level: {
                change: {value: { type: Number }, unit: { type: String }}
            },
            stats: {
                ph: {type: Number},
                gh: {type: Number},
                kh: {type: Number},
                cl: {type: Number},
                nitrite: {type: Number},
                nitrate: {type: Number},
                ammonia: {type: Number}
            }
        },
        location: {
            name: {type: String},
            tempAVG: {value: { type: Number }, unit: { type: String }},
        }
    }
    // product: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Product', // relate to products.js schema name
    //     required: true
        
    // },
    // quantity: {
    //     type: Number,
    //     default: 1 // use default if no value givven
    // }
});

module.exports = mongoose.model('Tank', tankSchema);