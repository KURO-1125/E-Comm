let { validationResult } = require('express-validator');

let productModel = require('../db/models/product');
const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;
// Get All Products
let getAllProducts = async (req,res)=>{

    let skip = req.query["skip"] || 0;
    let limit = req.query["limit"] || 5;
    let category = req.query.category;
    let minPrice = req.query.minPrice;
    let maxPrice = req.query.maxPrice;

    let query = {};
    if(category && category !=""){
        query["category"] = category;
    }

    if((minPrice  && minPrice>0) || (maxPrice && maxPrice>0)){
        // query["price"] = {$gte:minPrice};
        if(minPrice && maxPrice && minPrice>maxPrice){
            return res.status(400).json({success:false,message:"Min Price should be less than Max Price"});
        }
        if(minPrice && maxPrice){
            query["price"] = {$and:[{$gte:minPrice},{$lte:maxPrice}]};
        }
        else if(minPrice && !maxPrice){
            query["price"] = {$gte:minPrice};
        }
        else if(!minPrice && maxPrice){
            query["price"] = {$lte:maxPrice};
        }

    }
    

    let allProducts = await productModel.find(query).skip(skip).limit(limit);
    res.status(200).json({success:true,message:"Product Fetched Successfully",data:allProducts});
}

// Get Product By ID
let getProductsById = async (req,res)=>{
    let productId = req.params.id

    // let product = productModel.find({_id:ObjectId(productId)}=>{
    //     return p.id === productId;
    // });

    let product = await productModel.findById(productId);

    if(!product){
        return res.status(404).json({success:false,message:"Product Not Found"})
    }
    res.status(200).json({success:true,message:"Product Fetched Successfully",data:product});
}

// Add Product
let addProduct = async (req,res)=>{
    try{
        let body = req.body;
        // let error = validateProduct(body);
        // if(error){
        //     console.log(products)
        // }

        const errors = validationResult(req);
        if(errors && !errors.isEmpty()){
            return res.status(400).json({success:false,message:errors.array()});
        }
        let newProduct = new productModel({
            name: body.name,
            desc: body.desc,
            price: body.price,
            category: body.category,
            imgURL: body.imgURL
        });
        await newProduct.save();
        res.status(201).json({success:true,message:"Product Added Successfully"});
    }
    catch(err){
        res.status(400).json({success:false,message:err.message});
    }
}

// Update Product
let updateProduct = async (req,res)=>{
    let productId = req.params.id;
    let newDesc = req.body.desc;
    let newPrice = req.body.price;

    // .save Method
    let product = await productModel.findById(productId);

    if(newDesc && newDesc!= ""){
        product.desc = newDesc;
    }

    if(newPrice && newPrice>0 && newPrice!= ""){
        product.price = newPrice;
    }
    await product.save();
    res.status(200).json({success:true,message:"Product Updated Successfully"});
}


// Delete Product
let deleteProduct = async (req,res)=>{
    let productId = req.params.id;
    await productModel.deleteOne({_id:productId});
    res.status(200).json({success:true,message:"Product Deleted Successfully"});
}


// let validateProduct = (product)=>{
//     if(!product){
//         throw new Error("Product is required");
//     }
//     if(!product.name || !product.desc || !product.price || !product.category || !product.imgURL){
//         throw new Error("All fields are required");
//     }
//     if(isNaN(product.id)){
//         throw new Error("ID must be a number");
//     }
//     return false;
// }

module.exports = {
    getAllProducts,
    getProductsById,
    addProduct,
    updateProduct,
    deleteProduct
}