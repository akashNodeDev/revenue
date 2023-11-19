const mongoose = require("mongoose");

const  ProductSchema = new mongoose.Schema({
    ProductName:{type:String,default:""},
    productDescription:{type:String,default:""},
    unitPrice:{type:Number,defalt:0.0}
},{timestamps:true,versionKey:false});

module.exports = mongoose.model("Product",ProductSchema);