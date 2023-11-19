const mongoose = require("mongoose");

const { DB_URL } = process.env;

exports.connect = () => {
  mongoose
    .connect(DB_URL)
    .then(console.log("DB Connected successfully"))
    .catch((err) => {
      console.log("DB connection failed");
      console.log(err);
      process.exit(1);
    });
};
