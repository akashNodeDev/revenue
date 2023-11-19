const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    CustId:{type:Number,default:0,ref:"Customer"},
    invoiceDate:{type:Date,default:null},
    lineItems:[
        {
            prodId:{type:Number,default:0,ref:"Product"},
            prodCount:{type:Number,default:0},
            Cost:{type:Number,default:0.0}
        }
    ],
    orderStatus:{type:String,default:""},
    statusDate:{type:Date,default:null},

},{timestamps:true,versionKey:false})

module.exports = mongoose.model('Order',OrderSchema);