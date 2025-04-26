const Product = require('../db/models/product');
const Order = require('../db/models/order');

const createOrder = async (req, res) => {
    try {
        const { itemList, Address, PaymentMethod } = req.body;
        const userId = req.user;

        const itemIds = itemList.map(product => product.productId);

        const products = await Product.find({
            _id: { $in: itemIds }
        });

        const orderItems = [];
        for (const product of itemList) {
            const productDetails = products.find(item => item._id.toString() === product.productId);
            if (!productDetails) {
                return res.status(404).json({ success: false, message: `Product with ID ${product.productId} not found` });
            }

            orderItems.push({
                Product: productDetails._id,
                price: productDetails.price,
                quantity: product.quantity,
            });
        }

        const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const newOrder = new Order({
            User: userId,
            orderItem: orderItems,
            Address: Address,
            PaymentMethod: PaymentMethod,
            totalAmount: totalAmount
        });

        const savedOrder = await newOrder.save();
        if (!savedOrder) {
            return res.status(500).json({ success: false, message: "Unable to create order" });
        }
        return res.status(201).json({ success: true, message: "Order created successfully", order: savedOrder });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const userId = req.user;
        const orders = await Order.find({ User: userId })
            .populate('orderItem.Product') 
            .populate('User') 
            .exec();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: "No orders found" });
        }

        return res.status(200).json({ success: true, message: "Orders fetched successfully", orders: orders });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    // getAllOrders,
    // updateOrder,
    // deleteOrder
};