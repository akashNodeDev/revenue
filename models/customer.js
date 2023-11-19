const mongoose=require("mongoose");

const CustomerSchema = new mongoose.Schema({
    CustomerName:{type:String,default:""},
    customerDescription:{type:String,default:""},
    Address:{type:String,default:""}
},{timestamps:true,versionKey:false});

module.exports = mongoose.model('Customer',CustomerSchema);

