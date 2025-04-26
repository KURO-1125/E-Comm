const express = require("express");
const bodyParser = require("body-parser");
const {getAllProducts, getProductsById, addProduct, updateProduct, deleteProduct} = require("../controllers/product.controller");
const {check} = require("express-validator");

let productRouter = express.Router();


productRouter.get("/",getAllProducts)

productRouter.get("/:id",getProductsById)

productRouter.post("/",[
    // check('id').notEmpty().isNumeric(),
    check('name').isLength({min:5})
],addProduct)

productRouter.patch("/:id",updateProduct)

productRouter.delete("/:id",deleteProduct)

module.exports = productRouter;