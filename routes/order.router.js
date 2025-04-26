const express = require('express');
const {check} = require('express-validator');
const {createOrder, getOrder, getAllOrders, updateOrder, deleteOrder} = require('../controllers/order.controller');
// const isAdmin = require('../middleware/isAdmin');
const auth = require('../middleware/auth');
const orderRouter = express.Router();


orderRouter.post('/',[
    check('itemList').notEmpty(),
    check('Address').notEmpty(),
    check('PaymentMethod').notEmpty(),
    check('totalAmount').notEmpty().isNumeric(),

],auth,createOrder);

orderRouter.get('/',auth,getAllOrders);
module.exports = orderRouter;