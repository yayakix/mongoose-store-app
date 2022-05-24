const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Product = require('./models/products')
const productSeed = require("./models/seed");

app.use(express.urlencoded({ extended: true }));
require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err) => console.log(err.message + " is mongo not running?"));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));


// seed data
app.get("/products/seed", (req, res) => {
  Product.deleteMany({}, (error, allProducts) => {});

  Product.create(productSeed, (error, data) => {
    res.redirect("/products");
  });
});
// create
app.post("/products", (req, res) => {

    // order products
  Product.create(req.body, (error, createdProduct) => {
    res.redirect("/products");
  });
});

app.get("/products", (req, res) => {
  Product.find({}, (error, allProducts) => {
    res.render("index.ejs", {
      products: allProducts,
    });
  });
});

// new
app.get("/products/new", (req, res) => {
  res.render("new.ejs");
});
// show
app.get("/products/:id", (req, res) => {
  Product.findById(req.params.id, (err, foundProduct) => {
    res.render("show.ejs", {
      product: foundProduct,
    });
  });
});




const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server is listning on port: ${PORT}`));
