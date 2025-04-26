const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.ObjectId;

const orderItemSchema = new mongoose.Schema ({
    Product: {
        type : ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price:  {
        type : Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

})

module.exports = orderItemSchema