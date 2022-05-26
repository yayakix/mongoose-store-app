const express = require("express");
const productRouter = express.Router();
const Product = require("../models/product");
const productSeed = require("../models/seed");


productRouter.get("/", (req, res) => {
  Product.find({}, (error, allProducts) => {
    res.render("index.ejs", {
      products: allProducts,
    });
  });
});

// seed data
productRouter.get("/seed", (req, res) => {
  Product.deleteMany({}, (error, allProducts) => {});

  Product.create(productSeed, (error, data) => {
    res.redirect("/products");
  });
});
// create
productRouter.post("/", (req, res) => {
  // order products
  Product.create(req.body, (error, createdProduct) => {
    res.redirect("/products");
  });
});

// new
productRouter.get("/new", (req, res) => {
  res.render("new.ejs");
});
// edit

// Edit
productRouter.get("/:id/edit", (req, res) => {
  Product.findById(req.params.id, (error, foundProduct) => {
    res.render("edit.ejs", {
      product: foundProduct,
    });
  });
});
// show
productRouter.get("/:id", (req, res) => {
  Product.findById(req.params.id, (err, foundProduct) => {
    let num = Number(foundProduct.qty);
    //   num +=1
    res.render("show.ejs", {
      product: foundProduct,
      amount: num,
    });
  });
});

// delete
productRouter.delete("/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id, (error, deletedProducts) => {
    // res.send({ success: true });
    res.redirect("/products");
  });
});

// update
productRouter.put("/:id", (req, res) => {
  Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (error, updateProduct) => {
      res.redirect("/products");
    }
  );
});
// quantity
productRouter.post("/:id/buy", (req, res) => {
  Product.findById(req.params.id, (err, data) => {
    if (data.qty <= 0) {
      data.qty = "out of stonk";
    } else {
      data.qty--;
      data.save();
    }

    res.redirect(`/products/${data.id}`);
  });
});



module.exports = productRouter;