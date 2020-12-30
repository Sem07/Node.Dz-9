const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    user_id: {
        type: Number,
        required: true
    },
    actions: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    car_id: {
        type: Number,
        required: false
    }
});

module.exports = model('product', ProductSchema);
