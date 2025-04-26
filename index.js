const express = require("express");
const bodyParser = require("body-parser");
const productRouter = require("./routes/product.router");
const userRouter = require("./routes/user.router");
const orderRouter = require("./routes/order.router");
const mongoose = require("./db/connection");
require('dotenv').config();

const app = express();
app.use(bodyParser.json());


app.use("/product", productRouter);
app.use("/user",userRouter);
app.use("/order",orderRouter);


app.use((req, res) => {
  res.status(404).send(`
        <body>
            <h1>
                PAGE NOT FOUND<br>
                <small>404</small><br>
                <small>Sorry, the page you are looking for does not exist.</small><br>
            </h1>
        </body>
    `);
});

app.listen(1125, (err) => {
  if(err) return console.log(err);
  console.log("Server running at Localhost http://localhost:1125");
});
