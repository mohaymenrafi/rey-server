const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

// @desc Get all products
// @route GET /api/products
// @access public
const getAllProducts = asyncHandler(async (req, res) => {
	const products = await Product.find().lean();
	if (!products?.length) {
		return res.status(400).json({ message: "Product not found" });
	}
	res.json(products);
});

// @desc create a new product
// @route POST /api/products
// @access private
const createNewProduct = asyncHandler(async (req, res) => {
	const { title, desc, img, price, categories, size, color, inStock } =
		req.body;
});
