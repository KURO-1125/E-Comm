const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;
const orderItemSchema = require('./orderItem')
const orderSchema = new mongoose.Schema ({
    User: {
        type : ObjectId,
        required: true
    },
    Address: {
        type : String,
        required : true
    },
    orderItem: {
        type: [orderItemSchema],
        required: true,
    },
    status : {
       type : String,
       enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
       default: "Pending",
    },
    PaymentMethod: {
           type : String,
           enum: ["online", "COD"],
           default: "Cod"
    },
    paymentStatus: {
          type : String,
          enum: ["Paid", "Pending", "Failed"],
          default: "Pending"
    },
    totalAmount : {
        type : Number,
        required: true,
        
    },
    CreatedAt: {
     type: Date,
     default: Date.now()
    },
    updatedAt : {
        type : Date,
        default : Date.now()
    }


})

module.exports  = mongoose.model("order" , orderSchema);