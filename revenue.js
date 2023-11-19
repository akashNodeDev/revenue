require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
app.use(express.json());

const OrderModel = require("./models/order");
const ProductModel = require("./models/product");
const CustomerModel = require("./models/customer");

app.get("/", (req, res) => {
  res.send("<h1>Server is running for revenue project</h1>");
});

app.get("/revenue", async (req, res) => {
  try {
    let orderData = await OrderModel.aggregate([
      {
        $unwind: {
          path: "$lineItems",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$CustId",
          cost: { $sum: "$lineItems.Cost" },
          prodInfo: {
            $push: {
              prodId: "$lineItems.prodId",
              totalQty: "$lineItems.prodCount",
              totalVal: {
                $multiply: ["$lineItems.Cost", "$lineItems.prodCount"],
              },
            },
          },
        },
      },
      {
        $sort: { cost: -1 },
      },
      {
        $limit: 10,
      },
      {
        $unwind: {
          path: "$prodInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          let: { productId: "$prodInfo.prodId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$productId"],
                },
              },
            },
            {
              $project: { ProductName: 1, _id: 0 },
            },
          ],
          as: "product_data",
        },
      },
      {
        $unwind: "$product_data",
      },
      {
        $group: {
          _id: "$_id",
          cost: { $first: "$cost" },
          prodInfo: {
            $push: {
              prodDetails: "$prodInfo",
              productName: "$product_data.ProductName",
            },
          },
        },
      },
      {
        $lookup: {
          from: "customers",
          let: { customerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$_id", "$$customerId"],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                CustomerName: 1,
                _id: 0,
              },
            },
          ],
          as: "customer_data",
        },
      },
      {
        $unwind: "$customer_data",
      },
      {
        $project: {
          customerId: "$_id",
          customerName: "$customer_data.CustomerName",
          cost: "$cost",
          prodInfo: "$prodInfo",
          _id: 0,
        },
      },
    ]);

    if (orderData) {
      res.status(200).json({
        message: "Revenue data fetched successfully",
        data: orderData,
      });
    } else {
      res.status(400).send("No Data Found!");
    }
  } catch (error) {
    console.log("Error=", error);
  }
});

module.exports = app;
